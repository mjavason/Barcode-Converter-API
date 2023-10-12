import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../helpers/response';
import logger from '../helpers/logger';

class Controller {
  async convertText(req: Request, res: Response) {
    const qrCodeText = req.body.text;
    if (!qrCodeText) return BadRequestResponse(res, 'Invalid text');
    try {
      // Generate the QR code as a data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText.toString());

      return SuccessResponse(res, { image_src: `${qrCodeDataUrl}` });
    } catch (error) {
      logger.error('Error generating QR code:', error);
      return InternalErrorResponse(res);
    }
  }
}

export const qrController = new Controller();
