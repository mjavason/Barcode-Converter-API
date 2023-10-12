import express from 'express';
import { upload } from '../../../config/upload.config';
import { convertValidation } from '../../../validation';
import { processRequestBody } from 'zod-express-middleware';
import { qrController } from '../../../controllers';
const router = express.Router();

router.post(
  '/qr',
  processRequestBody(convertValidation.convertText.body),
  qrController.convertText,
);

router.post('/qr/image', upload.single('image'), qrController.convertImage);

export default router;
