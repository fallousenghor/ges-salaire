"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const validation_message_1 = require("../utils/messages/validation.message");
exports.createUserSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2, validation_message_1.validationMessages.NOM_REQUIS),
    prenom: zod_1.z.string().min(2, validation_message_1.validationMessages.PRENOM_REQUIS),
    email: zod_1.z.string().email(validation_message_1.validationMessages.EMAIL_INVALIDE).min(1, validation_message_1.validationMessages.EMAIL_REQUIS),
    motDePasse: zod_1.z.string().min(6, validation_message_1.validationMessages.MOT_DE_PASSE_LONGUEUR_MIN).min(1, validation_message_1.validationMessages.MOT_DE_PASSE_REQUIS),
    roles: zod_1.z.array(zod_1.z.object({
        entrepriseId: zod_1.z.number().optional(),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'CAISSIER']),
    })).optional(),
    statut: zod_1.z.enum(['ACTIF', 'INACTIF']).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2).optional(),
    prenom: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    motDePasse: zod_1.z.string().min(6).optional(),
    roles: zod_1.z.array(zod_1.z.object({
        entrepriseId: zod_1.z.number(),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'CAISSIER']),
    })).optional(),
    statut: zod_1.z.enum(['ACTIF', 'INACTIF']).optional(),
});
