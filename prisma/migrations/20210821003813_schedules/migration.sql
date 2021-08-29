/*
  Warnings:

  - You are about to drop the column `dateService` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `serviceCategoryId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `serviceStatusId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration_am` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_pm` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleCategoryId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_serviceCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_serviceStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_categoryId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "dateService",
DROP COLUMN "rate",
DROP COLUMN "serviceCategoryId",
DROP COLUMN "serviceStatusId",
DROP COLUMN "vehicleId",
ADD COLUMN     "duration_am" INTEGER NOT NULL,
ADD COLUMN     "duration_pm" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "categoryId",
ADD COLUMN     "vehicleCategoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "ServiceCategory";

-- DropTable
DROP TABLE "ServiceStatus";

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulingStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheduling" (
    "id" TEXT NOT NULL,
    "dateService" TIMESTAMP(3) NOT NULL,
    "rate" INTEGER NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "schedulingStatusId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulesConfig" (
    "id" TEXT NOT NULL,
    "available_am" INTEGER NOT NULL,
    "available_pm" INTEGER NOT NULL,
    "ativo" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD FOREIGN KEY ("schedulingStatusId") REFERENCES "SchedulingStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
