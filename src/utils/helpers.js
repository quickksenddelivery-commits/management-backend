const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const generateReference = (prefix = 'REF') => {
  return `${prefix}-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
};

/** Short, URL-safe id with a domain prefix, e.g. slugId('celeb') → 'celeb-k3f9a2b7'. */
const slugId = (prefix) => {
  return `${prefix}-${uuidv4().replace(/-/g, '').slice(0, 8)}`;
};

/** QR payload string for a ticket. */
const generateQRCode = () => {
  return `RCHDTKT-${Date.now()}-${uuidv4().replace(/-/g, '').slice(0, 9).toUpperCase()}`;
};

const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const sanitizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};

const maskEmail = (email) => {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
};

module.exports = {
  generateOTP,
  hashOTP,
  generateReference,
  slugId,
  generateQRCode,
  paginationMeta,
  parsePagination,
  sanitizePhone,
  maskEmail,
};
