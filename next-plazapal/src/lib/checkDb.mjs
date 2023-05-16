import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const allAdmins = await prisma.admin.findMany();
  console.log(allAdmins);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
