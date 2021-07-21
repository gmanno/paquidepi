/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_employeeId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "employeeId";
