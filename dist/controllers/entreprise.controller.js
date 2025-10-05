"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepriseController = void 0;
const entreprise_service_1 = require("../services/entreprise.service");
const entreprise_validator_1 = require("../validators/entreprise.validator");
const errors_messages_1 = require("../utils/messages/errors_messages");
const success_messages_1 = require("../utils/messages/success_messages");
const errors_code_1 = require("../utils/messages/errors_code");
const user_repository_1 = require("../repositories/user.repository");
const sendMail_1 = require("../utils/sendMail");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class EntrepriseController {
    constructor() {
        this.createEntreprise = async (req, res) => {
            try {
                console.log('Request body:', req.body);
                console.log('Request file:', req.file);
                // Convertir les champs du formulaire en objet
                const formData = {
                    nom: req.body.nom,
                    email: req.body.email,
                    telephone: req.body.telephone,
                    devise: req.body.devise || "XOF",
                    typePeriode: (req.body.typePeriode || "MENSUEL").toUpperCase(),
                    adresse: req.body.adresse || null,
                    logo: req.file ? `/uploads/logos/${req.file.filename}` : null,
                    couleurPrincipale: req.body.couleurPrincipale ?? null,
                    couleurSecondaire: req.body.couleurSecondaire ?? null,
                };
                // Si un fichier a été uploadé, ajouter son chemin
                if (req.file) {
                    formData.logo = `/uploads/logos/${req.file.filename}`;
                }
                const parseResult = entreprise_validator_1.createEntrepriseSchema.safeParse(formData);
                if (!parseResult.success) {
                    // Si un fichier a été uploadé mais la validation échoue, supprimer le fichier
                    if (req.file) {
                        // TODO: Ajouter la logique pour supprimer le fichier uploadé
                    }
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({
                        success: false,
                        errors: parseResult.error.flatten().fieldErrors,
                    });
                }
                const data = parseResult.data;
                const entreprise = await this.entrepriseService.createEntreprise(data);
                const tempPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcryptjs_1.default.hash(tempPassword, 10);
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
                    await (0, sendMail_1.sendMail)({
                        to: entreprise.email,
                        subject: success_messages_1.SUCCESS_MESSAGES.ACCESS_ENTREPRISE,
                        text: `${success_messages_1.SUCCESS_MESSAGES.BIENVENUE} : ${tempPassword} ${success_messages_1.SUCCESS_MESSAGES.CHANGER_PASSWORD_SUCCESS}`
                    });
                    console.log('Mail envoyé à', entreprise.email);
                }
                catch (mailError) {
                    console.error('Erreur lors de l\'envoi du mail:', mailError);
                }
                res.status(201).json({ success: true, data: entreprise });
            }
            catch (error) {
                console.error('updateEntreprise error:', error);
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_ENTREPRISE, error });
            }
        };
        this.getAllEntreprises = async (_req, res) => {
            try {
                const entreprises = await this.entrepriseService.getAllEntreprises();
                res.status(200).json({ success: true, data: entreprises });
            }
            catch (error) {
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_RECUPERATION_ENTREPRISE, error });
            }
        };
        this.getEntrepriseById = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ID_INVALID });
                }
                const entreprise = await this.entrepriseService.getEntrepriseById(id);
                if (!entreprise) {
                    return res.status(errors_code_1.ERROR_CODES.NOT_FOUND).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ENTREPRISE_NOT_FOUND });
                }
                res.status(200).json({ success: true, data: entreprise });
            }
            catch (error) {
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_RECUPERATION_ENTREPRISE, error });
            }
        };
        this.updateEntreprise = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ID_INVALID });
                }
                // Construire le DTO à partir du body et du fichier uploadé (si présent)
                const body = req.body || {};
                const data = {
                    nom: body.nom,
                    email: body.email,
                    telephone: body.telephone,
                    adresse: body.adresse ?? null,
                    devise: body.devise,
                    typePeriode: body.typePeriode ? body.typePeriode.toUpperCase() : undefined,
                    statut: body.statut,
                    couleurPrincipale: body.couleurPrincipale ?? undefined,
                    couleurSecondaire: body.couleurSecondaire ?? undefined,
                };
                if (req.file) {
                    data.logo = `/uploads/logos/${req.file.filename}`;
                }
                const entreprise = await this.entrepriseService.updateEntreprise(id, data);
                res.status(200).json({ success: true, data: entreprise });
            }
            catch (error) {
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_ENTREPRISE, error });
            }
        };
        this.deleteEntreprise = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ID_INVALID });
                }
                await this.entrepriseService.deleteEntreprise(id);
                res.status(200).json({ success: true, message: success_messages_1.SUCCESS_MESSAGES.USER_DELETED });
            }
            catch (error) {
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_ENTREPRISE, error });
            }
        };
        // Fermer (désactiver) une entreprise
        this.fermerEntreprise = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ID_INVALID });
                }
                // On passe le statut à 'inactive'
                const entreprise = await this.entrepriseService.updateEntreprise(id, { statut: 'inactive' });
                res.status(200).json({ success: true, data: entreprise });
            }
            catch (error) {
                res.status(500).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_ENTREPRISE, error });
            }
        };
        this.entrepriseService = new entreprise_service_1.EntrepriseService();
        this.userRepository = new user_repository_1.UserRepository();
    }
}
exports.EntrepriseController = EntrepriseController;
