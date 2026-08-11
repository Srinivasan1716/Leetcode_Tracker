/*
  Warnings:

  - You are about to drop the column `category` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `leetcodeId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserProblem` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `UserProblem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserProblem` table. All the data in the column will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropIndex
DROP INDEX "Problem_leetcodeId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "category",
DROP COLUMN "leetcodeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "link" TEXT,
ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserProblem" DROP COLUMN "createdAt",
DROP COLUMN "notes",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Submission";
