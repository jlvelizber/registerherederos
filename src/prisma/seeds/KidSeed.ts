import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const kids = [
  {
    identification: "0926894544",
    name: "Samantha",
    lastname: "Velizon",
    parent_name: "Jorge",
    parent_lastname: "Velizon",
    parent_email: "jorgeconsalvacion@gmail.com",
    parent_phone: "0996781030",
    campus: 1, // Agregar el campo campus con un valor numérico
  },
  {
    identification: "0952214468",
    name: "Karen",
    lastname: "Pachequito",
    parent_name: "Bernardo",
    parent_lastname: "Pacheco",
    parent_email: "jorgeconsalvacion@gmail.com",
    parent_phone: "0996781030",
    campus: 2, // Agregar el campo campus con un valor numérico
  },
];

export const migrateKids = async () => {
  await prisma.kid.createMany({
    data: kids,
    skipDuplicates: true,
  });
};
