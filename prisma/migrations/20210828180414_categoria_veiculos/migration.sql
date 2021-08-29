/*
  Warnings:

  - The primary key for the `VehicleCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_vehicleCategoryId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "vehicleCategoryId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "VehicleCategory" DROP CONSTRAINT "VehicleCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "VehicleCategory_id_seq";

-- AddForeignKey
ALTER TABLE "Vehicle" ADD FOREIGN KEY ("vehicleCategoryId") REFERENCES "VehicleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
