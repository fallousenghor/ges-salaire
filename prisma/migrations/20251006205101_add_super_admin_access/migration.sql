/*
  Warnings:

  - You are about to drop the `AvanceSalaire` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AvanceSalaire` DROP FOREIGN KEY `AvanceSalaire_employeId_fkey`;

-- DropTable
DROP TABLE `AvanceSalaire`;
