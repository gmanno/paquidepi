-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_schedulingStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "ServicePrices" DROP CONSTRAINT "ServicePrices_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServicePrices" DROP CONSTRAINT "ServicePrices_vehicleCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_vehicleCategoryId_fkey";

-- AlterTable
ALTER TABLE "VehicleCategory" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleCategoryId_fkey" FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD CONSTRAINT "ServicePrices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrices" ADD CONSTRAINT "ServicePrices_vehicleCategoryId_fkey" FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_schedulingStatusId_fkey" FOREIGN KEY ("schedulingStatusId") REFERENCES "SchedulingStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Client.cpf_unique" RENAME TO "Client_cpf_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
