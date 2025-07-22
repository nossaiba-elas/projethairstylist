-- CreateTable
CREATE TABLE `Reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `heure` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `disponibilite_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disponibilite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `heure` VARCHAR(191) NOT NULL,
    `is_reserved` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_disponibilite_id_fkey` FOREIGN KEY (`disponibilite_id`) REFERENCES `Disponibilite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
