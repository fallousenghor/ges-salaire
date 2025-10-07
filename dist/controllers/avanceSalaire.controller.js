"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marquerCommePaye = exports.refuserAvanceSalaire = exports.approuverAvanceSalaire = exports.getAvanceSalaires = exports.createAvanceSalaire = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createAvanceSalaireSchema = zod_1.z.object({
    employeId: zod_1.z.number(),
    montant: zod_1.z.number().positive(),
    moisConcerne: zod_1.z.string().datetime(),
    modePaiement: zod_1.z.enum(['ESPECES', 'VIREMENT', 'ORANGE_MONEY', 'WAVE', 'AUTRE']),
    commentaire: zod_1.z.string().optional(),
});
const createAvanceSalaire = async (req, res) => {
    try {
        const { employeId, montant, moisConcerne, modePaiement, commentaire } = createAvanceSalaireSchema.parse(req.body);
        const employe = await prisma.employe.findUnique({
            where: { id: employeId },
            include: { entreprise: true }
        });
        if (!employe) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }
        const avanceSalaire = await prisma.avanceSalaire.create({
            data: {
                employeId,
                montant,
                moisConcerne: new Date(moisConcerne),
                modePaiement,
                commentaire,
            },
        });
        return res.status(201).json(avanceSalaire);
    }
    catch (error) {
        console.error("Erreur lors de la création de l'avance sur salaire:", error);
        return res.status(500).json({ message: "Erreur lors de la création de l'avance sur salaire" });
    }
};
exports.createAvanceSalaire = createAvanceSalaire;
const getAvanceSalaires = async (req, res) => {
    try {
        const entrepriseId = parseInt(req.params.entrepriseId);
        const avances = await prisma.avanceSalaire.findMany({
            where: {
                employe: {
                    entrepriseId
                }
            },
            include: {
                employe: true
            }
        });
        return res.json(avances);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des avances sur salaire:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des avances sur salaire" });
    }
};
exports.getAvanceSalaires = getAvanceSalaires;
const approuverAvanceSalaire = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const avanceSalaire = await prisma.avanceSalaire.update({
            where: { id },
            data: {
                statut: 'APPROUVE',
                dateValidation: new Date()
            }
        });
        return res.json(avanceSalaire);
    }
    catch (error) {
        console.error("Erreur lors de l'approbation de l'avance sur salaire:", error);
        return res.status(500).json({ message: "Erreur lors de l'approbation de l'avance sur salaire" });
    }
};
exports.approuverAvanceSalaire = approuverAvanceSalaire;
const refuserAvanceSalaire = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { raisonRefus } = req.body;
        const avanceSalaire = await prisma.avanceSalaire.update({
            where: { id },
            data: {
                statut: 'REFUSE',
                raisonRefus,
                dateValidation: new Date()
            }
        });
        return res.json(avanceSalaire);
    }
    catch (error) {
        console.error("Erreur lors du refus de l'avance sur salaire:", error);
        return res.status(500).json({ message: "Erreur lors du refus de l'avance sur salaire" });
    }
};
exports.refuserAvanceSalaire = refuserAvanceSalaire;
const marquerCommePaye = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const avanceSalaire = await prisma.avanceSalaire.update({
            where: { id },
            data: {
                statut: 'PAYE'
            }
        });
        return res.json(avanceSalaire);
    }
    catch (error) {
        console.error("Erreur lors du marquage comme payé de l'avance sur salaire:", error);
        return res.status(500).json({ message: "Erreur lors du marquage comme payé de l'avance sur salaire" });
    }
};
exports.marquerCommePaye = marquerCommePaye;
