#  Backend API Development — To-Do List

## Tahap 1: Setup & Fondasi Database

✔ [ ] Membuat Migration / Schema Database untuk tabel `users`, `categories`, `settings`, dan `transactions` @done(26-05-07 21:35)
✔ [ ] Membuat Seeder untuk tabel `categories` dengan 7 kategori baku: `Bills`, `Entertainment`, `Food`, `Hobby`, `Investment`, `Shopping`, `Transport` @done(26-05-07 21:35)

## Tahap 2: Autentikasi & Manajemen Pengguna {due:2026-05-07}

✔ [ ] `POST /users` — Registrasi user baru @done(26-05-07 21:35)
✔ [ ] `POST /authentications` — Login & generate Access Token @done(26-05-07 21:35)
✔ [ ] `PUT /authentications` — Pembaruan Access Token @done(26-05-07 21:35)
✔ [ ] `DELETE /authentications` — Logout & pencabutan token @done(26-05-07 21:35)
✔ [ ] `GET /users` — Menampilkan daftar user @done(26-05-07 21:35)
✔ [ ] `GET /users/:id` — Menampilkan detail profil spesifik @done(26-05-07 21:35)
✔ [ ] Membuat Middleware Autentikasi untuk memblokir akses tanpa token valid @done(26-05-07 21:36)

## Tahap 3: Master Data & Pengaturan Awal {due:2026-05-08}

✔ [ ] `GET /categories` — Endpoint 7 kategori baku (dengan middleware auth) @done(26-05-09 00:35)
✔ [ ] `PUT /settings` — Inisialisasi / update profil finansial user (`monthlyIncome` & `weeklyBudget`) @done(26-05-09 00:35)
✔ [ ] `GET /settings` — Menarik pengaturan saat ini untuk frontend @done(26-05-09 00:35)

## Tahap 4: Core Feature (Transaksi) {due:2026-05-09}

✔ [ ] `POST /transactions` — Memasukkan data pengeluaran/pemasukan baru @done(26-05-09 00:36)
✔ [ ] `GET /transactions?month=MM&year=YYYY` — Riwayat transaksi dengan filter bulan & tahun @done(26-05-09 00:37)
✔ [ ] `GET /transactions/:id` — Detail satu transaksi spesifik @done(26-05-09 00:37)
✔ [ ] `PUT /transactions/:id` — Mengubah detail transaksi @done(26-05-09 00:37)
✔ [ ] `DELETE /transactions/:id` — Menghapus transaksi @done(26-05-09 00:37)
Note: Tambahkan Filter nama title, dokumentasi blum dibuat, testing belum dilakukan
(F) ## Tahap 5: Integrasi AI (A.L.I.C.E) {due:2026-05-10}

✔ [ ] `POST /transactions/analyze-risk` — Ambil `weeklyBudget`, kirim ke Model C-2 (Predict Risk) @done(26-05-20 18:42)
✔ [ ] `POST /users/me/segmentation` — Hitung agregasi statistik, kirim ke Model C-1 (Segment User), simpan ke tabel `users` @done(26-05-20 18:42)
✔ [ ] `GET /analytics/budget-optimization` — Hitung persentase 7 kategori, kirim ke Model B @done(26-05-12 18:22)
✔ [ ] `GET /analytics/balance-forecast` — Tarik 30 hari transaksi, kirim ke Model A untuk prediksi 10 hari ke depan @done(26-05-12 18:23)

## Tahap 6: Finalisasi & Testing

✔ [ ] Testing seluruh route menggunakan Postman / Insomnia / Swagger @done(26-05-20 18:42)
✔ [ ] Error Handling — Pastikan error dari FastAPI ditangkap & dikembalikan ke frontend dengan format ramah @done(26-05-20 18:42)
- [ ] Dokumentasi — Pembaruan jika ada perubahan struktur response