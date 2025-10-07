-- AlterTable
ALTER TABLE `Entreprise` MODIFY `couleurPrimaire` VARCHAR(191) NOT NULL DEFAULT '#e1e3e9ff',
    MODIFY `couleurSecondaire` VARCHAR(191) NOT NULL DEFAULT '#44454bff';

-- CreateTable
CREATE TABLE `AvanceSalaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeId` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `dateDemande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateValidation` DATETIME(3) NULL,
    `moisConcerne` DATETIME(3) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'APPROUVE', 'REFUSE', 'PAYE') NOT NULL DEFAULT 'EN_ATTENTE',
    `raisonRefus` VARCHAR(191) NULL,
    `commentaire` VARCHAR(191) NULL,
    `modePaiement` ENUM('ESPECES', 'VIREMENT', 'ORANGE_MONEY', 'WAVE', 'AUTRE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AvanceSalaire` ADD CONSTRAINT `AvanceSalaire_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
