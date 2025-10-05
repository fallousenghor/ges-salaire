/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Employe` ADD COLUMN `matricule` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employe_matricule_key` ON `Employe`(`matricule`);
