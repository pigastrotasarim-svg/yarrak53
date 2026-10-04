import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "anadolu2026";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      phone1: "+90 242 255 06 98",
      phone2: "+90 242 255 06 98",
      email: "info@anadolulojistik.com",
      addressLine1: "Aşağıpazar Mahallesi 606 Sokak No: 5",
      addressLine2: "Korkuteli / Antalya",
    },
  });

  console.log(`Admin hazır: ${username} / ${password}`);
  console.log("Site ayarları hazır");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
