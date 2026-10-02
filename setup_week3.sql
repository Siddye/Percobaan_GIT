-- PMI 1320 Sistem Basis Data - Pertemuan 3
-- Jalankan pada MySQL Community Server 8.4 LTS. Aman dijalankan ulang.
CREATE DATABASE IF NOT EXISTS praktikum2_sbd
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE praktikum_sbd;

-- Hapus anak sebelum induk agar relasi tidak menghalangi reset.
DROP TABLE IF EXISTS pendaftaran;
DROP TABLE IF EXISTS mata_kuliah;
DROP TABLE IF EXISTS mahasiswa;

CREATE TABLE mahasiswa (
  mahasiswa_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  npm CHAR(10) NOT NULL,
  nama VARCHAR(120) NOT NULL,
  email VARCHAR(160),
  angkatan YEAR NOT NULL,
  status_aktif BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT pk_mahasiswa PRIMARY KEY (mahasiswa_id),
  CONSTRAINT uq_mahasiswa_npm UNIQUE (npm),
  CONSTRAINT uq_mahasiswa_email UNIQUE (email),
  CONSTRAINT chk_mahasiswa_angkatan CHECK (angkatan BETWEEN 2020 AND 2035)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE mata_kuliah (
  mata_kuliah_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  kode_mk CHAR(8) NOT NULL,
  nama_mk VARCHAR(120) NOT NULL,
  sks TINYINT UNSIGNED NOT NULL,
  CONSTRAINT pk_mata_kuliah PRIMARY KEY (mata_kuliah_id),
  CONSTRAINT uq_mata_kuliah_kode UNIQUE (kode_mk),
  CONSTRAINT chk_mata_kuliah_sks CHECK (sks BETWEEN 1 AND 6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pendaftaran (
  pendaftaran_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  mahasiswa_id BIGINT UNSIGNED NOT NULL,
  mata_kuliah_id INT UNSIGNED NOT NULL,
  semester TINYINT UNSIGNED NOT NULL,
  tanggal_daftar DATE NOT NULL,
  CONSTRAINT pk_pendaftaran PRIMARY KEY (pendaftaran_id),
  CONSTRAINT uq_pendaftaran_peserta UNIQUE (mahasiswa_id, mata_kuliah_id, semester),
  CONSTRAINT fk_pendaftaran_mahasiswa FOREIGN KEY (mahasiswa_id)
    REFERENCES mahasiswa (mahasiswa_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_pendaftaran_mata_kuliah FOREIGN KEY (mata_kuliah_id)
    REFERENCES mata_kuliah (mata_kuliah_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT chk_pendaftaran_semester CHECK (semester BETWEEN 1 AND 8)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO mahasiswa (npm, nama, email, angkatan) VALUES
  ('2460301001', 'Alya Putri', 'alya@example.test', 2024),
  ('2460301002', 'Bima Saputra', NULL, 2024),
  ('2460301003', 'Citra Lestari', 'citra@example.test', 2024);
INSERT INTO mata_kuliah (kode_mk, nama_mk, sks) VALUES
  ('PMI1320', 'Sistem Basis Data', 2),
  ('PMI1312', 'Pemrograman Web', 3);
INSERT INTO pendaftaran (mahasiswa_id, mata_kuliah_id, semester, tanggal_daftar) VALUES
  (1, 1, 3, '2026-08-24'), (2, 1, 3, '2026-08-24'), (3, 2, 3, '2026-08-25');

-- Checkpoint verifikasi: versi harus MySQL 8.4.x dan objek harus berjumlah 3/2/3.
SELECT VERSION() AS versi_mysql, DATABASE() AS basis_data_aktif;
SELECT COUNT(*) AS jumlah_mahasiswa FROM mahasiswa;
SELECT COUNT(*) AS jumlah_mata_kuliah FROM mata_kuliah;
SELECT COUNT(*) AS jumlah_pendaftaran FROM pendaftaran;
SHOW CREATE TABLE mahasiswa;
SHOW CREATE TABLE mata_kuliah;
SHOW CREATE TABLE pendaftaran;
SELECT table_name, engine, table_collation
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('mahasiswa', 'mata_kuliah', 'pendaftaran');
SELECT table_name, constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE constraint_schema = DATABASE()
  AND table_name IN ('mahasiswa', 'mata_kuliah', 'pendaftaran')
ORDER BY table_name, constraint_type, constraint_name;
