# P03 — Tabel, Tipe Data, Kunci, dan Constraint

Paket praktikum statis untuk PMI 1320 Sistem Basis Data, Semester 3, Pertemuan 3. Buka `index.html` langsung melalui `file://`; tidak ada pemasangan paket, server web, CDN, font daring, atau koneksi jaringan saat modul dipakai.

## Platform otoritatif

Verifikasi akhir wajib memakai **MySQL Community Server 8.4 LTS**, dengan Laragon sebagai jalur utama atau WampServer sebagai alternatif, serta phpMyAdmin sebagai client. Pemeriksa stimulus di browser sengaja hanya mengenali subset `CREATE TABLE` dan constraint. Pemeriksa itu tidak menjalankan DDL dan tidak menggantikan server asli.

Sumber PU-2: https://dev.mysql.com/doc/refman/8.4/en/sql-data-definition-statements.html

## RPS minggu 3

- Sub-2: "Merancang dan mengimplementasikan skema relasional menggunakan tabel, kunci, relasi, tipe data, dan constraint."
- CPMK-2: "Mengimplementasikan skema basis data dan query SQL untuk kebutuhan sistem informasi."
- Indikator: "Membuat tabel, tipe data, kunci, dan constraint; minimal 70% kasus uji lulus."
- Materi: "CREATE TABLE; tipe data; PRIMARY KEY; FOREIGN KEY; UNIQUE; NOT NULL; CHECK."
- Metode: "Demonstrasi; praktikum pembuatan skema; pengujian constraint."
- Durasi: "T: 1×50 menit; P: 1×170 menit; PT+KM: 1×60 menit"
- Asesmen: "Praktikum skema dan constraint", bobot 5%, sumber PU-2.

## Penggunaan

1. Pastikan hasil pemeriksaan versi menunjukkan MySQL Community Server 8.4 LTS.
2. Impor `setup_week3.sql` melalui menu Import atau SQL di phpMyAdmin. Skrip membuat ulang tabel latihan secara idempoten.
3. Baca Persiapan dan seluruh Teori, lalu kerjakan lima tugas berurutan yang mencakup tujuh subtopik RPS.
4. Pada tiap tugas, periksa contoh yang dibedah, perbaiki stimulus hingga semua kasus uji lulus, lalu tulis dan jalankan SQL Anda sendiri di MySQL.
5. Isi refleksi dan unggah satu sampai lima gambar bukti. Data tersimpan hanya di localStorage browser tersebut.
6. Buka Rekap, isi identitas laporan, lalu cetak atau simpan sebagai PDF A4.

## Pengujian pengembang

Jalankan dari folder ini:

```bash
node --check assets/ddl-engine.js
node --check assets/tasks.js
node --check assets/app.js
node --test tests/*.test.js
```

Semua pengujian memakai modul bawaan Node.js dan berjalan offline.

## Batasan

Pemeriksa browser tidak membangun tabel, tidak menyimpan baris, dan tidak menjamin kesetaraan penuh dengan parser MySQL. Ia hanya memberi umpan balik awal untuk bentuk `CREATE TABLE`, kolom, pilihan tipe umum, dan constraint minggu ini. Pesan keberhasilan lokal bukan bukti eksekusi. Screenshot phpMyAdmin, SQL live buatan mahasiswa, dan hasil server MySQL 8.4 tetap menjadi bukti resmi. Gambar disimpan sebagai data lokal; kuota browser dapat berbeda antar perangkat. Jangan unggah password atau data pribadi sensitif.
