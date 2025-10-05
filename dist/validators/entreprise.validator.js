"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntrepriseSchema = void 0;
const zod_1 = require("zod");
const validation_message_1 = require("../utils/messages/validation.message");
exports.createEntrepriseSchema = zod_1.z.object({
    nom: zod_1.z.string().min(1, { message: validation_message_1.validationMessages.ENTRPRISE_NOM_REQUIS }),
    email: zod_1.z
        .string()
        .email({ message: validation_message_1.validationMessages.ENTRPRISE_EMAIL_REQUIS }),
    telephone: zod_1.z
        .string()
        .min(8, { message: validation_message_1.validationMessages.ENTRPRISE_TELEPHONE_REQUIS }),
    devise: zod_1.z
        .string()
        .min(1, { message: validation_message_1.validationMessages.ENTRPRISE_DEVISE_REQUIS })
        .default("XOF"),
    typePeriode: zod_1.z
        .enum(['MENSUEL', 'HEBDO', 'JOURNALIER'])
        .default("MENSUEL"),
    adresse: zod_1.z.string().optional().nullable(),
    logo: zod_1.z.string().optional().nullable(),
    couleurPrincipale: zod_1.z.string().optional().nullable(),
    couleurSecondaire: zod_1.z.string().optional().nullable(),
});
