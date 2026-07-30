const { prisma } = require('../config/database');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

/* ── Packages ── */
exports.listPackages = asyncHandler(async (req, res) => {
  const packages = await prisma.sponsorshipPackage.findMany({ orderBy: { price: 'desc' } });
  res.json({ status: 'success', data: { packages } });
});

exports.getPackage = asyncHandler(async (req, res, next) => {
  const pkg = await prisma.sponsorshipPackage.findUnique({ where: { id: req.params.id } });
  if (!pkg) return next(new AppError('Package not found', 404));
  res.json({ status: 'success', data: { package: pkg } });
});

/* ── Sponsors ── */
exports.listSponsors = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.eventId) where.eventId = req.query.eventId;
  if (req.query.platform === 'true') where.eventId = null;

  const sponsors = await prisma.sponsor.findMany({ where });
  res.json({ status: 'success', data: { sponsors } });
});

/* ── Applications ── */
exports.apply = asyncHandler(async (req, res, next) => {
  const { packageId, eventId } = req.body;

  const pkg = await prisma.sponsorshipPackage.findUnique({ where: { id: packageId } });
  if (!pkg) return next(new AppError('Selected package not found', 404));

  const application = await prisma.sponsorshipApplication.create({
    data: { ...req.body, packageName: pkg.name, eventId: eventId || null },
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

  const applications = await prisma.sponsorshipApplication.findMany({
    where: { eventId, status: { in: ['pending', 'reviewing'] } },
    select: {
      id: true,
      companyName: true,
      packageName: true,
      status: true,
      createdAt: true,
      package: { select: { tier: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const pending = applications.map((a) => ({
    id: a.id,
    companyName: a.companyName,
    packageName: a.packageName,
    tier: a.package ? a.package.tier : undefined,
    status: a.status,
  }));

  res.json({ status: 'success', data: { pending } });
});

exports.listApplications = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  const applications = await prisma.sponsorshipApplication.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ status: 'success', data: { applications } });
});

/**
 * Applications submitted by the currently signed-in user — matched by the
 * email on the application against the authenticated user's email. Lets users
 * track the status of sponsorships they've applied for.
 */
exports.listMine = asyncHandler(async (req, res) => {
  const applications = await prisma.sponsorshipApplication.findMany({
    where: { email: req.user.email.toLowerCase() },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ status: 'success', data: { applications } });
});

exports.updateApplication = asyncHandler(async (req, res, next) => {
  const application = await prisma.sponsorshipApplication
    .update({ where: { id: req.params.id }, data: { status: req.body.status } })
    .catch(() => null);
  if (!application) return next(new AppError('Application not found', 404));
  res.json({ status: 'success', data: { application } });
});
