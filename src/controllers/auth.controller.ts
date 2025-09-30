import { Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import { UserRepository } from '../repositories/user.repository';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { SUCCESS_MESSAGES } from '../utils/messages/success_messages';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationMessages } from '../utils/messages/validation.message';

export class AuthController {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.USER_INVALID_DATA,
          errors: validation.error.issues,
        });
      }

      const { email, motDePasse } = req.body;

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }

      const isValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isValid) {
        return res.status(ERROR_CODES.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.PASSWORD_INCORRECT,
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error(ERROR_MESSAGES.JWT_NOT_FOUND);
      }

      let mainRole = undefined;
      let entrepriseId = undefined;
      if (user && Array.isArray(user.roles)) {
        if (user.roles.some((r: any) => r.role === 'SUPER_ADMIN')) {
          mainRole = 'SUPER_ADMIN';
        } else if (user.roles.length > 0) {
          // Prend le premier rôle ADMIN ou CAISSIER lié à une entreprise
          const adminOrCaissierRole = user.roles.find((r: any) => (r.role === 'ADMIN' || r.role === 'CAISSIER') && r.entrepriseId);
          if (adminOrCaissierRole) {
            mainRole = adminOrCaissierRole.role;
            entrepriseId = adminOrCaissierRole.entrepriseId;
          } else {
            mainRole = user.roles[0].role;
          }
        }
      }
      // DEBUG: Affiche les rôles de l'utilisateur dans la console
      // console.log('USER ROLES:', user.roles);

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: mainRole, entrepriseId, entreprise: entrepriseId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
      );

      return res.status(SUCCESS_CODES.OK_CODE).json({
        success: true,
        message: SUCCESS_MESSAGES.CONNEXION_REUSSIE,
        token,
        doitChangerMotDePasse: user.doitChangerMotDePasse,
        user: {
          id: user.id,
          email: user.email,
          role: mainRole,
          entrepriseId,
        }
      });
    } catch (error) {
      return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.ERROR_SERVER,
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  public changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(ERROR_CODES.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.TOKEN_MISSING,
        });
      }

      const { ancienMotDePasse, nouveauMotDePasse } = req.body;
      if (!ancienMotDePasse || !nouveauMotDePasse || nouveauMotDePasse.length < 6) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          success: false,
          message: validationMessages.MOT_DE_PASSE_REQUIS,
        });
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }

      const isValid = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
      if (!isValid) {
        return res.status(ERROR_CODES.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.PASSWORD_INCORRECT,
        });
      }

      const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);
      await this.userRepository.update(userId, {
        motDePasse: hashedPassword,
        doitChangerMotDePasse: false,
      });

      return res.status(SUCCESS_CODES.OK_CODE).json({
        success: true,
        message: validationMessages
      });
    } catch (error) {
      return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.ERROR_SERVER,
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}
