import { z } from 'zod';
import { validationMessages } from '../utils/messages/validation.message';

export const createUserSchema = z.object({
  nom: z.string().min(2, validationMessages.NOM_REQUIS),
  prenom: z.string().min(2, validationMessages.PRENOM_REQUIS),
  email: z.string().email(validationMessages.EMAIL_INVALIDE).min(1, validationMessages.EMAIL_REQUIS),
  motDePasse: z.string().min(6, validationMessages.MOT_DE_PASSE_LONGUEUR_MIN).min(1, validationMessages.MOT_DE_PASSE_REQUIS),
  roles: z.array(z.object({
    entrepriseId: z.number().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CAISSIER']),
  })).optional(),
  statut: z.enum(['ACTIF', 'INACTIF']).optional(),
});

export const updateUserSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  email: z.string().email().optional(),
  motDePasse: z.string().min(6).optional(),
  roles: z.array(z.object({
    entrepriseId: z.number(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CAISSIER']),
  })).optional(),
  statut: z.enum(['ACTIF', 'INACTIF']).optional(),
});
