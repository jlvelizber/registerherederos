import { Kid } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const ALGSALT: string | number = process.env.ALGSALT || 10;

export async function hasString(plainPassword: string) {
  const hash = await bcryptjs.hash(plainPassword, 10);
  return hash;
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const result = await bcryptjs.compare(plainPassword, hashedPassword);
  if (result) {
    return true;
  } else {
    return false;
  }
}

export function generarJWT(uid: string, name: string) {
  const signJWT = process.env.SECRET_JWT_KEY || "estoesunavaina";
  return new Promise((resolve, reject) => {
    const paylad = { uid, name };

    jwt.sign(
      paylad,
      signJWT,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(`No se pudo generar el token`);
        }

        resolve(token);
      }
    );
  });
}

export async function generateTokenForQrKids(kid: Kid) {
  const { id, name } = kid
  const dataForEncription = id + '_' + name
  return await hasString(dataForEncription)

}
