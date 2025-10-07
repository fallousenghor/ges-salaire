-- CreateTable
CREATE TABLE `SuperAdminAccess` (
    `superAdminId` INTEGER NOT NULL,
    `entrepriseId` INTEGER NOT NULL,
    `hasAccess` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`superAdminId`, `entrepriseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuperAdminAccess` ADD CONSTRAINT `SuperAdminAccess_superAdminId_fkey` FOREIGN KEY (`superAdminId`) REFERENCES `UserEntreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuperAdminAccess` ADD CONSTRAINT `SuperAdminAccess_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
