-- CreateTable
CREATE TABLE `AvanceSalaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeId` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `dateDemande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `moisRembourser` DATETIME(3) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'APPROUVE', 'REFUSE', 'REMBOURSE') NOT NULL DEFAULT 'EN_ATTENTE',
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AvanceSalaire` ADD CONSTRAINT `AvanceSalaire_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
