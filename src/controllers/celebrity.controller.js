const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { parsePagination, paginationMeta, slugId } = require('../utils/helpers');

exports.list = asyncHandler(async (req, res) => {
  const { category, search, verified } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const where = {};
  if (category) where.category = category;
  if (verified !== undefined) where.verified = verified === 'true';
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.celebrity.findMany({ where, orderBy: { followers: 'desc' }, skip, take: limit }),
    prisma.celebrity.count({ where }),
  ]);

  res.json({ status: 'success', meta: paginationMeta(total, page, limit), data: { celebrities: data } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const celebrity = await prisma.celebrity.findUnique({ where: { id: req.params.id } });
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', data: { celebrity } });
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const celebrity = await prisma.celebrity.findUnique({ where: { id: req.params.id } });
  if (!celebrity) return next(new AppError('Celebrity not found', 404));

  const events = await prisma.event.findMany({
    where: { celebrityId: req.params.id },
    include: { ticketTiers: true },
    orderBy: { date: 'asc' },
  });
  res.json({ status: 'success', data: { events } });
});

exports.create = asyncHandler(async (req, res) => {
  const celebrity = await prisma.celebrity.create({ data: { id: slugId('celeb'), ...req.body } });
  res.status(201).json({ status: 'success', data: { celebrity } });
});

exports.update = asyncHandler(async (req, res, next) => {
  const celebrity = await prisma.celebrity
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', data: { celebrity } });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const celebrity = await prisma.celebrity.delete({ where: { id: req.params.id } }).catch(() => null);
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', message: 'Celebrity deleted' });
});
