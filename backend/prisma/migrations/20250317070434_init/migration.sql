-- CreateEnum
CREATE TYPE "PlatFromEnum" AS ENUM ('CodeForces', 'LeetCode', 'CodeChef');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "PlatFrom" "PlatFromEnum" NOT NULL,
    "querySlug" TEXT NOT NULL,
    "contestName" TEXT NOT NULL,
    "StartTime" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserBookMark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContestSolutions" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_id_idx" ON "User"("username", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_id_key" ON "Contest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_querySlug_key" ON "Contest"("querySlug");

-- CreateIndex
CREATE INDEX "Contest_id_PlatFrom_querySlug_idx" ON "Contest"("id", "PlatFrom", "querySlug");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_querySlug_PlatFrom_key" ON "Contest"("querySlug", "PlatFrom");

-- CreateIndex
CREATE UNIQUE INDEX "UserBookMark_id_key" ON "UserBookMark"("id");

-- CreateIndex
CREATE INDEX "UserBookMark_userId_contestId_idx" ON "UserBookMark"("userId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBookMark_userId_contestId_key" ON "UserBookMark"("userId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestSolutions_id_key" ON "ContestSolutions"("id");

-- CreateIndex
CREATE INDEX "ContestSolutions_contestId_url_idx" ON "ContestSolutions"("contestId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "ContestSolutions_url_contestId_key" ON "ContestSolutions"("url", "contestId");

-- AddForeignKey
ALTER TABLE "UserBookMark" ADD CONSTRAINT "UserBookMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookMark" ADD CONSTRAINT "UserBookMark_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSolutions" ADD CONSTRAINT "ContestSolutions_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
