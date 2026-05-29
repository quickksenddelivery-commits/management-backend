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

exports.listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const applications = await SponsorshipApplication.find(filter).sort({ createdAt: -1 });
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
