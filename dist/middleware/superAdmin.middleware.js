"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminMiddleware = superAdminMiddleware;
const errors_messages_1 = require("../utils/messages/errors_messages");
function superAdminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'SUPER_ADMIN') {
        return next();
    }
    return res.status(403).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.RESERVE_ADMIN });
}
