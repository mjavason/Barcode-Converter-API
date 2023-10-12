import express, { Request, Response } from 'express';
import { convertValidation } from '../../../validation';
import { processRequestBody } from 'zod-express-middleware';
import { qrController } from '../../../controllers';
const router = express.Router();

router.post(
  '/qr',
  processRequestBody(convertValidation.convertText.body),
  qrController.convertText,
);

export default router;
