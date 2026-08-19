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
      bio: "Demo creator profile for testing the Pikaboo community flow.",
      avatarUrl: null,
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
      bio: "Demo creator profile for testing the Pikaboo community flow.",
      contactFee: 1000,
      sessionRate: 5000,
      isAvailable: true,
      isApproved: true,
      identityVerified: true,
      ageVerified: true,
    },
  });

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
