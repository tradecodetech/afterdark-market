import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "creator@pikaboo.app";
  const password = "Creator123!";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Avery",
      passwordHash,
      role: "CREATOR",
      dateOfBirth: new Date("1995-04-18"),
      ageVerified: true,
      phoneVerified: true,
    },
    create: {
      name: "Avery",
      email,
      passwordHash,
      role: "CREATOR",
      dateOfBirth: new Date("1995-04-18"),
      ageVerified: true,
      phoneVerified: true,
    },
  });

  const profile = await prisma.creatorProfile.upsert({
    where: { userId: user.id },
    update: {
      displayName: "Avery",
      bio: "Good vibes, real moments, and exclusive creator updates. Welcome to my Pikaboo.",
      avatarUrl: "/demo/avery-avatar.svg",
      bannerUrl: "/demo/avery-banner.svg",
      membershipPrice: 500,
      contactFee: 1000,
      sessionRate: 5000,
      isAvailable: true,
      isApproved: true,
      identityVerified: true,
      ageVerified: true,
    },
    create: {
      userId: user.id,
      displayName: "Avery",
      bio: "Good vibes, real moments, and exclusive creator updates. Welcome to my Pikaboo.",
      avatarUrl: "/demo/avery-avatar.svg",
      bannerUrl: "/demo/avery-banner.svg",
      membershipPrice: 500,
      contactFee: 1000,
      sessionRate: 5000,
      isAvailable: true,
      isApproved: true,
      identityVerified: true,
      ageVerified: true,
    },
  });

  await prisma.creatorPost.deleteMany({ where: { creatorId: profile.id, title: { in: ["Welcome to my Pikaboo", "Members update"] } } });
  await prisma.creatorPost.createMany({ data: [
    { creatorId: profile.id, title: "Welcome to my Pikaboo", body: "Thanks for all the love and support. Here is a new creator update to start the week.", mediaUrl: "/demo/avery-welcome.svg", membersOnly: false, status: "PUBLISHED" },
    { creatorId: profile.id, title: "Members update", body: "Members get extra posts, community chat, and early access to upcoming creator drops.", mediaUrl: "/demo/avery-welcome.svg", membersOnly: true, status: "PUBLISHED" },
  ] });
  await prisma.communityStream.deleteMany({ where: { creatorId: profile.id, title: "Chill & Chat" } });
  await prisma.communityStream.create({ data: { creatorId: profile.id, title: "Chill & Chat", scheduledAt: new Date(Date.now() + 7 * 86400000), status: "SCHEDULED" } });

  console.log("Demo creator ready.");
  console.log(`Login: ${email} / ${password}`);
  console.log(`Creator profile: ${profile.id}`);
  console.log("Customer test account: customer@pikaboo.app / Customer123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
