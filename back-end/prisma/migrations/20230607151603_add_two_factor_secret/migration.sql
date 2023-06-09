/*
  Warnings:

  - You are about to drop the column `playerOne` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `playerTwo` on the `Game` table. All the data in the column will be lost.
  - Added the required column `playerOneId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwoId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerOne",
DROP COLUMN "playerTwo",
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "launchedAt" TIMESTAMP(3),
ADD COLUMN     "playerOneId" INTEGER NOT NULL,
ADD COLUMN     "playerTwoId" INTEGER NOT NULL,
ALTER COLUMN "playerOneScore" SET DEFAULT 0,
ALTER COLUMN "playerTwoScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "draws" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "elo" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_GameToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameToUser_AB_unique" ON "_GameToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToUser_B_index" ON "_GameToUser"("B");

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
