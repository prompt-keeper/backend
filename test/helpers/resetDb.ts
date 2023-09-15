// src/tests/helpers/reset-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.apiKey.deleteMany(),
    prisma.promptVersion.deleteMany(),
    prisma.prompt.deleteMany(),
  ]);
};
