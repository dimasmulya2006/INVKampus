-- =====================================================
-- SISTEM INVENTARIS BARANG DI KAMPUS
-- Database: inventaris_kampus
-- Dibuat: 2026
-- =====================================================

-- Gunakan database inventaris_kampus
USE `inventaris_kampus`;

-- =====================================================
-- Hapus tabel jika sudah ada (urutan penting!)
-- =====================================================
DROP TABLE IF EXISTS `Item`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `_prisma_migrations`;

-- =====================================================
-- Buat tabel _prisma_migrations (untuk tracking Prisma)
-- =====================================================
CREATE TABLE `_prisma_migrations` (
  `id`                      VARCHAR(36)  NOT NULL,
  `checksum`                VARCHAR(64)  NOT NULL,
  `finished_at`             DATETIME(3)  NULL,
  `migration_name`          VARCHAR(255) NOT NULL,
  `logs`                    TEXT         NULL,
  `rolled_back_at`          DATETIME(3)  NULL,
  `started_at`              DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count`     INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =====================================================
-- Buat tabel User
-- =====================================================
CREATE TABLE `User` (
  `id`        VARCHAR(191) NOT NULL,
  `name`      VARCHAR(191) NOT NULL,
  `username`  VARCHAR(191) NOT NULL,
  `password`  VARCHAR(191) NOT NULL,
  `role`      ENUM('ADMIN','PETUGAS') NOT NULL DEFAULT 'PETUGAS',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `User_username_key`(`username`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =====================================================
-- Buat tabel Item
-- =====================================================
CREATE TABLE `Item` (
  `id`           VARCHAR(191) NOT NULL,
  `code`         VARCHAR(191) NOT NULL,
  `name`         VARCHAR(191) NOT NULL,
  `category`     VARCHAR(191) NOT NULL,
  `quantity`     INT          NOT NULL,
  `condition`    ENUM('BAIK','RUSAK_RINGAN','RUSAK_BERAT') NOT NULL,
  `location`     VARCHAR(191) NOT NULL,
  `dateReceived` DATETIME(3)  NOT NULL,
  `description`  VARCHAR(191) NULL,
  `photoUrl`     VARCHAR(191) NULL,
  `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3)  NOT NULL,

  UNIQUE INDEX `Item_code_key`(`code`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =====================================================
-- Catat migrasi di tabel _prisma_migrations
-- =====================================================
INSERT INTO `_prisma_migrations` VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'abc123checksum456def789abc123checksum456def789abc123checksum456d',
  NOW(3),
  '20260526160604_init',
  NULL,
  NULL,
  NOW(3),
  1
);

-- =====================================================
-- DATA AWAL (SEED)
-- Password sudah di-hash menggunakan bcrypt
-- admin    -> password: admin123
-- petugas1 -> password: petugas123
-- =====================================================

-- Akun Admin
INSERT INTO `User` (`id`, `name`, `username`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(
  UUID(),
  'Administrator',
  'admin',
  '$2b$10$Oxob5FGAxBTquwq6kDromOGtYWex5Skm0ezaL2DqzKnRASTNIXVJy',
  'ADMIN',
  NOW(3),
  NOW(3)
);

-- Akun Petugas
INSERT INTO `User` (`id`, `name`, `username`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(
  UUID(),
  'Petugas Inventaris',
  'petugas1',
  '$2b$10$fcLp1YdLNjbdVF3y4TyhaubhJRuFDnajFsZckDebDHVIEfzqlF3WO',
  'PETUGAS',
  NOW(3),
  NOW(3)
);

-- =====================================================
-- Contoh Data Barang
-- =====================================================
INSERT INTO `Item` (`id`, `code`, `name`, `category`, `quantity`, `condition`, `location`, `dateReceived`, `description`, `photoUrl`, `createdAt`, `updatedAt`) VALUES
(UUID(), 'INV-001', 'Laptop Dell Latitude', 'Elektronik', 10, 'BAIK', 'Lab Komputer A', '2024-01-15 00:00:00.000', 'Laptop untuk kegiatan perkuliahan', NULL, NOW(3), NOW(3)),
(UUID(), 'INV-002', 'Proyektor Epson EB-X51', 'Elektronik', 5, 'BAIK', 'Ruang Kelas 101', '2024-02-10 00:00:00.000', 'Proyektor untuk presentasi', NULL, NOW(3), NOW(3)),
(UUID(), 'INV-003', 'Meja Belajar Mahasiswa', 'Furnitur', 50, 'BAIK', 'Ruang Kelas 101', '2023-08-01 00:00:00.000', 'Meja belajar standar untuk mahasiswa', NULL, NOW(3), NOW(3)),
(UUID(), 'INV-004', 'Kursi Dosen', 'Furnitur', 3, 'RUSAK_RINGAN', 'Ruang Dosen', '2022-07-20 00:00:00.000', 'Kursi ergonomis untuk dosen', NULL, NOW(3), NOW(3)),
(UUID(), 'INV-005', 'AC Split Daikin 1 PK', 'Elektronik', 8, 'BAIK', 'Lab Komputer B', '2023-12-05 00:00:00.000', 'AC untuk kenyamanan ruangan', NULL, NOW(3), NOW(3));

-- =====================================================
-- Verifikasi data
-- =====================================================
SELECT 'Tabel User' AS Tabel, COUNT(*) AS JumlahData FROM `User`
UNION ALL
SELECT 'Tabel Item', COUNT(*) FROM `Item`;
