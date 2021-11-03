/*
  Warnings:

  - The primary key for the `link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `link` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `link` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `link_url_key` ON `link`(`url`);
