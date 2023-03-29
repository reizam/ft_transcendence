/*
  Warnings:

  - You are about to drop the column `user42Id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fortytwoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fortytwoId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_user42Id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user42Id",
ADD COLUMN     "fortytwoId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_fortytwoId_key" ON "User"("fortytwoId");
