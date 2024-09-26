-- CreateTable
CREATE TABLE "Key" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
