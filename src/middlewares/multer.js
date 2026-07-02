import multer from 'multer';
import createHttpError from 'http-errors';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      createHttpError(
        400,
        'Неприпустимий тип файлу. Дозволені формати: JPEG, PNG, GIF, WEBP.'
      )
    );
  },
});
