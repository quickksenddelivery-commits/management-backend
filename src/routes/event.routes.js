const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/event.controller');
const { adminGuard } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { CELEBRITY_CATEGORIES } = require('../utils/constants');

// Public
router.get('/', ctrl.list);
router.get('/featured', ctrl.featured);
router.get('/:id', ctrl.getOne);

// Admin
const writeValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('celebrityId').notEmpty().withMessage('celebrityId is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('venue').notEmpty().withMessage('Venue is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('image').notEmpty().withMessage('Image is required'),
  body('category').isIn(CELEBRITY_CATEGORIES).withMessage('Invalid category'),
];

router.post('/', ...adminGuard, writeValidation, validate, ctrl.create);
router.patch('/:id', ...adminGuard, ctrl.update);
router.delete('/:id', ...adminGuard, ctrl.remove);

module.exports = router;
