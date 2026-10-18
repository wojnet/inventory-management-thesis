-- DropForeignKey
ALTER TABLE "WarehouseSnapshot" DROP CONSTRAINT "WarehouseSnapshot_changeEventId_fkey";

-- DropIndex
DROP INDEX "WarehouseSnapshot_changeEventId_key";

-- AlterTable
ALTER TABLE "WarehouseSnapshot" DROP COLUMN "changeEventId",
ADD COLUMN     "createdByUserId" UUID;

-- AddForeignKey
ALTER TABLE "WarehouseSnapshot" ADD CONSTRAINT "WarehouseSnapshot_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

