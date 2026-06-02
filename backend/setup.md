# 🛠️ Panduan Setup Backend A.L.I.C.E.

Panduan ini berisi langkah-langkah detail untuk menyiapkan *environment* backend di komputer lokal Anda, dimulai dari konfigurasi database PostgreSQL hingga menjalankan server.

---

## 1. Setup Database PostgreSQL

Jika Anda belum memiliki database lokal, ikuti langkah berikut untuk membuat database beserta *user role* khususnya.

**A. Masuk ke PostgreSQL sebagai Super User (Postgres):**
```bash
psql -U postgres
```

**B. Buat Database untuk A.L.I.C.E:**
```sql
CREATE DATABASE alice_db;
```

**C. Buat User (Role) Khusus:**
```sql
CREATE USER alice_user WITH PASSWORD 'password_rahasia';
```

**D. Berikan Akses ke User:**
```sql
GRANT ALL PRIVILEGES ON DATABASE alice_db TO alice_user;
\c alice_db
GRANT ALL ON SCHEMA public TO alice_user;
```

**E. Keluar dan Uji Coba Login:**
Keluar dengan mengetik `\q`, kemudian coba masuk menggunakan user baru:
```bash
psql -U alice_user -d alice_db -h localhost
```
Jika berhasil masuk, berarti database sudah siap.

---

## 2. Konfigurasi File `.env`

Buat file `.env` di direktori `backend` dengan menyalin template dari `.env.example`:
```bash
cp .env.example .env
```

Buka file `.env` dan lengkapi *environment variables* yang dibutuhkan:

```env
# Server
HOST=localhost
PORT=3000

# Database (Sesuaikan dengan langkah 1)
PGUSER=alice_user
PGPASSWORD=password_rahasia
PGDATABASE=alice_db
PGHOST=localhost
PGPORT=5432

# Security (Gunakan string acak/secret untuk keamanan JWT)
ACCESS_TOKEN_KEY=masukkan_secret_access_token_di_sini
REFRESH_TOKEN_KEY=masukkan_secret_refresh_token_di_sini

# Google Auth
GOOGLE_CLIENT_ID=client_id_google_console_anda

# Microservices URLs
APP_URL=http://localhost:5173
AI_URL=http://localhost:10000
ALICE_CHAT_URL=http://localhost:8001

# Supabase Storage (Untuk upload image/file)
SUPABASE_URL=url_project_supabase_anda
SUPABASE_SERVICE_ROLE_KEY=service_role_key_supabase_anda
```

> **Catatan Penting:** File `.env` berisi data sensitif. Jangan pernah men-commit file ini ke Git.

---

## 3. Jalankan Migrasi & Seeding

Setelah database dan `.env` terkonfigurasi, Anda perlu membuat struktur tabel-tabel A.L.I.C.E ke dalam database PostgreSQL.

1. **Instal dependensi NPM (jika belum):**
   ```bash
   npm install
   ```

2. **Jalankan Migrasi Database:**
   Perintah ini akan membaca file di folder `migrations/` dan membuat tabel-tabel di database secara otomatis:
   ```bash
   npm run migrate
   ```

3. **(Opsional) Jalankan Seeding Data:**
   Untuk keperluan pengujian/development, Anda bisa mengisi database dengan data dummy awal (seperti kategori transaksi):
   ```bash
   npm run server:generate-seed
   ```

---

## 4. Jalankan Server

Terakhir, jalankan backend Node.js pada mode _development_:

```bash
npm run start:dev
```

Jika muncul pesan *Server berjalan di http://localhost:3000*, berarti setup Anda telah selesai dan berhasil! Anda bisa mengakses dokumentasi API di `http://localhost:3000/docs`.