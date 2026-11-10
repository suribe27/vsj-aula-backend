import multer from 'multer';
import { ValidationError } from '../../application/errors/AppError';

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Guarda la imagen en memoria para enviarla luego a Supabase Storage. */
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      callback(new ValidationError('La imagen debe ser JPG, PNG o WEBP'));
      return;
    }
    callback(null, true);
  },
}).single('image');
