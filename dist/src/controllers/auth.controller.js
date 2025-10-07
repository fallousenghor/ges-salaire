"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const user_repository_1 = require("../repositories/user.repository");
const errors_messages_1 = require("../utils/messages/errors_messages");
const errors_code_1 = require("../utils/messages/errors_code");
const success_code_1 = require("../utils/messages/success_code");
const success_messages_1 = require("../utils/messages/success_messages");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_message_1 = require("../utils/messages/validation.message");
class AuthController {
    constructor(userRepository) {
        this.verifyToken = async (req, res) => {
            try {
                // L'utilisateur est déjà vérifié par le middleware authenticateJWT
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.INVALID_TOKEN
                    });
                }
                const user = await this.userRepository.findById(req.user.id);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_NOT_FOUND
                    });
                }
                return res.json({
                    success: true,
                    code: success_code_1.SUCCESS_CODES.TOKEN_VALIDE,
                    message: success_messages_1.SUCCESS_MESSAGES.TOKEN_VALIDE,
                    user
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: errors_messages_1.ERROR_MESSAGES.ERROR_SERVER
                });
            }
        };
        this.switchToAdmin = async (req, res) => {
            try {
                const entrepriseId = parseInt(req.params.entrepriseId);
                const userId = req.user?.id;
                // Vérifier que l'utilisateur est un super admin
                if (req.user?.role !== 'SUPER_ADMIN') {
                    return res.status(403).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ACCES_INTERDIT });
                }
                // Vérifier que le super admin a accès à cette entreprise
                const access = await this.userRepository.findSuperAdminAccess({
                    where: {
                        entrepriseId,
                        superAdmin: {
                            userId: userId
                        },
                        hasAccess: true
                    }
                });
                if (!access) {
                    return res.status(403).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ACCES_INTERDIT });
                }
                // Créer un nouveau token avec le rôle ADMIN et l'ID de l'entreprise
                const secret = process.env.JWT_SECRET || 'votre_secret';
                const token = jsonwebtoken_1.default.sign({
                    id: req.user.id,
                    email: req.user.email,
                    role: 'ADMIN',
                    entrepriseId
                }, secret, { expiresIn: '24h' });
                // Renvoyer le nouveau token avec les informations utilisateur mises à jour
                return res.json({
                    success: true,
                    token,
                    user: {
                        id: req.user.id,
                        email: req.user.email,
                        role: 'ADMIN',
                        entrepriseId
                    }
                });
            }
            catch (error) {
                console.error('Erreur lors du switch en admin:', error);
                return res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_SERVER });
            }
        };
        this.login = async (req, res) => {
            try {
                const validation = auth_validator_1.loginSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_INVALID_DATA,
                        errors: validation.error.issues,
                    });
                }
                const { email, motDePasse } = req.body;
                const user = await this.userRepository.findByEmail(email);
                if (!user) {
                    return res.status(errors_code_1.ERROR_CODES.NOT_FOUND).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                }
                const isValid = await bcryptjs_1.default.compare(motDePasse, user.motDePasse);
                if (!isValid) {
                    return res.status(errors_code_1.ERROR_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.PASSWORD_INCORRECT,
                    });
                }
                if (!process.env.JWT_SECRET) {
                    throw new Error(errors_messages_1.ERROR_MESSAGES.JWT_NOT_FOUND);
                }
                let mainRole = undefined;
                let entrepriseId = undefined;
                if (user && Array.isArray(user.roles)) {
                    if (user.roles.some((r) => r.role === 'SUPER_ADMIN')) {
                        mainRole = 'SUPER_ADMIN';
                    }
                    else if (user.roles.length > 0) {
                        // Correction : si le user a un rôle CAISSIER, on le force
                        const caissierRole = user.roles.find((r) => r.role === 'CAISSIER' && r.entrepriseId);
                        if (caissierRole) {
                            mainRole = 'CAISSIER';
                            entrepriseId = caissierRole.entrepriseId;
                        }
                        else {
                            // Sinon, on prend le premier rôle ADMIN lié à une entreprise
                            const adminRole = user.roles.find((r) => r.role === 'ADMIN' && r.entrepriseId);
                            if (adminRole) {
                                mainRole = 'ADMIN';
                                entrepriseId = adminRole.entrepriseId;
                            }
                            else {
                                mainRole = user.roles[0].role;
                            }
                        }
                    }
                }
                // DEBUG: Affiche les rôles de l'utilisateur dans la console
                // console.log('USER ROLES:', user.roles);
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: mainRole, entrepriseId, entreprise: entrepriseId }, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.status(success_code_1.SUCCESS_CODES.OK_CODE).json({
                    success: true,
                    message: success_messages_1.SUCCESS_MESSAGES.CONNEXION_REUSSIE,
                    token,
                    doitChangerMotDePasse: user.doitChangerMotDePasse,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: mainRole,
                        entrepriseId,
                    }
                });
            }
            catch (error) {
                return res.status(errors_code_1.ERROR_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errors_messages_1.ERROR_MESSAGES.ERROR_SERVER,
                    error: error instanceof Error ? error.message : error,
                });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    return res.status(errors_code_1.ERROR_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.TOKEN_MISSING,
                    });
                }
                const { ancienMotDePasse, nouveauMotDePasse } = req.body;
                if (!ancienMotDePasse || !nouveauMotDePasse || nouveauMotDePasse.length < 6) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({
                        success: false,
                        message: validation_message_1.validationMessages.MOT_DE_PASSE_REQUIS,
                    });
                }
                const user = await this.userRepository.findById(userId);
                if (!user) {
                    return res.status(errors_code_1.ERROR_CODES.NOT_FOUND).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                }
                const isValid = await bcryptjs_1.default.compare(ancienMotDePasse, user.motDePasse);
                if (!isValid) {
                    return res.status(errors_code_1.ERROR_CODES.UNAUTHORIZED).json({
                        success: false,
                        message: errors_messages_1.ERROR_MESSAGES.PASSWORD_INCORRECT,
                    });
                }
                const hashedPassword = await bcryptjs_1.default.hash(nouveauMotDePasse, 10);
                await this.userRepository.update(userId, {
                    motDePasse: hashedPassword,
                    doitChangerMotDePasse: false,
                });
                return res.status(success_code_1.SUCCESS_CODES.OK_CODE).json({
                    success: true,
                    message: validation_message_1.validationMessages
                });
            }
            catch (error) {
                return res.status(errors_code_1.ERROR_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errors_messages_1.ERROR_MESSAGES.ERROR_SERVER,
                    error: error instanceof Error ? error.message : error,
                });
            }
        };
        this.userRepository = userRepository || new user_repository_1.UserRepository();
    }
}
exports.AuthController = AuthController;
