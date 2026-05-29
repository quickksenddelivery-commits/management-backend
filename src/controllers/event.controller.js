const Event = require('../models/Event');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { parsePagination, paginationMeta } = require('../utils/helpers');

exports.list = asyncHandler(async (req, res) => {
  const { category, city, country, status, featured, search, celebrityId } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const filter = {};
  if (category) filter.category = category;
  if (city) filter.city = city;
  if (country) filter.country = country;
  if (status) filter.status = status;
  if (celebrityId) filter.celebrityId = celebrityId;
  if (featured !== undefined) filter.isFeatured = featured === 'true';
  if (search) filter.$text = { $search: search };

  const [data, total] = await Promise.all([
    Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  res.json({ status: 'success', meta: paginationMeta(total, page, limit), data: { events: data } });
});

exports.featured = asyncHandler(async (req, res) => {
  const events = await Event.find({ isFeatured: true }).sort({ date: 1 });
  res.json({ status: 'success', data: { events } });
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', data: { event } });
});

exports.create = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ status: 'success', data: { event } });
});

exports.update = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', data: { event } });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.json({ status: 'success', message: 'Event deleted' });
});
