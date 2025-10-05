"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_validator_1 = require("../validators/user.validator");
const user_repository_1 = require("../repositories/user.repository");
const errors_messages_1 = require("../utils/messages/errors_messages");
const success_messages_1 = require("../utils/messages/success_messages");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const success_code_1 = require("../utils/messages/success_code");
const errors_code_1 = require("../utils/messages/errors_code");
class UserController {
    constructor(userRepository) {
        this.createUser = async (req, res) => {
            try {
                const validation = user_validator_1.createUserSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_INVALID_DATA,
                        errors: validation.error.issues,
                    });
                }
                const { email, motDePasse, nom, prenom } = req.body;
                const existingUser = await this.userRepository.findByEmail(email);
                if (existingUser) {
                    return res.status(errors_code_1.ERROR_CODES.CONFLICT).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_EMAIL_EXISTS,
                    });
                }
                const hashedPassword = await bcryptjs_1.default.hash(motDePasse, 10);
                const user = await this.userRepository.create({
                    email,
                    motDePasse: hashedPassword,
                    nom,
                    prenom,
                    roles: req.body.roles,
                    doitChangerMotDePasse: req.body.doitChangerMotDePasse ?? false,
                });
                const userWithRoles = await this.userRepository.findByEmail(email);
                if (userWithRoles) {
                    const { motDePasse: _, ...userSafe } = userWithRoles;
                    return res.status(success_code_1.SUCCESS_CODES.CREATED).json({
                        success: true,
                        message: success_messages_1.SUCCESS_MESSAGES.USER_CREATED,
                        data: userSafe,
                    });
                }
                else {
                    return res.status(success_code_1.SUCCESS_CODES.CREATED).json({
                        success: true,
                        message: success_messages_1.SUCCESS_MESSAGES.USER_CREATED,
                        data: null,
                    });
                }
            }
            catch (error) {
                console.error(errors_messages_1.ERROR_MESSAGES.USER_CREATION_FAILED, error);
                return res.status(errors_code_1.ERROR_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errors_messages_1.ERROR_MESSAGES.USER_CREATION_FAILED,
                    error: error instanceof Error ? error.message : error,
                });
            }
        };
        this.userRepository = userRepository || new user_repository_1.UserRepository();
    }
}
exports.UserController = UserController;
