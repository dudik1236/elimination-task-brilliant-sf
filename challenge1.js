// Data awal inventaris
const inventarisGudangAwal = [
  { id: "B001", nama: "Buku Tulis", stok: 150, harga: 5000 },
  { id: "P002", nama: "Pulpen Gel", stok: 200, harga: 3000 },
  { id: "B003", nama: "Buku Gambar", stok: 80, harga: 8000 },
  { id: "P004", nama: "Pensil Warna", stok: 120, harga: 12000 }
];

// Objek manajemen inventaris
const manajemenInventaris = {
  data: [...inventarisGudangAwal], // Salin data awal (immutable terhadap aslinya)

  /**
   * Menambahkan barang baru ke inventaris
   * @param {Object} barangBaru - { id: string, nama: string, stok: number, harga: number }
   * @throws {Error} Jika properti tidak valid atau ID duplikat
   */
  tambahBarang(barangBaru) {
    const { id, nama, stok, harga } = barangBaru;

    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error("ID harus berupa string tidak kosong.");
    }
    if (typeof nama !== 'string' || nama.trim() === '') {
      throw new Error("Nama harus berupa string tidak kosong.");
    }
    if (typeof stok !== 'number' || !Number.isInteger(stok) || stok < 0) {
      throw new Error("Stok harus berupa bilangan bulat non-negatif.");
    }
    if (typeof harga !== 'number' || harga < 0) {
      throw new Error("Harga harus berupa angka non-negatif.");
    }

    const sudahAda = this.data.find(item => item.id === id);
    if (sudahAda) {
      throw new Error(`ID barang "${id}" sudah ada di inventaris.`);
    }

    this.data.push({ id, nama, stok, harga });
  },

  /**
   * Memperbarui stok barang berdasarkan ID
   * @param {string} id - ID barang
   * @param {number} perubahan - jumlah perubahan (relatif) atau nilai baru (jika absolute: true)
   * @param {Object} [options] - opsi tambahan
   * @param {boolean} [options.absolute=false] - jika true, stok di-set ke nilai perubahan
   * @throws {Error} Jika ID tidak ditemukan atau stok negatif
   */
  updateStok(id, perubahan, options = {}) {
    if (typeof id !== 'string') {
      throw new Error("ID harus berupa string.");
    }

    const { absolute = false } = options;
    const barang = this.data.find(item => item.id === id);

    if (!barang) {
      throw new Error(`Barang dengan ID "${id}" tidak ditemukan.`);
    }

    if (typeof perubahan !== 'number') {
      throw new Error("Perubahan stok harus berupa angka.");
    }

    if (absolute) {
      if (!Number.isInteger(perubahan) || perubahan < 0) {
        throw new Error("Stok absolut harus berupa bilangan bulat non-negatif.");
      }
      barang.stok = perubahan;
    } else {
      const stokBaru = barang.stok + perubahan;
      if (!Number.isInteger(stokBaru) || stokBaru < 0) {
        throw new Error(`Stok tidak boleh negatif. Stok saat ini: ${barang.stok}, perubahan: ${perubahan}.`);
      }
      barang.stok = stokBaru;
    }
  },

  /**
   * Mencari barang berdasarkan ID
   * @param {string} id - ID barang
   * @returns {Object} Salinan barang
   * @throws {Error} Jika ID tidak ditemukan
   */
  cariBarang(id) {
    if (typeof id !== 'string') {
      throw new Error("ID harus berupa string.");
    }

    const barang = this.data.find(item => item.id === id);
    if (!barang) {
      throw new Error(`Barang dengan ID "${id}" tidak ditemukan.`);
    }
    return { ...barang };
  },

  /**
   * Menghitung total nilai inventaris (stok × harga, lalu jumlahkan)
   * @returns {number} Total nilai dalam rupiah
   */
  totalNilaiInventaris() {
    return this.data.reduce((total, barang) => total + barang.stok * barang.harga, 0);
  },

  /**
   * Menampilkan daftar inventaris dengan nomor urut (1-based) — user-friendly
   */
  tampilkanDaftar() {
    console.log("📦 Daftar Inventaris Gudang:");
    if (this.data.length === 0) {
      console.log("  - Kosong");
      return;
    }
    this.data.forEach((barang, index) => {
      const no = index + 1;
      console.log(`${no}. [${barang.id}] ${barang.nama} — Stok: ${barang.stok}, Harga: Rp${barang.harga.toLocaleString("id-ID")}`);
    });
  },

  /**
   * Menampilkan daftar inventaris dengan index array (0-based) — untuk debugging
   */
  tampilkanDaftarDenganIndex() {
    console.log("📋 Daftar Inventaris (index array 0-based):");
    if (this.data.length === 0) {
      console.log("  - Kosong");
      return;
    }
    this.data.forEach((barang, index) => {
      console.log(`[${index}] ID: ${barang.id} | Nama: ${barang.nama} | Stok: ${barang.stok} | Harga: Rp${barang.harga.toLocaleString("id-ID")}`);
    });
  },

  /**
   * Menampilkan daftar inventaris dalam bentuk tabel rapi menggunakan console.table()
   */
  tampilkanTabel() {
    if (this.data.length === 0) {
      console.log("📦 Inventaris kosong.");
      return;
    }

    const dataDenganNomor = this.data.map((barang, index) => ({
      No: index + 1,
      ID: barang.id,
      Nama: barang.nama,
      Stok: barang.stok,
      Harga: `Rp${barang.harga.toLocaleString("id-ID")}`
    }));

    console.log("\n📦 Daftar Inventaris (Tabel Rapi):");
    console.table(dataDenganNomor);
  },

  // ✅ METODE BARU: URUTKAN DARI HARGA TERTINGGI
  /**
   * Mengembalikan salinan daftar inventaris, diurutkan dari HARGA TERTINGGI ke TERENDAH
   * @returns {Array} Daftar barang terurut (tidak memengaruhi data asli)
   */
  dapatkanDaftarTermahal() {
    return [...this.data].sort((a, b) => b.harga - a.harga);
  },

  /**
   * Menampilkan daftar inventaris dari HARGA TERTINGGI ke TERENDAH dalam bentuk tabel
   */
  tampilkanTermahal() {
    if (this.data.length === 0) {
      console.log("📦 Inventaris kosong.");
      return;
    }

    const daftar = this.dapatkanDaftarTermahal();
    const dataDenganNomor = daftar.map((barang, index) => ({
      No: index + 1,
      ID: barang.id,
      Nama: barang.nama,
      Stok: barang.stok,
      Harga: `Rp${barang.harga.toLocaleString("id-ID")}`
    }));

    console.log("\n🔝 Daftar Inventaris — Termahal ke Termurah:");
    console.table(dataDenganNomor);
  }
};

