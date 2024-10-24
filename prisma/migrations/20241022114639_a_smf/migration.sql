/*
  Warnings:

  - You are about to drop the column `extendedDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "extendedDate",
ADD COLUMN     "activeTill" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '14 day';
