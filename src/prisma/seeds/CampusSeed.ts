import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const campus = [
  {
    name: "Campus Norte",
    address: "Fco Ordellana",
    code_name: "Norte",
  },
  {
    name: "Campus Sur",
    address: "Por el mall del sur",
    code_name: "Sur",
  },
];

export const migrateCampus = async () => {
  await prisma.campus.createMany({
    data: campus,
    skipDuplicates: true,
  });
};
