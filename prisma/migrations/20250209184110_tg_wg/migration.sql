/*
  Warnings:

  - You are about to drop the column `lastUsedKeyId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "lastAccessed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastUsedKeyId";
