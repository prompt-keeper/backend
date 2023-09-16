/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Prompt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Prompt_name_key" ON "Prompt"("name");
