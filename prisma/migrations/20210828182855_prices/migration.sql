/*
  Warnings:

  - You are about to drop the column `duration_am` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `duration_pm` on the `Service` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scheduling" ADD COLUMN     "servicePricesId" INTEGER;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "duration_am",
DROP COLUMN "duration_pm",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ServicePrices" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "vehicleCategoryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD FOREIGN KEY ("servicePricesId") REFERENCES "ServicePrices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
