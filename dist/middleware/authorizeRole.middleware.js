"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = authorizeRole;
const errors_messages_1 = require("../utils/messages/errors_messages");
const errors_code_1 = require("../utils/messages/errors_code");
function authorizeRole(roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            return res.status(errors_code_1.ERROR_CODES.UNAUTHORIZED).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.TOKEN_MISSING });
        }
        if (user.role === 'SUPER_ADMIN' && !roles.includes('SUPER_ADMIN')) {
            return res.status(errors_code_1.ERROR_CODES.FORBIDDEN).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.RESERVE_ADMIN });
        }
        if (roles.includes(user.role)) {
            return next();
        }
        return res.status(errors_code_1.ERROR_CODES.FORBIDDEN).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE });
    };
}
