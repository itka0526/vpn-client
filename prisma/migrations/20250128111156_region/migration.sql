-- CreateEnum
CREATE TYPE "Region" AS ENUM ('unknown', 'mn', 'nl');

-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'unknown';
