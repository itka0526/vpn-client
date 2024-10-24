-- AlterTable
ALTER TABLE "User" ALTER COLUMN "activeTill" SET DEFAULT NOW() + interval '14 day',
ALTER COLUMN "activeTill" SET DATA TYPE DATE;
