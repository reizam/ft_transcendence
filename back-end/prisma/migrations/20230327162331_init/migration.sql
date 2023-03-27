-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "profilePicture" TEXT,
    "user42Id" TEXT,
    "username" TEXT,
    "has2FA" BOOLEAN NOT NULL,
    "friends" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blockedUsers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerOne" TEXT NOT NULL,
    "playerTwo" TEXT NOT NULL,
    "playerOneScore" INTEGER NOT NULL,
    "playerTwoScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "owner" TEXT NOT NULL,
    "admins" TEXT[],
    "users" TEXT[],
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelSanction" (
    "id" SERIAL NOT NULL,
    "channelId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelSanction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "gameId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToekn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user42Id_key" ON "User"("user42Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
