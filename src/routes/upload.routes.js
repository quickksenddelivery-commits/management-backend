const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/upload.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Hold the file in memory; we stream the buffer straight to Cloudinary so
// nothing ever touches the filesystem. 8MB cap is plenty for event posters.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/^image\/(jpe?g|png|webp|gif|avif)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WEBP, GIF and AVIF images are accepted'));
  },
});

// Admin-gated image upload. Used by the admin Event / Celebrity forms and
// by the signed-in user's profile-avatar picker.
router.post(
  '/image',
  authenticate,
  authorize('admin', 'user'),
  upload.single('file'),
  ctrl.uploadImage
);

module.exports = router;
