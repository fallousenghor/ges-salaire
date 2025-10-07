/*
  Warnings:

  - The values [VACATAIRE] on the enum `Employe_statut` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `message` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_ibfk_2`;

-- DropIndex
DROP INDEX `entrepriseId` ON `Notification`;

-- DropIndex
DROP INDEX `userId` ON `Notification`;

-- AlterTable
ALTER TABLE `Employe` MODIFY `statut` ENUM('ACTIF', 'INACTIF', 'EN_CONGE') NOT NULL DEFAULT 'ACTIF';

-- AlterTable
ALTER TABLE `Notification` MODIFY `message` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
