"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardKPIController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const dashboardKPIController = async (req, res) => {
    try {
        // On suppose que l'entreprise est déterminée par le token ou un paramètre
        const entrepriseId = req.query.entrepriseId ? Number(req.query.entrepriseId) : undefined;
        if (!entrepriseId) {
            return res.status(400).json({ error: 'entrepriseId requis' });
        }
        const kpi = await (0, dashboard_service_1.getDashboardKPI)(entrepriseId);
        res.json(kpi);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur', details: error });
    }
};
exports.dashboardKPIController = dashboardKPIController;
