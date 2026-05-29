const Celebrity = require('../models/Celebrity');
const Event = require('../models/Event');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { parsePagination, paginationMeta } = require('../utils/helpers');

exports.list = asyncHandler(async (req, res) => {
  const { category, search, verified } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const filter = {};
  if (category) filter.category = category;
  if (verified !== undefined) filter.verified = verified === 'true';
  if (search) filter.$text = { $search: search };

  const [data, total] = await Promise.all([
    Celebrity.find(filter).sort({ followers: -1 }).skip(skip).limit(limit),
    Celebrity.countDocuments(filter),
  ]);

  res.json({ status: 'success', meta: paginationMeta(total, page, limit), data: { celebrities: data } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const celebrity = await Celebrity.findById(req.params.id);
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', data: { celebrity } });
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const celebrity = await Celebrity.findById(req.params.id);
  if (!celebrity) return next(new AppError('Celebrity not found', 404));

  const events = await Event.find({ celebrityId: req.params.id }).sort({ date: 1 });
  res.json({ status: 'success', data: { events } });
});

exports.create = asyncHandler(async (req, res) => {
  const celebrity = await Celebrity.create(req.body);
  res.status(201).json({ status: 'success', data: { celebrity } });
});

exports.update = asyncHandler(async (req, res, next) => {
  const celebrity = await Celebrity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', data: { celebrity } });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const celebrity = await Celebrity.findByIdAndDelete(req.params.id);
  if (!celebrity) return next(new AppError('Celebrity not found', 404));
  res.json({ status: 'success', message: 'Celebrity deleted' });
});
