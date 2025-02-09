-- DropForeignKey
ALTER TABLE "LastAccessedKey" DROP CONSTRAINT "LastAccessedKey_keyId_fkey";

-- DropForeignKey
ALTER TABLE "LastAccessedKey" DROP CONSTRAINT "LastAccessedKey_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "LastAccessedKey" ADD CONSTRAINT "LastAccessedKey_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastAccessedKey" ADD CONSTRAINT "LastAccessedKey_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "Key"("id") ON DELETE CASCADE ON UPDATE CASCADE;
