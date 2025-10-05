"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEntrepriseAccess = checkEntrepriseAccess;
const errors_messages_1 = require("../utils/messages/errors_messages");
function checkEntrepriseAccess(req, res, next) {
    // Si c'est un super admin, autoriser l'accès
    if (req.user && req.user.role === 'SUPER_ADMIN') {
        return next();
    }
    // Pour les autres utilisateurs, vérifier si l'entreprise demandée est la leur
    if (req.user && req.user.entrepriseId) {
        const requestedEntrepriseId = parseInt(req.params.id);
        if (requestedEntrepriseId === req.user.entrepriseId) {
            return next();
        }
    }
    return res.status(403).json({
        success: false,
        message: errors_messages_1.ERROR_MESSAGES.ACCES_INTERDIT
    });
}
