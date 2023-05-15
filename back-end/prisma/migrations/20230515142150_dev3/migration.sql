/*
  Warnings:

  - The `admins` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `users` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gameId` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `refreshToekn` on the `VerificationToken` table. All the data in the column will be lost.
  - Changed the type of `owner` on the `Channel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `channelId` on the `ChannelSanction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user` on the `ChannelSanction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `channelId` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `profilePicture` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `refreshToken` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "owner",
ADD COLUMN     "owner" INTEGER NOT NULL,
DROP COLUMN "admins",
ADD COLUMN     "admins" INTEGER[],
DROP COLUMN "users",
ADD COLUMN     "users" INTEGER[];

-- AlterTable
ALTER TABLE "ChannelSanction" DROP COLUMN "channelId",
ADD COLUMN     "channelId" INTEGER NOT NULL,
DROP COLUMN "user",
ADD COLUMN     "user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channelId",
ADD COLUMN     "channelId" INTEGER NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "gameId",
ADD COLUMN     "gameId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "profilePicture" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "refreshToekn",
ADD COLUMN     "refreshToken" TEXT NOT NULL;
