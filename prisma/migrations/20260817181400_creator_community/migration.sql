-- Creator community foundation. Provider integrations are intentionally
-- deferred; these tables establish the server-side state model first.

CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "contactFee" INTEGER NOT NULL DEFAULT 0,
    "sessionRate" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "ageVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");
CREATE INDEX "CreatorProfile_isApproved_isAvailable_idx" ON "CreatorProfile"("isApproved", "isAvailable");

CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentRef" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "ContactRequest_creatorId_status_idx" ON "ContactRequest"("creatorId", "status");
CREATE INDEX "ContactRequest_requesterId_status_idx" ON "ContactRequest"("requesterId", "status");

CREATE TABLE "VideoSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactRequestId" TEXT,
    "customerId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "rate" INTEGER NOT NULL DEFAULT 0,
    "platformFee" INTEGER NOT NULL DEFAULT 0,
    "creatorAmount" INTEGER NOT NULL DEFAULT 0,
    "provider" TEXT,
    "providerSessionId" TEXT,
    "scheduledAt" DATETIME,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "durationSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "VideoSession_creatorId_status_idx" ON "VideoSession"("creatorId", "status");
CREATE INDEX "VideoSession_customerId_status_idx" ON "VideoSession"("customerId", "status");

CREATE TABLE "Gift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "videoSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Gift_recipientId_createdAt_idx" ON "Gift"("recipientId", "createdAt");
CREATE INDEX "Gift_videoSessionId_idx" ON "Gift"("videoSessionId");

CREATE TABLE "CreatorEarning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "videoSessionId" TEXT,
    "giftId" TEXT,
    "grossAmount" INTEGER NOT NULL,
    "platformFee" INTEGER NOT NULL DEFAULT 0,
    "netAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "availableAt" DATETIME,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "CreatorEarning_creatorId_status_idx" ON "CreatorEarning"("creatorId", "status");
