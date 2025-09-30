import { z } from 'zod';
import { validationMessages } from '../utils/messages/validation.message';

export const loginSchema = z.object({
  email: z.string().email(validationMessages.EMAIL_INVALID),
  motDePasse: z.string().min(6, validationMessages.MOT_DE_PASSE_REQUIS),
});
