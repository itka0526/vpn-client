-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "activeTill" SET DEFAULT NOW() + interval '14 day';
