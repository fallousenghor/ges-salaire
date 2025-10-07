"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../src/config/db"));
async function main() {
    const entreprises = await db_1.default.entreprise.findMany({ select: { id: true, nom: true, logo: true } });
    console.log('Entreprises:');
    entreprises.forEach(e => {
        console.log(`${e.id} | ${e.nom} | ${e.logo}`);
    });
    process.exit(0);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
