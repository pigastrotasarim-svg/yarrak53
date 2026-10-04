/*
  Warnings:

  - Added the required column `firstName` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tcKimlik` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "cargoType" TEXT NOT NULL DEFAULT 'Genel kargo',
ADD COLUMN     "cargoWeightKg" DOUBLE PRECISION,
ADD COLUMN     "destAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "destApartment" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "destBuildingNo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "destFloor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "destMahalle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "destStreet" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "originAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originApartment" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originBuildingNo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originFloor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originMahalle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originStreet" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "packageCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "receiverGsm" TEXT,
ADD COLUMN     "receiverName" TEXT,
ADD COLUMN     "tcKimlik" TEXT NOT NULL,
ADD COLUMN     "vehiclePlate" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phone1" TEXT NOT NULL DEFAULT '+90 242 255 06 98',
    "phone2" TEXT NOT NULL DEFAULT '+90 242 255 06 98',
    "email" TEXT NOT NULL DEFAULT 'info@anadolulojistik.com',
    "addressLine1" TEXT NOT NULL DEFAULT 'Aşağıpazar Mahallesi 606 Sokak No: 5',
    "addressLine2" TEXT NOT NULL DEFAULT 'Korkuteli / Antalya',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
