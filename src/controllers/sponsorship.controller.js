const SponsorshipPackage = require('../models/SponsorshipPackage');
const Sponsor = require('../models/Sponsor');
const SponsorshipApplication = require('../models/SponsorshipApplication');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

/* ── Packages ── */
exports.listPackages = asyncHandler(async (req, res) => {
  const packages = await SponsorshipPackage.find().sort({ price: -1 });
  res.json({ status: 'success', data: { packages } });
});

exports.getPackage = asyncHandler(async (req, res, next) => {
  const pkg = await SponsorshipPackage.findById(req.params.id);
  if (!pkg) return next(new AppError('Package not found', 404));
  res.json({ status: 'success', data: { package: pkg } });
});

/* ── Sponsors ── */
exports.listSponsors = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.eventId) filter.eventId = req.query.eventId;
  if (req.query.platform === 'true') filter.eventId = null;

  const sponsors = await Sponsor.find(filter);
  res.json({ status: 'success', data: { sponsors } });
});

/* ── Applications ── */
exports.apply = asyncHandler(async (req, res, next) => {
  const { packageId, eventId } = req.body;

  const pkg = await SponsorshipPackage.findById(packageId);
  if (!pkg) return next(new AppError('Selected package not found', 404));

  const application = await SponsorshipApplication.create({
    ...req.body,
    packageName: pkg.name,
    eventId: eventId || null,
  });

  logger.info(`Sponsorship application from ${application.companyName} for ${pkg.name}`);
  res.status(201).json({ status: 'success', data: { application } });
});

/**
 * Public, limited view of pending/reviewing applications for an event — powers
 * the "pending sponsors" badges on the event detail page. Only exposes the
 * company name, package and tier (never email/phone/budget/message).
 */
exports.listPendingForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.query;
  if (!eventId) return next(new AppError('eventId query param is required', 400));

  const applications = await SponsorshipApplication.find(
    { eventId, status: { $in: ['pending', 'reviewing'] } },
    'companyName packageId packageName status createdAt'
  )
    .populate('packageId', 'tier')
    .sort({ createdAt: -1 });

  const pending = applications.map((a) => ({
    id: a._id,
    companyName: a.companyName,
    packageName: a.packageName,
    tier: a.packageId ? a.packageId.tier : undefined,
    status: a.status,
  }));

  res.json({ status: 'success', data: { pending } });
});

exports.listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const applications = await SponsorshipApplication.find(filter).sort({ createdAt: -1 });
  res.json({ status: 'success', data: { applications } });
});

/**
 * Applications submitted by the currently signed-in user — matched by the
 * email on the application against the authenticated user's email. Lets users
 * track the status of sponsorships they've applied for.
 */
exports.listMine = asyncHandler(async (req, res) => {
  const applications = await SponsorshipApplication.find({
    email: req.user.email.toLowerCase(),
  }).sort({ createdAt: -1 });
  res.json({ status: 'success', data: { applications } });
});

exports.updateApplication = asyncHandler(async (req, res, next) => {
  const application = await SponsorshipApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!application) return next(new AppError('Application not found', 404));
  res.json({ status: 'success', data: { application } });
});
