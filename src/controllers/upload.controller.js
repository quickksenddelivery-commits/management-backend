const cloudinary = require('cloudinary').v2;
const { env } = require('../config/env');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

let configured = false;
const ensureConfigured = () => {
  if (configured) return true;
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  return true;
};

/**
 * Stream an in-memory file buffer to Cloudinary's upload API.
 * Resolves to the secure URL (https) + the public_id (for future cleanup).
 */
const streamUpload = (buffer, folder, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `fanconnectpro/${folder}`,
        public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
        resource_type: 'image',
        overwrite: false,
        invalidate: true,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

/**
 * POST /api/uploads/image
 * Multipart form data — field `file`. Optional `folder` (e.g. "events" / "celebrities" / "avatars").
 * Returns { url, publicId, width, height, format, bytes }.
 */
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!ensureConfigured()) {
    return next(new AppError('Image upload is not configured on this server', 503));
  }
  if (!req.file) {
    return next(new AppError('No file received — send multipart/form-data with field "file"', 400));
  }
  const folder = (req.body.folder || 'misc').toString().replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'misc';

  try {
    const result = await streamUpload(req.file.buffer, folder, req.file.originalname);
    logger.info(`Image uploaded by ${req.user?._id || 'unknown'} → ${result.secure_url}`);
    res.status(201).json({
      status: 'success',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (err) {
    logger.error(`Cloudinary upload failed: ${err.message}`);
    return next(new AppError(err.message || 'Upload failed', 502));
  }
});
