const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/celebrity.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { CELEBRITY_CATEGORIES } = require('../utils/constants');

// Public
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/events', ctrl.getEvents);

// Admin
const writeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(CELEBRITY_CATEGORIES).withMessage('Invalid category'),
  body('image').notEmpty().withMessage('Image is required'),
  body('coverImage').notEmpty().withMessage('Cover image is required'),
];

router.post('/', authenticate, authorize('admin'), writeValidation, validate, ctrl.create);
router.patch('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
