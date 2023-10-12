import { z } from 'zod';

class Validation {
  // Validation schema for updating an existing convert
  convertText = {
    body: z.object({
      text: z.string(),
    }),
  };
}

export const convertValidation = new Validation();
