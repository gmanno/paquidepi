/*
  Warnings:

  - Added the required column `duration` to the `ServiceCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "duration" INTEGER NOT NULL;
