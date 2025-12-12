1. Buat Tabel (DDL)
-- Tabel motor
CREATE TABLE motor (
    motor_id INT PRIMARY KEY AUTO_INCREMENT,
    nama_motor VARCHAR(100) NOT NULL,
    tarif_harian DECIMAL(10,2) NOT NULL CHECK (tarif_harian > 0),
    jenis VARCHAR(20) DEFAULT 'Matic',
    status_motor ENUM('Tersedia', 'Disewa') DEFAULT 'Tersedia'
);

-- Tabel sewa
CREATE TABLE sewa (
    sewa_id INT PRIMARY KEY AUTO_INCREMENT,
    motor_id INT NOT NULL,
    nama_penyewa VARCHAR(100) NOT NULL,
    lama_hari INT DEFAULT 1 CHECK (lama_hari > 0),
    tanggal_sewa DATE DEFAULT (CURDATE()),
    FOREIGN KEY (motor_id) REFERENCES motor(motor_id)
);
2. Isi Data (DML)

INSERT INTO motor (nama_motor, tarif_harian, jenis) VALUES
('Yamaha NMAX', 65000, 'Matic'),
('Honda CB150R', 85000, 'Sport'),
('Suzuki Satria F150', 70000, 'Manual');

INSERT INTO sewa (motor_id, nama_penyewa, lama_hari, tanggal_sewa) VALUES
(1, 'Budi Santoso', 2, '2025-12-10'),
(2, 'Siti Rahayu', 1, '2025-12-11'),
(1, 'Agus Firmansyah', 3, '2025-12-12'),   -- Hari ini
(3, 'Dewi Lestari', 2, '2025-12-12');     -- Hari ini

3. Modifikasi Tabel

ALTER TABLE motor 
ADD COLUMN nomor_plat VARCHAR(15);

UPDATE motor SET nomor_plat = 'B 1234 ABC' WHERE motor_id = 1;
UPDATE motor SET nomor_plat = 'D 5678 DEF' WHERE motor_id = 2;
-- Biarkan motor_id = 3 tanpa nomor_plat (NULL)
SELECT * FROM motor WHERE tarif_harian < 50000.00;
