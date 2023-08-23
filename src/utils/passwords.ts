import bcryptjs from "bcryptjs";

const ALGSALT : string | number = process.env.ALGSALT || 10;

export async function hashPassword(plainPassword: string) {
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
