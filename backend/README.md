# ⚙️ A.L.I.C.E. - Backend Service

Backend utama untuk aplikasi **A.L.I.C.E.** (_Artificial Intelligence for Literacy, Insight, and Cost Efficiency_). Berperan sebagai API Gateway yang menangani autentikasi pengguna, manajemen database, pengelolaan riwayat transaksi, dan penyuntikan data keuangan pengguna (_context_) ke AI Microservices.

![Express](https://img.shields.io/badge/Express-5.2.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-LTS-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pg-blue)

---

## 📖 Deskripsi

Proyek ini merupakan server backend tangguh berbasis Node.js dan Express. Fokus utamanya adalah menangani:
- **Autentikasi Pengguna** (JWT & Google OAuth2).
- **Manajemen Data** (CRUD Profil, Tujuan Keuangan, Transaksi).
- **Integrasi Microservice** (Menghubungkan frontend dengan _Chatbot AI_ dan _Predictive ML_).
- **Manajemen File** (Penyimpanan dan upload foto profil menggunakan Supabase Storage).

---

## 🚀 Fitur Utama

- **Authentication & Security:** JWT-based Auth, Google Auth Library, Bcrypt Password Hashing.
- **Database & Migrations:** Menggunakan driver `pg` untuk PostgreSQL dengan `node-pg-migrate` untuk manajemen skema secara terstruktur.
- **Validation:** Validasi payload (request body/query) menggunakan `Joi`.
- **API Documentation:** Terintegrasi langsung dengan Swagger UI di endpoint `/docs`.
- **Automated API Testing:** Menggunakan Newman dan Postman Collection yang dapat dieksekusi langsung di CLI.

---

## 🏗️ Struktur Proyek

Proyek ini menggunakan struktur modular (_Controller-Service-Route_) untuk kemudahan skalabilitas:
```text
backend/
├── migrations/         # File-file migrasi skema database (node-pg-migrate)
├── scripts/            # Script kustom untuk seeding dan manajemen DB
├── src/
│   ├── exceptions/     # Kelas error kustom (InvariantError, NotFoundError, dll)
│   ├── middlewares/    # Middleware Express (Auth JWT, Error Handler, Multer)
│   ├── routes/         # Router index utama
│   ├── server/         # Konfigurasi instansiasi server Express
│   ├── services/       # Modul domain (Users, Auth, Transactions, dll)
│   │   └── <nama_modul>/
│   │       ├── controllers/  # Menangani Request/Response
│   │       ├── routes/       # Definisi endpoint spesifik modul
│   │       └── (service logic biasanya digabungkan di controller/class service)
│   └── utils/          # Fungsi pembantu (TokenManager, ResponseFormatter)
├── test/               # File konfigurasi Postman/Newman
└── server.js           # Entry point utama aplikasi
```

---

## 💻 Cara Menjalankan (Instalasi & Setup)

Pastikan [Node.js](https://nodejs.org) dan PostgreSQL sudah terpasang di komputer Anda.

1. **Clone & Install Dependensi:**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment (.env):**
   Buat file `.env` (bisa di-copy dari `.env.example`) dan atur nilai yang dibutuhkan:
   - Kredensial PostgreSQL (`PGUSER`, `PGPASSWORD`, `PGDATABASE`, dll)
   - Secret Key JWT (`ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`)
   - Google Client ID
   - Kredensial Supabase
   - URL dari _Microservices_ lain (`AI_URL`, `ALICE_CHAT_URL`)

3. **Database Migration:**
   Jalankan perintah berikut untuk membuat semua tabel yang dibutuhkan di database PostgreSQL Anda:
   ```bash
   npm run migrate
   ```
   *(Opsional)* Anda dapat menjalankan seeding untuk memasukkan data awal dummy:
   ```bash
   npm run server:generate-seed
   ```

4. **Jalankan Server (Development):**
   ```bash
   npm run start:dev
   ```
   Server akan berjalan secara default di `http://localhost:3000`.

---

## 📜 Skrip NPM yang Tersedia

| Perintah                     | Deskripsi                                             |
| ---------------------------- | ----------------------------------------------------- |
| `npm run start:dev`          | Menjalankan server menggunakan nodemon (development). |
| `npm start`                  | Menjalankan server tanpa nodemon (production).        |
| `npm run migrate`            | Eksekusi migrasi tabel baru ke database (up).         |
| `npm run migrate:down`       | Rollback/undo migrasi terakhir (down).                |
| `npm run migrate:fresh`      | Reset database secara keseluruhan dan jalankan semua migrasi ulang. |
| `npm run server:generate-seed` | Memasukkan data awal dummy (seeding) ke database.   |
| `npm run lint` / `lint:fix`  | Memeriksa / memperbaiki standar gaya kode via ESLint. |
| `npm run format`             | Memformat kode menggunakan Prettier.                  |
| `npm run test:api`           | Menjalankan pengujian endpoint menggunakan Newman.    |

---

## 🔗 Dokumentasi API Khusus

Dokumentasi lengkap dan interaktif dapat langsung diakses melalui peramban (browser) saat server Anda berjalan di alamat berikut:
- **`GET /docs`** -> Membuka antarmuka interaktif **Swagger UI**.