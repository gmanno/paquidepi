-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "serviceStatusId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ServiceStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD FOREIGN KEY ("serviceStatusId") REFERENCES "ServiceStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
