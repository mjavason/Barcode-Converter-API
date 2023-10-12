import { Request, Response } from 'express';
import qrCode from 'qrcode';
import jimp from 'jimp';
import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../helpers/response';
import logger from '../helpers/logger';
const QrCodeReader = require('qrcode-reader');

class Controller {
  async convertText(req: Request, res: Response) {
    const qrCodeText = req.query.text;
    if (!qrCodeText) return BadRequestResponse(res, 'Invalid text');

    try {
      // Generate the QR code as a buffer
      const qrCodeBuffer = await qrCode.toBuffer(qrCodeText.toString());

      // Set the response headers to indicate a downloadable image
      res.setHeader('Content-Disposition', `attachment; filename="qrCode.png"`);
      res.setHeader('Content-Type', 'image/png');

      // Send the QR code image as a downloadable file
      res.send(qrCodeBuffer);
    } catch (error) {
      logger.error('Error generating QR code:', error);
      return InternalErrorResponse(res);
    }
  }

  // Returns a base64 string, that when passed as a src parameter to images, will display the qr code
  async convertTextToString(req: Request, res: Response) {
    const qrCodeText = req.body.text;
    if (!qrCodeText) return BadRequestResponse(res, 'Invalid text');
    try {
      // Generate the QR code as a data URL
      const qrCodeDataUrl = await qrCode.toDataURL(qrCodeText.toString());

      return SuccessResponse(res, { image_src: `${qrCodeDataUrl}` });
    } catch (error) {
      logger.error('Error generating QR code:', error);
      return InternalErrorResponse(res);
    }
  }

  async convertImage(req: Request, res: Response) {
    // Extract the file buffer and MIME type from the request
    const fileUploadBuffer: Buffer | undefined = req.file?.buffer;
    const fileUploadMimeType: string | undefined = req.file?.mimetype;

    try {
      // Check if the file data is valid
      if (!fileUploadBuffer || !fileUploadMimeType) {
        return BadRequestResponse(res, 'Invalid file data');
      }

      // Convert the file buffer to base64 format
      const b64: string = Buffer.from(fileUploadBuffer).toString('base64');

      // Read the image from the base64 data using Jimp
      jimp.read(Buffer.from(b64, 'base64'), function (err: any, image: any) {
        if (err) {
          console.error('Error reading the image:', err);
          return InternalErrorResponse(res, 'Error reading the image');
        }

        // Create an instance of the QR code reader
        const qrCodeReader = new QrCodeReader();

        // Set up a callback function to handle QR code decoding
        qrCodeReader.callback = function (err: any, result: any) {
          if (err) {
            console.error('Error decoding the QR code:', err);
            return InternalErrorResponse(res, 'Error decoding the QR code');
          }

          // Check if a QR code result was obtained
          if (result && result.result) {
            console.log('QR Code Text:', result.result);
            return SuccessResponse(res, { text: result.result });
          } else {
            return InternalErrorResponse(res, 'No QR code found in the image');
          }
        };

        // Decode the QR code from the image's bitmap
        qrCodeReader.decode(image.bitmap);
      });
    } catch (error) {
      // Handle any other errors that may occur during file processing
      console.error('An error occurred during file processing: ', error);
      return InternalErrorResponse(res, 'An error occurred during file processing');
    }
  }
}

export const qrController = new Controller();