// ✅ TESTING OTOMATIS
if (typeof require !== 'undefined' && require.main === module) {
  console.log("🚀 Memulai uji coba sistem inventaris Logistik Hebat...\n");

  try {
    // 1. Tampilkan daftar awal (tabel)
    manajemenInventaris.tampilkanTabel();

    // 2. Cari barang
    const buku = manajemenInventaris.cariBarang("B001");
    console.log("\n✅ cariBarang('B001') →", buku);

    // 3. Update stok
    manajemenInventaris.updateStok("B001", -20);
    console.log("✅ updateStok('B001', -20) → Stok baru:", manajemenInventaris.cariBarang("B001").stok);

    // 4. Tambah barang baru
    manajemenInventaris.tambahBarang({
      id: "L005",
      nama: "Laptop",
      stok: 3,
      harga: 15000000
    });
    console.log("✅ tambahBarang(Laptop) →", manajemenInventaris.cariBarang("L005"));

    // 5. Hitung total nilai
    const total = manajemenInventaris.totalNilaiInventaris();
    console.log("✅ totalNilaiInventaris() → Rp", total.toLocaleString("id-ID"));

    // 6. Tampilkan daftar akhir
    console.log("\n" + "=".repeat(50));
    console.log("🎯 Hasil Akhir:");
    manajemenInventaris.tampilkanTabel();

    // 7. Coba error (ID duplikat)
    try {
      manajemenInventaris.tambahBarang({ id: "L005", nama: "Duplikat", stok: 1, harga: 1 });
    } catch (e) {
      console.log("\n✅ Error terdeteksi (ID duplikat):", e.message);
    }

    // 8. ✅ TAMPILKAN DAFTAR TERMahal
    console.log("\n" + "=".repeat(50));
    manajemenInventaris.tampilkanTermahal();

  } catch (error) {
    console.error("\n❌ Terjadi kesalahan:", error.message);
    process?.exit?.(1);
  }
}

// Eksport untuk modul Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { manajemenInventaris, inventarisGudangAwal };
}
