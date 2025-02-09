/*
  Warnings:

  - You are about to drop the column `userId` on the `LastAccessedKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `LastAccessedKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `LastAccessedKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LastAccessedKey" DROP CONSTRAINT "LastAccessedKey_userId_fkey";

-- DropIndex
DROP INDEX "LastAccessedKey_userId_key";

-- AlterTable
ALTER TABLE "LastAccessedKey" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LastAccessedKey_userEmail_key" ON "LastAccessedKey"("userEmail");

-- AddForeignKey
ALTER TABLE "LastAccessedKey" ADD CONSTRAINT "LastAccessedKey_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
