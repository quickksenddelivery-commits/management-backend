const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const { toPublicUser } = require('../services/user.service');

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const user = await prisma.user.update({ where: { id: req.user.id }, data: updates });
  res.json({ status: 'success', data: { user: toPublicUser(user) } });
});

/* ── Following ── */
exports.getFollowing = asyncHandler(async (req, res) => {
  const celebrities = await prisma.celebrity.findMany({ where: { id: { in: req.user.following } } });
  res.json({ status: 'success', data: { celebrities } });
});

exports.follow = asyncHandler(async (req, res, next) => {
  const { celebrityId } = req.params;
  const exists = await prisma.celebrity.findUnique({ where: { id: celebrityId }, select: { id: true } });
  if (!exists) return next(new AppError('Celebrity not found', 404));

  // array_remove-then-append dedupes, mirroring Mongo's $addToSet.
  const [{ following }] = await prisma.$queryRaw`
    UPDATE "User"
    SET following = array_append(array_remove(following, ${celebrityId}), ${celebrityId})
    WHERE id = ${req.user.id}
    RETURNING following
  `;
  res.json({ status: 'success', data: { following } });
});

exports.unfollow = asyncHandler(async (req, res) => {
  const [{ following }] = await prisma.$queryRaw`
    UPDATE "User"
    SET following = array_remove(following, ${req.params.celebrityId})
    WHERE id = ${req.user.id}
    RETURNING following
  `;
  res.json({ status: 'success', data: { following } });
});

/* ── Saved events ── */
exports.getSavedEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { id: { in: req.user.savedEvents } },
    include: { ticketTiers: true },
  });
  res.json({ status: 'success', data: { events } });
});

exports.saveEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const exists = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!exists) return next(new AppError('Event not found', 404));

  const [{ savedEvents }] = await prisma.$queryRaw`
    UPDATE "User"
    SET "savedEvents" = array_append(array_remove("savedEvents", ${eventId}), ${eventId})
    WHERE id = ${req.user.id}
    RETURNING "savedEvents"
  `;
  res.json({ status: 'success', data: { savedEvents } });
});

exports.unsaveEvent = asyncHandler(async (req, res) => {
  const [{ savedEvents }] = await prisma.$queryRaw`
    UPDATE "User"
    SET "savedEvents" = array_remove("savedEvents", ${req.params.eventId})
    WHERE id = ${req.user.id}
    RETURNING "savedEvents"
  `;
  res.json({ status: 'success', data: { savedEvents } });
});
