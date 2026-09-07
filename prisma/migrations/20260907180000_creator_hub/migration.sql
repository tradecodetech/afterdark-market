-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "membershipPrice" INTEGER NOT NULL DEFAULT 500;

-- CreateTable
CREATE TABLE "CreatorPost" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "membersOnly" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorMembership" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "CreatorMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityMessage" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityStream" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',

    CONSTRAINT "CommunityStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTip" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityTip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorPost_creatorId_status_createdAt_idx" ON "CreatorPost"("creatorId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorMembership_creatorId_userId_key" ON "CreatorMembership"("creatorId", "userId");

-- CreateIndex
CREATE INDEX "CommunityMessage_creatorId_createdAt_idx" ON "CommunityMessage"("creatorId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunityReport_resolved_createdAt_idx" ON "CommunityReport"("resolved", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityReport_reporterId_targetId_targetType_key" ON "CommunityReport"("reporterId", "targetId", "targetType");

-- CreateIndex
CREATE INDEX "CommunityStream_creatorId_scheduledAt_idx" ON "CommunityStream"("creatorId", "scheduledAt");

-- CreateIndex
CREATE INDEX "CommunityTip_creatorId_createdAt_idx" ON "CommunityTip"("creatorId", "createdAt");

-- AddForeignKey
ALTER TABLE "CreatorPost" ADD CONSTRAINT "CreatorPost_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorMembership" ADD CONSTRAINT "CreatorMembership_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMessage" ADD CONSTRAINT "CommunityMessage_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityStream" ADD CONSTRAINT "CommunityStream_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTip" ADD CONSTRAINT "CommunityTip_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
