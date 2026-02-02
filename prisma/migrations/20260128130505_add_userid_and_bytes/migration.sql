/*
  Warnings:

  - You are about to drop the column `compressedSize` on the `Video` table. All the data in the column will be lost.
  - Added the required column `bytes` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "compressedSize",
ADD COLUMN     "bytes" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;
