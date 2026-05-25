import multer from 'multer';

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Invalid image type'));
    }

    callback(null, true);
  },
});

export default upload;
