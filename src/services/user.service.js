const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

const LOCK_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000;

const hashPassword = (password) => bcrypt.hash(password, 12);

const comparePassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const isLocked = (user) => !!(user.lockUntil && user.lockUntil > new Date());

/** Mirrors the old Mongoose `incLoginAttempts` — resets a stale lock or increments/locks. */
const incLoginAttempts = async (user) => {
  if (user.lockUntil && user.lockUntil < new Date()) {
    return prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 1, lockUntil: null },
    });
  }
  const attempts = user.loginAttempts + 1;
  const data = { loginAttempts: attempts };
  if (attempts >= LOCK_ATTEMPTS && !isLocked(user)) {
    data.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
  }
  return prisma.user.update({ where: { id: user.id }, data });
};

/** Strips sensitive fields before sending a user out over the API. */
const toPublicUser = (user) => {
  const { password, loginAttempts, lockUntil, ...rest } = user;
  return rest;
};

module.exports = { hashPassword, comparePassword, isLocked, incLoginAttempts, toPublicUser };
