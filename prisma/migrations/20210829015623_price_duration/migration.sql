/*
  Warnings:

  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - Added the required column `duration` to the `ServicePrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "ServicePrices" ADD COLUMN     "duration" INTEGER NOT NULL;
