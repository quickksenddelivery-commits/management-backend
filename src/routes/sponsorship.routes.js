const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/sponsorship.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { APPLICATION_STATUS } = require('../utils/constants');

// Public
router.get('/packages', ctrl.listPackages);
router.get('/packages/:id', ctrl.getPackage);
router.get('/sponsors', ctrl.listSponsors);

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

// Admin
router.get('/applications', authenticate, authorize('admin'), ctrl.listApplications);
router.patch(
  '/applications/:id',
  authenticate,
  authorize('admin'),
  [body('status').isIn(APPLICATION_STATUS).withMessage('Invalid status')],
  validate,
  ctrl.updateApplication
);

module.exports = router;
