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
  return `FCPTKT-${Date.now()}-${uuidv4().replace(/-/g, '').slice(0, 9).toUpperCase()}`;
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

/**
 * Shapes a Prisma Order (with `items`/`tickets` relations loaded) into the
 * envelope the frontend expects: nested `attendee`/`coin` objects, a flat
 * `user` id, and `_id` kept alongside `id` for the existing frontend contract.
 */
const serializeOrder = (order) => ({
  ...order,
  _id: order.id,
  user: order.userId,
  attendee: { name: order.attendeeName, email: order.attendeeEmail },
  coin: { symbol: order.coinSymbol, network: order.coinNetwork, address: order.coinAddress },
});

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
  serializeOrder,
};
