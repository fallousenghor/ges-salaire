import { Request, Response } from "express";
import { createUserSchema } from "../validators/user.validator";
import { UserRepository } from "../repositories/user.repository";
import { ERROR_MESSAGES } from "../utils/messages/errors_messages";
import { SUCCESS_MESSAGES } from "../utils/messages/success_messages";
import bcrypt from "bcryptjs";
import { SUCCESS_CODES } from "../utils/messages/success_code";
import { ERROR_CODES } from "../utils/messages/errors_code";

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository?: UserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  public createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const validation = createUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.USER_INVALID_DATA,
          errors: validation.error.issues,
        });
      }

      const { email, motDePasse, nom, prenom } = req.body;

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(ERROR_CODES.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.USER_EMAIL_EXISTS,
        });
      }
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

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
        return res.status(SUCCESS_CODES.CREATED).json({
          success: true,
          message: SUCCESS_MESSAGES.USER_CREATED,
          data: userSafe,
        });
      } else {
        return res.status(SUCCESS_CODES.CREATED).json({
          success: true,
          message: SUCCESS_MESSAGES.USER_CREATED,
          data: null,
        });
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.USER_CREATION_FAILED, error);
      return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.USER_CREATION_FAILED,
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}
