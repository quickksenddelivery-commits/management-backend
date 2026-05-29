const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes operate on the authenticated user ("me")
router.use(authenticate);

router.patch('/me', ctrl.updateMe);

router.get('/me/following', ctrl.getFollowing);
router.post('/me/following/:celebrityId', ctrl.follow);
router.delete('/me/following/:celebrityId', ctrl.unfollow);

router.get('/me/saved-events', ctrl.getSavedEvents);
router.post('/me/saved-events/:eventId', ctrl.saveEvent);
router.delete('/me/saved-events/:eventId', ctrl.unsaveEvent);

module.exports = router;
