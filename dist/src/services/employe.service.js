"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeService = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class EmployeService {
    async getEmployesByEntreprisePaginated(entrepriseId, pagination) {
        const skip = (pagination.page ? (pagination.page - 1) * (pagination.limit || 10) : 0);
        const [items, total] = await Promise.all([
            db_1.default.employe.findMany({
                where: { entrepriseId },
                skip,
                take: pagination.limit,
                include: { entreprise: true, badge: true }
            }),
            db_1.default.employe.count({ where: { entrepriseId } })
        ]);
        return (0, pagination_utils_1.paginateResults)(items, total, pagination);
    }
    async createEmploye(data) {
        try {
            // Générer une matricule si non fournie
            if (!data.matricule) {
                data.matricule = await this.generateUniqueMatricule();
            }
            // Vérifier unicité
            const exist = await db_1.default.employe.findUnique({ where: { matricule: data.matricule } });
            if (exist) {
                throw new Error('La matricule existe déjà.');
            }
            // Créer l'employé
            const employe = await db_1.default.employe.create({ data });
            // Générer le QR code
            let qrCode = '';
            try {
                const { generateQRCode } = await Promise.resolve().then(() => __importStar(require('../utils/qrcode')));
                qrCode = await generateQRCode(data.matricule);
            }
            catch (err) {
                console.error('Erreur génération QR code:', err);
                qrCode = '';
            }
            // Créer le badge
            try {
                const { createBadge } = await Promise.resolve().then(() => __importStar(require('./badge.service')));
                await createBadge(employe.id, data.matricule, qrCode);
            }
            catch (err) {
                console.error('Erreur création badge:', err);
            }
            return employe;
        }
        catch (err) {
            console.error('Erreur création employé:', err);
            throw err;
        }
    }
    // Génère une matricule unique simple (ex: EMP20251002-XXXX)
    async generateUniqueMatricule() {
        let matricule;
        let exist;
        do {
            matricule = `EMP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
            exist = await db_1.default.employe.findUnique({ where: { matricule } });
        } while (exist);
        return matricule;
    }
    async getEmployesByEntreprise(entrepriseId) {
        return db_1.default.employe.findMany({ where: { entrepriseId }, include: { entreprise: true, badge: true } });
    }
    // Recherche/filtres avancés
    async searchEmployes(entrepriseId, filters) {
        return db_1.default.employe.findMany({
            where: {
                entrepriseId,
                ...(filters.statut ? { statut: filters.statut } : {}),
                ...(filters.poste ? { poste: filters.poste } : {}),
                ...(filters.typeContrat ? { typeContrat: filters.typeContrat } : {}),
                ...(filters.actif !== undefined ? { actif: filters.actif } : {}),
            },
            include: { entreprise: true, badge: true },
        });
    }
    // Activation/désactivation
    async setEmployeActif(id, actif) {
        return db_1.default.employe.update({ where: { id }, data: { actif } });
    }
    async getEmployeById(id) {
        return db_1.default.employe.findUnique({
            where: { id },
            include: { badge: true },
        });
    }
    async updateEmploye(id, data) {
        return db_1.default.employe.update({ where: { id }, data });
    }
    async deleteEmploye(id) {
        return db_1.default.employe.delete({ where: { id } });
    }
}
exports.EmployeService = EmployeService;
