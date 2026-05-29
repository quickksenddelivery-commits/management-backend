const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.use(authenticate);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('attendeeName').trim().notEmpty().withMessage('Attendee name is required'),
    body('attendeeEmail').isEmail().withMessage('A valid attendee email is required'),
    body('coin').notEmpty().withMessage('Payment coin is required'),
  ],
  validate,
  ctrl.create
);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/:id/confirm', ctrl.confirm);

module.exports = router;
