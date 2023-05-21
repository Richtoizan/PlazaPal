/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_Email_key" ON "Admin"("Email");
