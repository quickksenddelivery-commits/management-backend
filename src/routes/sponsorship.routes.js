const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/sponsorship.controller');
const { authenticate, adminGuard } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { APPLICATION_STATUS } = require('../utils/constants');

// Public
router.get('/packages', ctrl.listPackages);
router.get('/packages/:id', ctrl.getPackage);
router.get('/sponsors', ctrl.listSponsors);
router.get('/pending', ctrl.listPendingForEvent); // ?eventId= — public, limited fields

router.post(
  '/applications',
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('contactName').trim().notEmpty().withMessage('Contact name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('packageId').notEmpty().withMessage('A package selection is required'),
  ],
  validate,
  ctrl.apply
);

// Signed-in user — their own applications
router.get('/applications/mine', authenticate, ctrl.listMine);

// Admin
router.get('/applications', ...adminGuard, ctrl.listApplications);
router.patch(
  '/applications/:id',
  ...adminGuard,
  [body('status').isIn(APPLICATION_STATUS).withMessage('Invalid status')],
  validate,
  ctrl.updateApplication
);

module.exports = router;
