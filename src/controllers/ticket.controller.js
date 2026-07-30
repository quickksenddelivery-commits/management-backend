const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');

exports.list = asyncHandler(async (req, res) => {
  const where = { userId: req.user.id };
  if (req.query.status) where.status = req.query.status;

  const tickets = await prisma.ticket.findMany({ where, orderBy: { purchasedAt: 'desc' } });
  res.json({ status: 'success', data: { tickets } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const ticket = await prisma.ticket.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!ticket) return next(new AppError('Ticket not found', 404));
  res.json({ status: 'success', data: { ticket } });
});
