import { hash } from "bcryptjs";
export async function generatePasswordHash(password) {
    const saltRounds = 10;
    const passwordHash = await hash(password, saltRounds);
    return passwordHash;
}
