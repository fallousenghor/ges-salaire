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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeController = void 0;
const pointage_service_1 = require("../services/pointage.service");
const pointageService = new pointage_service_1.PointageService();
const employe_service_1 = require("../services/employe.service");
const errors_messages_1 = require("../utils/messages/errors_messages");
const errors_code_1 = require("../utils/messages/errors_code");
const success_code_1 = require("../utils/messages/success_code");
const employeService = new employe_service_1.EmployeService();
class EmployeController {
    // Nombre de pointages sur une période
    static async getNbPointages(req, res) {
        try {
            const { employeId } = req.params;
            const { start, end } = req.query;
            if (!employeId || !start || !end)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'employeId, start et end requis' });
            const nb = await new pointage_service_1.PointageService().getNbPointages(Number(employeId), String(start), String(end));
            res.json(nb);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    // Dernier pointage d'un employé
    static async getLastPointage(req, res) {
        try {
            const { employeId } = req.params;
            if (!employeId)
                return res.status(400).json({ error: 'employeId requis' });
            const pointage = await pointageService.getLastPointage(Number(employeId));
            res.json(pointage ? { date: pointage.date } : null);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    // Pointage d'un employé
    static async pointerEmploye(req, res) {
        try {
            const { employeId } = req.params;
            if (!employeId)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'employeId requis' });
            const pointage = await pointageService.pointer(Number(employeId));
            res.status(success_code_1.SUCCESS_CODES.CREATED).json(pointage);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    // Liste paginée par entreprise
    static async getEmployesByEntreprisePaginated(req, res) {
        try {
            const { entrepriseId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await employeService.getEmployesByEntreprisePaginated(Number(entrepriseId), page, limit);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    // Recherche/filtres avancés
    static async searchEmployes(req, res) {
        try {
            const { entrepriseId } = req.query;
            if (!entrepriseId)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'entrepriseId requis' });
            const filters = {
                statut: req.query.statut,
                poste: req.query.poste,
                typeContrat: req.query.typeContrat,
                actif: req.query.actif !== undefined ? req.query.actif === 'true' : undefined,
            };
            const employes = await employeService.searchEmployes(Number(entrepriseId), filters);
            res.json(employes);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    // Activation/désactivation
    static async setEmployeActif(req, res) {
        try {
            const { id } = req.params;
            const { actif } = req.body;
            if (typeof actif !== 'boolean')
                return res.status(400).json({ error: 'actif (boolean) requis' });
            const employe = await employeService.setEmployeActif(Number(id), actif);
            res.json(employe);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    static async createEmploye(req, res) {
        try {
            const employe = await employeService.createEmploye(req.body);
            // Vérifier si le badge existe
            const badge = await Promise.resolve().then(() => __importStar(require('../services/badge.service'))).then(mod => mod.createBadge ? mod.createBadge : null);
            let badgeCreated = false;
            if (badge) {
                // On tente de retrouver le badge créé
                const employeBadge = await Promise.resolve().then(() => __importStar(require('../config/db'))).then(mod => mod.default.badge.findUnique({ where: { employeId: employe.id } }));
                badgeCreated = !!employeBadge;
            }
            if (!badgeCreated) {
                return res.status(201).json({ employe, warning: 'Employé créé mais badge non généré.' });
            }
            res.status(201).json(employe);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    static async getEmployesByEntreprise(req, res) {
        try {
            const { entrepriseId } = req.params;
            const employes = await employeService.getEmployesByEntreprise(Number(entrepriseId));
            res.json(employes);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    static async getEmployeById(req, res) {
        try {
            const { id } = req.params;
            const employe = await employeService.getEmployeById(Number(id));
            if (!employe)
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.EMPLOYE_NOT_FOUND });
            res.json(employe);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    static async updateEmploye(req, res) {
        try {
            const { id } = req.params;
            const employe = await employeService.updateEmploye(Number(id), req.body);
            res.json(employe);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
    static async deleteEmploye(req, res) {
        try {
            const { id } = req.params;
            await employeService.deleteEmploye(Number(id));
            res.status(204).send();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(400).json({ error: message });
        }
    }
}
exports.EmployeController = EmployeController;
