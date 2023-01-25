/*
  Warnings:

  - You are about to drop the column `friends` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "friends",
ADD COLUMN     "followers" TEXT[],
ADD COLUMN     "following" TEXT[];
