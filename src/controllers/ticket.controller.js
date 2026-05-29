const Ticket = require('../models/Ticket');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');

exports.list = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const tickets = await Ticket.find(filter).sort({ purchasedAt: -1 });
  res.json({ status: 'success', data: { tickets } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user._id });
  if (!ticket) return next(new AppError('Ticket not found', 404));
  res.json({ status: 'success', data: { ticket } });
});
