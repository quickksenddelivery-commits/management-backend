const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user._id);
  user.password = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;
  res.status(statusCode).json({ status: 'success', token, data: { user } });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return next(new AppError('An account with this email already exists', 409));

  const user = await User.create({ name, email, password });
  logger.info(`New user registered — ${user.email} — IP: ${req.ip}`);
  sendAuth(res, user, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password +loginAttempts +lockUntil'
  );

  if (!user) {
    logger.warn(`Login failed: user not found — ${email} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (user.isLocked) return next(new AppError('Account temporarily locked. Try again later', 423));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    logger.warn(`Login failed: wrong password — ${email} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (!user.isActive) return next(new AppError('Account deactivated. Contact support', 403));

  await user.updateOne({ loginAttempts: 0, $unset: { lockUntil: 1 }, lastLogin: new Date() });

  logger.info(`Login — ${email} — IP: ${req.ip}`);
  sendAuth(res, user);
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ status: 'success', data: { user } });
});
