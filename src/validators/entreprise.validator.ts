import { z } from 'zod';

import { validationMessages } from '../utils/messages/validation.message';

export const createEntrepriseSchema = z.object({
  nom: z.string().min(1, { message: validationMessages.ENTRPRISE_NOM_REQUIS }),
  email: z
    .string()
    .email({ message: validationMessages.ENTRPRISE_EMAIL_REQUIS }),
  telephone: z
    .string()
    .min(8, { message: validationMessages.ENTRPRISE_TELEPHONE_REQUIS }),
  devise: z
    .string()
    .min(1, { message: validationMessages.ENTRPRISE_DEVISE_REQUIS })
    .default("XOF"),
  typePeriode: z
    .enum(['MENSUEL', 'HEBDO', 'JOURNALIER'])
    .default("MENSUEL"),
  adresse: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
});
