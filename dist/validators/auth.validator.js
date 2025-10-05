"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const validation_message_1 = require("../utils/messages/validation.message");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(validation_message_1.validationMessages.EMAIL_INVALID),
    motDePasse: zod_1.z.string().min(6, validation_message_1.validationMessages.MOT_DE_PASSE_REQUIS),
});
