"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        // Vérifie si un super admin existe déjà
        const existingAdmin = await prisma.user.findFirst({
            include: {
                roles: true
            },
            where: {
                roles: {
                    some: {
                        role: 'SUPER_ADMIN'
                    }
                }
            }
        });
        if (existingAdmin) {
            console.log('Un super administrateur existe déjà.');
            return;
        }
        // Crée un nouvel utilisateur super admin
        const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
        const user = await prisma.user.create({
            data: {
                nom: 'Admin',
                prenom: 'Super',
                email: 'admin@admin.com',
                motDePasse: hashedPassword,
                doitChangerMotDePasse: true,
                roles: {
                    create: {
                        role: 'SUPER_ADMIN'
                    }
                }
            },
            include: {
                roles: true
            }
        });
        console.log('Super administrateur créé avec succès:', {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            roles: user.roles
        });
    }
    catch (error) {
        console.error('Erreur lors de la création du super admin:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
