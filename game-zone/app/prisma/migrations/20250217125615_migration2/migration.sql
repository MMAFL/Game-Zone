/*
  Warnings:

  - The values [other] on the enum `users_sexe` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `sexe` ENUM('male', 'female') NOT NULL DEFAULT 'male';
