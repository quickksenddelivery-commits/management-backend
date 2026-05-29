const User = require('../models/User');
const Celebrity = require('../models/Celebrity');
const Event = require('../models/Event');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ status: 'success', data: { user } });
});

/* ── Following ── */
exports.getFollowing = asyncHandler(async (req, res) => {
  const celebrities = await Celebrity.find({ _id: { $in: req.user.following } });
  res.json({ status: 'success', data: { celebrities } });
});

exports.follow = asyncHandler(async (req, res, next) => {
  const { celebrityId } = req.params;
  const exists = await Celebrity.exists({ _id: celebrityId });
  if (!exists) return next(new AppError('Celebrity not found', 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { following: celebrityId } },
    { new: true }
  );
  res.json({ status: 'success', data: { following: user.following } });
});

exports.unfollow = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { following: req.params.celebrityId } },
    { new: true }
  );
  res.json({ status: 'success', data: { following: user.following } });
});

/* ── Saved events ── */
exports.getSavedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ _id: { $in: req.user.savedEvents } });
  res.json({ status: 'success', data: { events } });
});

exports.saveEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const exists = await Event.exists({ _id: eventId });
  if (!exists) return next(new AppError('Event not found', 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { savedEvents: eventId } },
    { new: true }
  );
  res.json({ status: 'success', data: { savedEvents: user.savedEvents } });
});

exports.unsaveEvent = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { savedEvents: req.params.eventId } },
    { new: true }
  );
  res.json({ status: 'success', data: { savedEvents: user.savedEvents } });
});
