/*
  Warnings:

  - You are about to drop the column `tva` on the `Payslip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Payslip` DROP COLUMN `tva`,
    ADD COLUMN `impotRevenu` DOUBLE NOT NULL DEFAULT 0;
