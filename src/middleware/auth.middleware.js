const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { env } = require('../config/env');
const { AppError } = require('./errorHandler.middleware');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return next(new AppError('User no longer exists', 401));
    if (!user.isActive) return next(new AppError('Account deactivated', 403));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return next(new AppError('Token expired', 401));
    if (error.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401));
    next(error);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};

/**
 * Optional defense-in-depth for admin routes. When ADMIN_SECRET is configured,
 * admin requests must also carry a matching `x-admin-secret` header (the frontend
 * already sends it). When ADMIN_SECRET is unset this is a no-op, so admin access
 * is governed purely by the admin JWT role.
 */
const requireAdminSecret = (req, res, next) => {
  if (!env.ADMIN_SECRET) return next();
  const provided = req.headers['x-admin-secret'];
  if (!provided || provided !== env.ADMIN_SECRET) {
    return next(new AppError('Invalid or missing admin secret', 403));
  }
  next();
};

// Convenience guard for admin-only routes: valid admin JWT (+ secret when configured).
const adminGuard = [authenticate, authorize('admin'), requireAdminSecret];

module.exports = { authenticate, authorize, requireAdminSecret, adminGuard };
