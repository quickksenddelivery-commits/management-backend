const router = require('express').Router();
const ctrl = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

module.exports = router;
