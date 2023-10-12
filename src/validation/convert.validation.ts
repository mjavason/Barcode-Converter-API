import { z } from 'zod';

class Validation {
  // Validation schema for updating an existing convert
  convertText = {
    query: z.object({
      text: z.string(),
    }),
  };
}

export const convertValidation = new Validation();
