"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = generateQRCode;
const qrcode_1 = __importDefault(require("qrcode"));
async function generateQRCode(text) {
    try {
        return await qrcode_1.default.toDataURL(text);
    }
    catch (err) {
        throw new Error('QR code generation failed');
    }
}
