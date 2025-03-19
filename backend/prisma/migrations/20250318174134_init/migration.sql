/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `ContestSolutions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContestSolutions_url_key" ON "ContestSolutions"("url");
