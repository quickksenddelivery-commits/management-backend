const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');

// Public — supported crypto coins, networks and wallet addresses
router.get('/coins', ctrl.coins);

module.exports = router;
