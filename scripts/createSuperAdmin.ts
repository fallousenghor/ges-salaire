import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Données du super admin
    const adminData = {
      email: 'admin@gestion.com',
      motDePasse: 'admin123456',
      nom: 'Super',
      prenom: 'Admin',
    };

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
      include: { roles: true }
    });

    if (existingUser) {
      console.log('Un utilisateur avec cet email existe déjà !');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.motDePasse, 10);

    // Créer le super admin
    const superAdmin = await prisma.user.create({
      data: {
        email: adminData.email,
        motDePasse: hashedPassword,
        nom: adminData.nom,
        prenom: adminData.prenom,
        doitChangerMotDePasse: false,
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

    console.log('Super Admin créé avec succès !');
    console.log('Email:', adminData.email);
    console.log('Mot de passe:', adminData.motDePasse);
    console.log('ID:', superAdmin.id);
    console.log('Rôles:', superAdmin.roles);

  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
createSuperAdmin();