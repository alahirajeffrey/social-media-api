import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const clearUserTable = async () => {
  return await prisma.user.deleteMany({ where: {} });
};

export const clearProfileTable = async () => {
  return await prisma.profile.deleteMany({ where: {} });
};

export const clearCommentTable = async () => {
  return await prisma.comment.deleteMany({ where: {} });
};

export const clearPostTable = async () => {
  return await prisma.post.deleteMany({ where: {} });
};
