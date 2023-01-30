import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const clearTables = async () => {
  return Promise.all([
    prisma.comment.deleteMany({ where: {} }),
    prisma.post.deleteMany({ where: {} }),
    prisma.profile.deleteMany({ where: {} }),
    prisma.user.deleteMany({ where: {} }),
  ]);
};
