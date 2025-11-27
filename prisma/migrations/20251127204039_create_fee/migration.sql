/*
  Warnings:

  - You are about to alter the column `amount_paid` on the `feepayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `feepayment` MODIFY `amount_paid` INTEGER NOT NULL;
