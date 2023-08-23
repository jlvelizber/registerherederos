import { PrismaClient } from "@prisma/client";
import {  migrateUsers, migrateCampus, migrateKids } from "./seeds";

const prisma = new PrismaClient();

async function main() {
  await migrateUsers();
  await migrateCampus();
  await migrateKids();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
