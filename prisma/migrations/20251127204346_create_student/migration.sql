/*
  Warnings:

  - You are about to alter the column `monthly_fees` on the `batch` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `fees` on the `student` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `due_amount` on the `student` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `batch` MODIFY `monthly_fees` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `fees` INTEGER NOT NULL DEFAULT 0,
    MODIFY `due_amount` INTEGER NOT NULL DEFAULT 0;
