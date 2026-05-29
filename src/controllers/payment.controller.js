const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { COINS } = require('../config/coins');

// Public list of supported coins (without exposing internal config helpers).
exports.coins = asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: { coins: COINS } });
});
