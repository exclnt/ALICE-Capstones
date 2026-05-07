# API Documentation

## Users API

- `GET /users`
  - Mengambil semua users.

- `GET /users/:id`
  - Mengambil detail user berdasarkan ID.

- `POST /users`
  - Membuat user baru.

---

## Authentication API

- `POST /authentications`
  - Login user dan menghasilkan access token.

- `PUT /authentications`
  - Memperbarui access token.

- `DELETE /authentications`
  - Logout user.

---

## ALICE Route API

- `GET /analytics/balance-forecast`
  - Menyediakan data prediksi saldo 10 hari ke depan.

- `GET /analytics/budget-optimization`
  - Mengambil rekomendasi persentase anggaran bulanan atau mingguan yang ideal.

- `POST /users/me/segmentation`
  - Memperbarui label profil risiko atau segmentasi finansial user yang sedang login.

- `POST /transactions/analyze-risk`
  - Mengecek tingkat risiko berdasarkan nominal dan kategori transaksi yang dimasukkan user.

---

## Transactions API

- `GET /transactions?month=05&year=2026`
  - Mengambil daftar riwayat transaksi berdasarkan bulan dan tahun.

- `POST /transactions`
  - Menyimpan data transaksi baru ke database.

- `GET /transactions/:id`
  - Mengambil detail satu transaksi spesifik.

- `PUT /transactions/:id`
  - Mengubah data transaksi.

- `DELETE /transactions/:id`
  - Menghapus data transaksi.

---

## Settings API

- `GET /settings`
  - Mengambil data profil dan pengaturan keuangan user.

- `PUT /settings`
  - Memperbarui pengaturan keuangan user.

---

## Categories API

- `GET /categories`
  - Mengambil daftar 7 kategori baku.