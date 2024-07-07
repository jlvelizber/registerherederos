import { PrismaClient, Role } from "@prisma/client";
import { hasString } from "../../utils";
const prisma = new PrismaClient();

const passwordResult: string = "123456";

const users = [
  {
    name: "Jorge Luis",
    lastname: "Veliz",
    email: "info@webservice.com.ec",
    role: Role.admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: "Karen",
    lastname: "Pacheco",
    email: "mkt@webservice.com.ec",
    role: Role.user,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: "Campus",
    lastname: "Norte",
    email: "campus@familiadedios.com.ec",
    role: Role.user,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const migrateUsers = async () => {
  const passwordHashResult = await hasString(passwordResult);

  const newUsers = users.map((user) => {
    return {
      ...user,
      password: passwordHashResult,
    };
  });

  await prisma.user.createMany({
    data: newUsers,
    skipDuplicates: true,
  });
};
