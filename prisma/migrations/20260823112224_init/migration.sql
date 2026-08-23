-- CreateEnum
CREATE TYPE "WarehouseRole" AS ENUM ('ADMIN', 'WORKER');

-- CreateEnum
CREATE TYPE "AttributeDataType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE');

-- CreateEnum
CREATE TYPE "ActionOperation" AS ENUM ('INCREASE_QUANTITY', 'DECREASE_QUANTITY', 'SET_QUANTITY', 'SET_ATTRIBUTE');

-- CreateEnum
CREATE TYPE "ChangeSource" AS ENUM ('MANUAL', 'ACTION', 'AI', 'RESTORE');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('CREATE', 'UPDATE', 'ARCHIVE', 'RESTORE');

-- CreateTable
CREATE TABLE "AppUser" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseMembership" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "role" "WarehouseRole" NOT NULL DEFAULT 'WORKER',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "WarehouseMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemAttribute" (
    "id" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "dataType" "AttributeDataType" NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ItemAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "createdByUserId" UUID,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "archivedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionStep" (
    "id" UUID NOT NULL,
    "actionId" UUID NOT NULL,
    "itemId" UUID,
    "attributeId" UUID,
    "position" INTEGER NOT NULL,
    "operation" "ActionOperation" NOT NULL,
    "numericValue" DECIMAL(18,3),
    "attributeValue" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ActionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeEvent" (
    "id" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "actorUserId" UUID,
    "source" "ChangeSource" NOT NULL,
    "actionId" UUID,
    "restoredEventId" UUID,
    "description" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeEntry" (
    "id" UUID NOT NULL,
    "changeEventId" UUID NOT NULL,
    "itemId" UUID,
    "changeType" "ChangeType" NOT NULL,
    "fieldPath" VARCHAR(255) NOT NULL,
    "beforeValue" JSONB,
    "afterValue" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseSnapshot" (
    "id" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "changeEventId" UUID NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarehouseSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE INDEX "WarehouseMembership_warehouseId_idx" ON "WarehouseMembership"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseMembership_userId_warehouseId_key" ON "WarehouseMembership"("userId", "warehouseId");

-- CreateIndex
CREATE INDEX "Item_warehouseId_idx" ON "Item"("warehouseId");

-- CreateIndex
CREATE INDEX "ItemAttribute_itemId_idx" ON "ItemAttribute"("itemId");

-- CreateIndex
CREATE INDEX "ItemAttribute_warehouseId_idx" ON "ItemAttribute"("warehouseId");

-- CreateIndex
CREATE INDEX "Action_warehouseId_idx" ON "Action"("warehouseId");

-- CreateIndex
CREATE INDEX "ActionStep_actionId_idx" ON "ActionStep"("actionId");

-- CreateIndex
CREATE UNIQUE INDEX "ActionStep_actionId_position_key" ON "ActionStep"("actionId", "position");

-- CreateIndex
CREATE INDEX "ChangeEvent_warehouseId_createdAt_idx" ON "ChangeEvent"("warehouseId", "createdAt");

-- CreateIndex
CREATE INDEX "ChangeEntry_changeEventId_idx" ON "ChangeEntry"("changeEventId");

-- CreateIndex
CREATE INDEX "ChangeEntry_itemId_idx" ON "ChangeEntry"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseSnapshot_changeEventId_key" ON "WarehouseSnapshot"("changeEventId");

-- CreateIndex
CREATE INDEX "WarehouseSnapshot_warehouseId_createdAt_idx" ON "WarehouseSnapshot"("warehouseId", "createdAt");

-- AddForeignKey
ALTER TABLE "WarehouseMembership" ADD CONSTRAINT "WarehouseMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseMembership" ADD CONSTRAINT "WarehouseMembership_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAttribute" ADD CONSTRAINT "ItemAttribute_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAttribute" ADD CONSTRAINT "ItemAttribute_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" ADD CONSTRAINT "ActionStep_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" ADD CONSTRAINT "ActionStep_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionStep" ADD CONSTRAINT "ActionStep_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "ItemAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEvent" ADD CONSTRAINT "ChangeEvent_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEvent" ADD CONSTRAINT "ChangeEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEvent" ADD CONSTRAINT "ChangeEvent_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEvent" ADD CONSTRAINT "ChangeEvent_restoredEventId_fkey" FOREIGN KEY ("restoredEventId") REFERENCES "ChangeEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEntry" ADD CONSTRAINT "ChangeEntry_changeEventId_fkey" FOREIGN KEY ("changeEventId") REFERENCES "ChangeEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEntry" ADD CONSTRAINT "ChangeEntry_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseSnapshot" ADD CONSTRAINT "WarehouseSnapshot_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseSnapshot" ADD CONSTRAINT "WarehouseSnapshot_changeEventId_fkey" FOREIGN KEY ("changeEventId") REFERENCES "ChangeEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
