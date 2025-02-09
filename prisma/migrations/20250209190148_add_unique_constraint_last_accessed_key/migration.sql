/*
  Warnings:

  - You are about to drop the column `lastAccessed` on the `Key` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Key" DROP COLUMN "lastAccessed";

-- CreateTable
CREATE TABLE "LastAccessedKey" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "keyId" INTEGER NOT NULL,

    CONSTRAINT "LastAccessedKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LastAccessedKey_userId_key" ON "LastAccessedKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LastAccessedKey_keyId_key" ON "LastAccessedKey"("keyId");

-- AddForeignKey
ALTER TABLE "LastAccessedKey" ADD CONSTRAINT "LastAccessedKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastAccessedKey" ADD CONSTRAINT "LastAccessedKey_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "Key"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
