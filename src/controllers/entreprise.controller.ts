import { Request, Response } from 'express';
import { EntrepriseService } from '../services/entreprise.service';
import { CreateEntrepriseDto, UpdateEntrepriseDto } from '../type/entreprise.type';
import { TypePeriode } from '../type/role.type';
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
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);

      // Convertir les champs du formulaire en objet
      const formData: CreateEntrepriseDto = {
        nom: req.body.nom,
        email: req.body.email,
        telephone: req.body.telephone,
        devise: req.body.devise || "XOF",
        typePeriode: (req.body.typePeriode || "MENSUEL").toUpperCase() as TypePeriode,
        adresse: req.body.adresse || null,
        logo: req.file ? `/uploads/logos/${req.file.filename}` : null,
        couleurPrimaire: req.body.couleurPrimaire || "#2563eb",
        couleurSecondaire: req.body.couleurSecondaire || "#1e40af",
      };

      // Si un fichier a été uploadé, ajouter son chemin
      if (req.file) {
        formData.logo = `/uploads/logos/${req.file.filename}`;
      }

      const parseResult = createEntrepriseSchema.safeParse(formData);
      if (!parseResult.success) {
        // Si un fichier a été uploadé mais la validation échoue, supprimer le fichier
        if (req.file) {
          // TODO: Ajouter la logique pour supprimer le fichier uploadé
        }
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
      console.error('updateEntreprise error:', error);
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
      // Construire le DTO à partir du body et du fichier uploadé (si présent)
      const body = req.body || {};
      const data: UpdateEntrepriseDto = {
        nom: body.nom,
        email: body.email,
        telephone: body.telephone,
        adresse: body.adresse ?? null,
        devise: body.devise,
        typePeriode: body.typePeriode ? (body.typePeriode as string).toUpperCase() as any : undefined,
        statut: body.statut,
        couleurPrimaire: body.couleurPrimaire,
        couleurSecondaire: body.couleurSecondaire
      };

      if (req.file) {
        data.logo = `/uploads/logos/${req.file.filename}`;
      }

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

  // Fermer (désactiver) une entreprise
  public fermerEntreprise = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.ID_INVALID });
      }
      // On passe le statut à 'inactive'
      const entreprise = await this.entrepriseService.updateEntreprise(id, { statut: 'inactive' });
      res.status(200).json({ success: true, data: entreprise });
    } catch (error) {
      res.status(500).json({ success: false, message: ERROR_MESSAGES.ERROR_ENTREPRISE, error });
    }
  };
}
