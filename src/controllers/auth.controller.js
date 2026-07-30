const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { env } = require('../config/env');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { hashPassword, comparePassword, isLocked, incLoginAttempts, toPublicUser } = require('../services/user.service');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const sendAuth = (res, user, statusCode = 200) => {
  const token = signToken(user.id);
  res.status(statusCode).json({ status: 'success', token, data: { user: toPublicUser(user) } });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) return next(new AppError('An account with this email already exists', 409));

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, password: await hashPassword(password) },
  });
  logger.info(`New user registered — ${user.email} — IP: ${req.ip}`);
  sendAuth(res, user, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    logger.warn(`Login failed: user not found — ${email} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (isLocked(user)) return next(new AppError('Account temporarily locked. Try again later', 423));

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    await incLoginAttempts(user);
    logger.warn(`Login failed: wrong password — ${email} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (!user.isActive) return next(new AppError('Account deactivated. Contact support', 403));

  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockUntil: null, lastLogin: new Date() },
  });

  logger.info(`Login — ${email} — IP: ${req.ip}`);
  sendAuth(res, user);
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: { user: toPublicUser(req.user) } });
});
