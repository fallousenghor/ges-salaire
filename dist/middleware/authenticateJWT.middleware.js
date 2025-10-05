"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_messages_1 = require("../utils/messages/errors_messages");
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.query.token) {
        token = req.query.token;
    }
    else if (req.body && req.body.token) {
        token = req.body.token;
    }
    if (!token) {
        return res.status(401).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.TOKEN_MISSING });
    }
    try {
        const secret = process.env.JWT_SECRET || 'votre_secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.INVALID_TOKEN });
        }
    }
    catch (err) {
        return res.status(401).json({ success: false, message: errors_messages_1.ERROR_MESSAGES.INVALID_TOKEN });
    }
}
