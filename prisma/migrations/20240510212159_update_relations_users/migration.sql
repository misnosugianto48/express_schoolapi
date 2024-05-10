-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_class_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `address_id` VARCHAR(50) NULL,
    MODIFY `class_id` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
