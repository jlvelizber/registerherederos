import { Campus, CampusPayload, PrismaClient } from "@prisma/client";
import { GetResult } from "@prisma/client/runtime";
const prisma = new PrismaClient();

const campus = [
  {
    name: "Campus Norte",
    address: "Fco Ordellana",
    code_name: "Norte",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    CampusServices: [],
  },
];

export const migrateCampus = async () => {
  await prisma.campus.upsert({
    update: {},
    where: {
      id: 0,
    },
    create: {
      name: "Campus Norte",
      address: "Fco Ordellana",
      code_name: "Norte",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      CampusServices: {
        create: [
          {
            description: "Primer Servicio",
            start_hour: "10:00",
            end_hour: "11:00",
          },
          {
            description: "Segundo Servicio",
            start_hour: "12:00",
            end_hour: "14:00",
          },
          {
            description: "Tercer Servicio",
            start_hour: "17:00",
            end_hour: "19:00",
          },
        ],
      },
    },
  });

  await prisma.campus.upsert({
    update: {},
    where: {
      id: 0,
    },
    create: {
      name: "Campus Sur",
      address: "Campus Sur. Cdla. La Saiba, Salón de Eventos Asomar",
      code_name: "Sur",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      CampusServices: {
        create: [
          {
            description: "Primer Servicio",
            start_hour: "11:00",
            end_hour: "13:00",
          },
          {
            description: "Segundo Servicio",
            start_hour: "16:00",
            end_hour: "18:00",
          },
        ],
      },
    },
  });
};
