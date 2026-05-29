const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const CELEBRITY_CATEGORIES = [
  'musician', 'dj', 'comedian', 'actor',
  'athlete', 'influencer', 'pastor', 'politician',
];

const EVENT_STATUS = ['upcoming', 'live', 'past', 'sold_out'];

const TIER_LEVELS = ['general', 'vip', 'vvip', 'meetgreet'];

const SPONSOR_TIERS = ['title', 'platinum', 'gold', 'silver', 'community'];

const ORDER_STATUS = ['pending', 'paid', 'cancelled', 'expired'];

const TICKET_STATUS = ['active', 'used', 'refunded'];

const APPLICATION_STATUS = ['pending', 'reviewing', 'approved'];

const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, max: 10 },
  API: { windowMs: 15 * 60 * 1000, max: 200 },
  OTP: { windowMs: 60 * 1000, max: 3 },
};

module.exports = {
  USER_ROLES,
  CELEBRITY_CATEGORIES,
  EVENT_STATUS,
  TIER_LEVELS,
  SPONSOR_TIERS,
  ORDER_STATUS,
  TICKET_STATUS,
  APPLICATION_STATUS,
  RATE_LIMITS,
};
