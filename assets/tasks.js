window.P03_TASKS = [
  {
    id: "P03-T01",
    topic: "CREATE TABLE + tipe data",
    title: "Membentuk tabel dan memilih domain data",
    anchors: ["teori-create-table", "teori-tipe-data"],
    example: {
      table: "ruang_kelas",
      scenario: "Unit sarana mencatat identitas ruang, kode tetap, kapasitas bilangan kecil, dan tanggal pemeriksaan.",
      sql: "CREATE TABLE ruang_kelas (\n  ruang_id INT UNSIGNED NOT NULL,\n  kode_ruang CHAR(8) NOT NULL,\n  kapasitas SMALLINT UNSIGNED NOT NULL,\n  diperiksa_pada DATE NOT NULL,\n  CONSTRAINT pk_ruang_kelas PRIMARY KEY (ruang_id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      dissection: ["CREATE TABLE mendirikan satu entitas ruang_kelas.", "CHAR, SMALLINT, dan DATE dipilih dari domain nilai, bukan tampilannya.", "InnoDB dan utf8mb4 ditulis eksplisit agar hasil server dapat diperiksa."],
      checks: [{type:"valid",label:"Sintaks contoh dikenali"},{type:"column",value:"ruang_id",label:"Identitas ruang tersedia"},{type:"type",column:"diperiksa_pada",value:"DATE",label:"Tanggal memakai DATE"},{type:"engine",value:"InnoDB",label:"Mesin InnoDB"},{type:"charset",value:"utf8mb4",label:"Set karakter utf8mb4"}]
    },
    stimulus: {
      table: "inventaris_lab",
      prompt: "Perbaiki tipe tanggal_beli dan harga, tambahkan inventaris_id sebagai identitas, lalu pertahankan InnoDB dan utf8mb4.",
      starterSql: "CREATE TABLE inventaris_lab (\n  tanggal_beli VARCHAR(20) NOT NULL,\n  harga FLOAT NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      checks: [{type:"valid",label:"Sintaks CREATE TABLE valid"},{type:"column",value:"inventaris_id",label:"Kolom inventaris_id tersedia"},{type:"type",column:"tanggal_beli",value:"DATE",label:"tanggal_beli bertipe DATE"},{type:"type",column:"harga",value:"DECIMAL",label:"harga bertipe DECIMAL"},{type:"feature",value:"PRIMARY KEY",label:"Identitas menjadi PRIMARY KEY"},{type:"engine",value:"InnoDB",label:"Mesin InnoDB"},{type:"charset",value:"utf8mb4",label:"Set karakter utf8mb4"}]
    },
    live: {
      table: "gedung",
      prompt: "Di phpMyAdmin, buat tabel gedung untuk identitas numerik, kode tetap, nama bervariasi, jumlah lantai nonnegatif, dan tanggal mulai digunakan.",
      goal: "Tabel tercipta pada MySQL 8.4 dengan tipe sesuai domain, InnoDB, dan utf8mb4.",
      verification: "Jalankan SHOW CREATE TABLE gedung; dan DESCRIBE gedung;.",
      checkpoint: "Rekam versi server, hasil Structure, dan alasan pemilihan setiap tipe.",
      placeholder: "Tulis SQL buatan Anda untuk tabel gedung. Solusi tidak disediakan oleh modul."
    }
  },
  {
    id: "P03-T02",
    topic: "PRIMARY KEY",
    title: "Menetapkan identitas baris yang stabil",
    anchors: ["teori-primary-key"],
    example: {
      table: "program_studi",
      scenario: "Setiap program studi memerlukan identitas internal yang tidak berubah ketika nama diperbarui.",
      sql: "CREATE TABLE program_studi (\n  prodi_id SMALLINT UNSIGNED NOT NULL,\n  kode_prodi CHAR(5) NOT NULL,\n  nama VARCHAR(100) NOT NULL,\n  CONSTRAINT pk_program_studi PRIMARY KEY (prodi_id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      dissection: ["prodi_id menjadi identitas utama, bukan nama yang bisa berubah.", "PRIMARY KEY otomatis unik dan tidak menerima NULL.", "Nama pk_program_studi memudahkan pembacaan SHOW CREATE TABLE."],
      checks: [{type:"valid",label:"Sintaks contoh dikenali"},{type:"feature",value:"PRIMARY KEY",label:"PRIMARY KEY tersedia"},{type:"contains",value:"PRIMARY\\s+KEY\\s*\\(prodi_id\\)",label:"prodi_id menjadi kunci utama"}]
    },
    stimulus: {
      table: "dosen",
      prompt: "Pindahkan PRIMARY KEY dari nama ke dosen_id, gunakan tipe unsigned, dan beri nama constraint pk_dosen.",
      starterSql: "CREATE TABLE dosen (\n  dosen_id INT NOT NULL,\n  nama VARCHAR(120) NOT NULL,\n  PRIMARY KEY (nama)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      checks: [{type:"valid",label:"Sintaks CREATE TABLE valid"},{type:"feature",value:"PRIMARY KEY",label:"PRIMARY KEY tersedia"},{type:"contains",value:"CONSTRAINT\\s+pk_dosen",label:"Constraint bernama pk_dosen"},{type:"contains",value:"PRIMARY\\s+KEY\\s*\\(dosen_id\\)",label:"dosen_id adalah kunci utama"},{type:"contains",value:"dosen_id\\s+INT\\s+UNSIGNED",label:"dosen_id bertipe INT UNSIGNED"}]
    },
    live: {
      table: "semester_aktif",
      prompt: "Di MySQL, buat tabel semester_aktif dengan kunci komposit tahun_ajaran dan periode, serta satu tanggal mulai.",
      goal: "Kombinasi dua kolom menjadi satu PRIMARY KEY dan duplikasi pasangan ditolak.",
      verification: "Jalankan SHOW CREATE TABLE semester_aktif; lalu uji dua baris dengan pasangan kunci yang sama.",
      checkpoint: "Simpan DDL, satu INSERT sah, dan pesan penolakan duplikat.",
      placeholder: "Tulis SQL buatan Anda untuk kunci komposit semester_aktif."
    }
  },
  {
    id: "P03-T03",
    topic: "FOREIGN KEY",
    title: "Menjaga relasi tabel induk dan anak",
    anchors: ["teori-foreign-key"],
    example: {
      table: "anggota_kelas",
      scenario: "Anggota kelas harus menunjuk kelas yang telah tersedia sebagai induk.",
      sql: "CREATE TABLE anggota_kelas (\n  anggota_id BIGINT UNSIGNED NOT NULL,\n  kelas_id INT UNSIGNED NOT NULL,\n  nama VARCHAR(120) NOT NULL,\n  CONSTRAINT pk_anggota_kelas PRIMARY KEY (anggota_id),\n  CONSTRAINT fk_anggota_kelas FOREIGN KEY (kelas_id) REFERENCES kelas(kelas_id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      dissection: ["kelas dibuat lebih dahulu sebagai tabel induk.", "kelas_id pada kedua sisi harus kompatibel, termasuk UNSIGNED.", "FOREIGN KEY mencegah anggota menunjuk kelas yang tidak ada."],
      checks: [{type:"valid",label:"Sintaks contoh dikenali"},{type:"feature",value:"FOREIGN KEY",label:"FOREIGN KEY tersedia"},{type:"contains",value:"REFERENCES\\s+kelas\\s*\\(kelas_id\\)",label:"Referensi menuju kelas"}]
    },
    stimulus: {
      table: "detail_peminjaman",
      prompt: "Tambahkan kunci utama dan FOREIGN KEY bernama fk_detail_peminjaman yang menghubungkan peminjaman_id ke tabel induk peminjaman.",
      starterSql: "CREATE TABLE detail_peminjaman (\n  detail_id BIGINT UNSIGNED NOT NULL,\n  peminjaman_id BIGINT UNSIGNED NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      checks: [{type:"valid",label:"Sintaks CREATE TABLE valid"},{type:"feature",value:"PRIMARY KEY",label:"detail_id memiliki PRIMARY KEY"},{type:"feature",value:"FOREIGN KEY",label:"FOREIGN KEY tersedia"},{type:"contains",value:"CONSTRAINT\\s+fk_detail_peminjaman",label:"Nama constraint FK tepat"},{type:"contains",value:"FOREIGN\\s+KEY\\s*\\(peminjaman_id\\)",label:"Kolom anak tepat"},{type:"contains",value:"REFERENCES\\s+peminjaman\\s*\\(peminjaman_id\\)",label:"Target induk tepat"}]
    },
    live: {
      table: "peserta_kegiatan",
      prompt: "Buat tabel induk kegiatan, kemudian tabel anak peserta_kegiatan yang merujuk kegiatan_id dengan tipe yang kompatibel.",
      goal: "Relasi berhasil dibuat, baris anak sah diterima, dan referensi ke induk yang tidak ada ditolak.",
      verification: "Jalankan SHOW CREATE TABLE peserta_kegiatan; dan kueri information_schema.table_constraints untuk tabel itu.",
      checkpoint: "Rekam struktur induk-anak, INSERT sah, dan error referensi yatim.",
      placeholder: "Tulis sendiri DDL induk dan anak. Jangan tempel contoh karena kasusnya berbeda."
    }
  },
  {
    id: "P03-T04",
    topic: "UNIQUE + NOT NULL",
    title: "Menutup duplikasi dan nilai wajib",
    anchors: ["teori-unique", "teori-not-null"],
    example: {
      table: "akun_portal",
      scenario: "Portal membedakan identitas internal, email unik, nama pengguna unik, dan atribut wajib.",
      sql: "CREATE TABLE akun_portal (\n  akun_id BIGINT UNSIGNED NOT NULL,\n  nama_pengguna VARCHAR(40) NOT NULL,\n  email VARCHAR(160) NOT NULL,\n  CONSTRAINT pk_akun_portal PRIMARY KEY (akun_id),\n  CONSTRAINT uq_akun_email UNIQUE (email),\n  CONSTRAINT uq_akun_nama UNIQUE (nama_pengguna)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      dissection: ["PRIMARY KEY tetap menjadi identitas utama.", "UNIQUE mencegah kandidat kunci berulang.", "NOT NULL memastikan kandidat wajib diisi sehingga NULL tidak membuka celah duplikasi."],
      checks: [{type:"valid",label:"Sintaks contoh dikenali"},{type:"feature",value:"UNIQUE",label:"UNIQUE tersedia"},{type:"feature",value:"NOT NULL",label:"NOT NULL tersedia"}]
    },
    stimulus: {
      table: "akun_layanan",
      prompt: "Pastikan email dan nama_tampil wajib diisi; jadikan email unik dengan constraint uq_akun_layanan_email.",
      starterSql: "CREATE TABLE akun_layanan (\n  akun_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,\n  email VARCHAR(160),\n  nama_tampil VARCHAR(100)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      checks: [{type:"valid",label:"Sintaks CREATE TABLE valid"},{type:"feature",value:"UNIQUE",label:"Email memiliki UNIQUE"},{type:"contains",value:"CONSTRAINT\\s+uq_akun_layanan_email",label:"Nama constraint UNIQUE tepat"},{type:"contains",value:"email\\s+VARCHAR\\(160\\)\\s+NOT\\s+NULL",label:"Email wajib diisi"},{type:"contains",value:"nama_tampil\\s+VARCHAR\\(100\\)\\s+NOT\\s+NULL",label:"Nama tampil wajib diisi"}]
    },
    live: {
      table: "sertifikat",
      prompt: "Buat tabel sertifikat dengan identitas internal, nomor_sertifikat wajib dan unik, nama_penerima wajib, serta catatan opsional.",
      goal: "Nomor duplikat dan nilai wajib yang hilang ditolak, sedangkan catatan NULL diterima.",
      verification: "Jalankan SHOW CREATE TABLE sertifikat; lalu tiga INSERT: sah, nomor duplikat, dan nomor NULL.",
      checkpoint: "Rekam struktur serta dua pesan penolakan yang berbeda.",
      placeholder: "Tulis SQL buatan Anda untuk sertifikat dan pengujian batasnya."
    }
  },
  {
    id: "P03-T05",
    topic: "CHECK",
    title: "Membatasi domain dengan predikat",
    anchors: ["teori-check"],
    example: {
      table: "ruang_ujian",
      scenario: "Kapasitas ruang ujian hanya sah pada rentang operasional 1 sampai 80.",
      sql: "CREATE TABLE ruang_ujian (\n  ruang_ujian_id INT UNSIGNED NOT NULL,\n  kapasitas SMALLINT UNSIGNED NOT NULL,\n  CONSTRAINT pk_ruang_ujian PRIMARY KEY (ruang_ujian_id),\n  CONSTRAINT chk_ruang_kapasitas CHECK (kapasitas BETWEEN 1 AND 80)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      dissection: ["NOT NULL mencegah UNKNOWN akibat nilai yang hilang.", "BETWEEN memasukkan kedua nilai batas.", "Nama constraint menunjukkan kolom dan aturan yang dilindungi."],
      checks: [{type:"valid",label:"Sintaks contoh dikenali"},{type:"feature",value:"CHECK",label:"CHECK tersedia"},{type:"contains",value:"kapasitas\\s+BETWEEN\\s+1\\s+AND\\s+80",label:"Rentang kapasitas tepat"}]
    },
    stimulus: {
      table: "penilaian",
      prompt: "Tambahkan kunci utama dan CHECK bernama chk_penilaian_skor agar skor berada pada 0 sampai 100.",
      starterSql: "CREATE TABLE penilaian (\n  penilaian_id BIGINT UNSIGNED NOT NULL,\n  skor DECIMAL(5,2) NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
      checks: [{type:"valid",label:"Sintaks CREATE TABLE valid"},{type:"feature",value:"PRIMARY KEY",label:"Identitas memiliki PRIMARY KEY"},{type:"feature",value:"CHECK",label:"CHECK tersedia"},{type:"contains",value:"CONSTRAINT\\s+chk_penilaian_skor",label:"Nama CHECK tepat"},{type:"contains",value:"skor\\s+BETWEEN\\s+0\\s+AND\\s+100",label:"Rentang skor 0–100"}]
    },
    live: {
      table: "reservasi",
      prompt: "Buat tabel reservasi dengan jumlah_peserta 1–20 dan tanggal_selesai tidak lebih awal dari tanggal_mulai.",
      goal: "Nilai batas diterima dan dua jenis pelanggaran domain ditolak MySQL 8.4.",
      verification: "Jalankan SHOW CREATE TABLE reservasi; lalu INSERT pada batas 1 dan 20, jumlah 0, serta tanggal terbalik.",
      checkpoint: "Rekam dua baris sah dan dua pesan pelanggaran CHECK.",
      placeholder: "Tulis SQL buatan Anda untuk reservasi dengan dua aturan CHECK."
    }
  }
];
