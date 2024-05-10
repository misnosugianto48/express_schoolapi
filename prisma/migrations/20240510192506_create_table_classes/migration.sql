-- CreateTable
CREATE TABLE `classes` (
    `id` VARCHAR(50) NOT NULL,
    `classname` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
