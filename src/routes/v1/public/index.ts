import express from 'express';
import { upload } from '../../../config/upload.config';
import { convertValidation } from '../../../validation';
import { processRequestQuery } from 'zod-express-middleware';
import { qrController } from '../../../controllers';
const router = express.Router();

router.get(
  '/qr',
  processRequestQuery(convertValidation.convertText.query),
  qrController.convertText,
);

router.post('/qr/image', upload.single('image'), qrController.convertImage);

export default router;
