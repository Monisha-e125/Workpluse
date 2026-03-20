const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify connection
const verifyCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      logger.info('✅ Cloudinary connected');
    }
    return true;
  } catch (error) {
    logger.warn(`⚠️ Cloudinary not configured: ${error.message}`);
    return false;
  }
};

// Storage for avatar uploads
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'workpulse-ai/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' }
    ]
  }
});

// Storage for task attachment uploads
const attachmentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'workpulse-ai/attachments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx', 'txt', 'csv'],
    resource_type: 'auto'
  }
});

// Multer upload instances
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  }
});

const uploadAttachment = multer({
  storage: attachmentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  cloudinary,
  verifyCloudinary,
  uploadAvatar,
  uploadAttachment,
  deleteFromCloudinary
};