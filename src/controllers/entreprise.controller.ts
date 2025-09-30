import { Request, Response } from 'express';
import { EntrepriseService } from '../services/entreprise.service';
import { CreateEntrepriseDto, UpdateEntrepriseDto } from '../type/entreprise.type';
import { createEntrepriseSchema } from '../validators/entreprise.validator';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { SUCCESS_MESSAGES } from '../utils/messages/success_messages';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { UserRepository } from '../repositories/user.repository';
import { sendMail } from '../utils/sendMail';
import bcrypt from 'bcryptjs';

export class EntrepriseController {
  private entrepriseService: EntrepriseService;
  private userRepository: UserRepository;

  constructor() {
    this.entrepriseService = new EntrepriseService();
    this.userRepository = new UserRepository();
  }

  public createEntreprise = async (req: Request, res: Response) => {
    try {
      const parseResult = createEntrepriseSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        });
      }
      const data: CreateEntrepriseDto = parseResult.data;
      const entreprise = await this.entrepriseService.createEntreprise(data);

      const tempPassword = Math.random().toString(36).slice(-8);
     const hashedPassword = await bcrypt.hash(tempPassword, 10);



      await this.userRepository.create({
        nom: 'Admin',
        prenom: entreprise.nom,
        email: entreprise.email,
        motDePasse: hashedPassword,
        roles: [{ entrepriseId: entreprise.id, role: 'ADMIN' }],
        doitChangerMotDePasse: true
      });

      // 4. Envoyer l'email
      try {
        await sendMail({
          to: entreprise.email,
          subject: SUCCESS_MESSAGES.ACCESS_ENTREPRISE,
          text: `${SUCCESS_MESSAGES.BIENVENUE} : ${tempPassword} ${SUCCESS_MESSAGES.CHANGER_PASSWORD_SUCCESS}`
        });
        console.log('Mail envoyé à', entreprise.email);
      } catch (mailError) {
        console.error('Erreur lors de l\'envoi du mail:', mailError);
      }

      res.status(201).json({ success: true, data: entreprise });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_ENTREPRISE, error });
    }
  };

  public getAllEntreprises = async (_req: Request, res: Response) => {
    try {
      const entreprises = await this.entrepriseService.getAllEntreprises();
      res.status(200).json({ success: true, data: entreprises });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_RECUPERATION_ENTREPRISE, error });
    }
  };

  public getEntrepriseById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.ID_INVALID });
      }
      const entreprise = await this.entrepriseService.getEntrepriseById(id);
      if (!entreprise) {
        return res.status(ERROR_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.ENTREPRISE_NOT_FOUND });
      }
      res.status(200).json({ success: true, data: entreprise });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_RECUPERATION_ENTREPRISE, error });
    }
  };

  public updateEntreprise = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.ID_INVALID });
      }
      const data: UpdateEntrepriseDto = req.body;
      const entreprise = await this.entrepriseService.updateEntreprise(id, data);
      res.status(200).json({ success: true, data: entreprise });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_ENTREPRISE, error });
    }
  };

  public deleteEntreprise = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.ID_INVALID });
      }
      await this.entrepriseService.deleteEntreprise(id);
      res.status(200).json({ success: true, message: SUCCESS_MESSAGES.USER_DELETED });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_ENTREPRISE, error });
    }
  };
}
