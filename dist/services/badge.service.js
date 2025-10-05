"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBadge = createBadge;
const db_1 = __importDefault(require("../config/db"));
async function createBadge(employeId, matricule, qrCode) {
    return db_1.default.badge.create({
        data: {
            employeId,
            matricule,
            qrCode,
        },
    });
}
