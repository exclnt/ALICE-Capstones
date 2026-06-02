# 🛠️ Panduan Setup Frontend A.L.I.C.E.

Panduan ini akan membantu Anda mengonfigurasi dan menjalankan antarmuka pengguna (Frontend) A.L.I.C.E. di lingkungan lokal Anda. Frontend ini dibangun menggunakan **React 19, TypeScript, dan Vite**.

---

## 1. Prasyarat

Pastikan Anda telah menginstal **Node.js** (versi 20 LTS atau lebih baru disarankan) dan **npm** di komputer Anda.

---

## 2. Instalasi Dependensi

Buka terminal, pastikan Anda berada di direktori `frontend`, dan jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:

```bash
npm install
```

---

## 3. Konfigurasi Environment Variables

Frontend A.L.I.C.E. memerlukan koneksi ke layanan Backend dan AI Chatbot, serta Client ID dari Google untuk fitur login.

1. Buat file `.env` dengan menyalin template yang sudah disediakan:
   ```bash
   cp .env.example .env
   ```

2. Buka file `.env` tersebut dan sesuaikan isinya:
   ```env
   # URL dari server Backend utama (Node.js) yang berjalan di lokal
   VITE_API_BASE_URL=http://localhost:3000

   # URL dari microservice Chatbot AI (FastAPI) yang berjalan di lokal
   VITE_ALICE_API_BASE_URL=http://localhost:8001

   # Client ID dari Google Cloud Console untuk fitur Login with Google
   VITE_GOOGLE_CLIENT_ID=masukkan_google_client_id_anda_disini
   ```

> **Catatan:** Variabel di Vite wajib diawali dengan prefix `VITE_` agar bisa diakses oleh aplikasi React di browser.

---

## 4. Menjalankan Development Server

Setelah dependensi terinstal dan `.env` disesuaikan, jalankan aplikasi pada mode *development* dengan perintah:

```bash
npm run dev
```

Aplikasi biasanya akan terbuka di `http://localhost:5173`. Perubahan kode yang Anda lakukan akan langsung memicu _Hot Module Replacement_ (HMR) secara otomatis.

Jika Anda ingin menjalankan server agar dapat diakses dari perangkat lain di jaringan lokal yang sama (misalnya untuk testing di HP), gunakan:
```bash
npm run dev-host
```

---

## 5. Build untuk Production (Opsional)

Jika Anda ingin melakukan pengujian performa akhir atau bersiap melakukan *deployment*, Anda dapat mem-build project dengan perintah:

```bash
npm run build
```
Proses ini akan mengecek tipe TypeScript (tsc) dan melakukan bundling menggunakan Vite ke dalam folder `dist/`.

Untuk melihat preview dari hasil build tersebut secara lokal:
```bash
npm run preview
```

---

## 🚀 Langkah Selanjutnya
Untuk memastikan aplikasi berjalan tanpa kendala integrasi, pastikan servis **Backend** dan **Chatbot AI** juga sudah berjalan di terminal terpisah sebelum Anda melakukan login atau mengakses fitur utama di Frontend!
