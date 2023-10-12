import multer from 'multer';

// Configure multer to use Cloudinary as storage
const storage = multer.memoryStorage();
export const upload = multer({ storage, });
