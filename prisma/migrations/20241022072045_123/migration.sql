-- CreateEnum
CREATE TYPE "VPNType" AS ENUM ('WireGuardVPN', 'OpenVPN');

-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "type" "VPNType" NOT NULL DEFAULT 'WireGuardVPN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 2500;
