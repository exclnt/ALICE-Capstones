#  Panduan Setup Lokal A.L.I.C.E. (Developer Guide)

Panduan ini dibuat khusus untuk developer yang ingin menjalankan, berkontribusi, atau melakukan replikasi proyek **A.L.I.C.E.** secara lokal. Karena proyek ini menggunakan arsitektur **Microservices**, Anda perlu menjalankan beberapa servis secara bersamaan.

> [!TIP]
> Panduan ini merupakan ringkasan eksekusi cepat (_Quick Start_). Jika Anda mengalami kendala saat mengikuti panduan ini atau membutuhkan detail konfigurasi yang lebih spesifik, silakan merujuk langsung pada file `setup.md` yang terdapat di dalam masing-masing direktori (misal: `backend/setup.md`, `frontend/setup.md`, dsb).

---

##  Prasyarat (Prerequisites)
Pastikan perangkat Anda telah terinstal perangkat lunak berikut sebelum memulai:
- **Node.js** (Direkomendasikan v20 LTS atau lebih baru)
- **Python** (Direkomendasikan v3.12 atau lebih baru)
- **PostgreSQL** (Berjalan di lokal atau menggunakan layanan cloud seperti Supabase)
- **Git**

---

##  Langkah-langkah Instalasi

### 1. Setup Backend (Node.js + Express)
Backend bertindak sebagai orkestrator utama, mengelola API, autentikasi pengguna, dan menyimpan riwayat data ke database.

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi _Environment Variables_:
   - Buat file `.env` dari `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Buka file `.env` dan isi nilai yang dibutuhkan, terutama untuk koneksi database PostgreSQL (`PGUSER`, `PGPASSWORD`, `PGDATABASE`, dll.), JWT Token (`ACCESS_TOKEN_KEY`), Google OAuth, dan Supabase Storage.
4. Jalankan Migrasi Database:
   ```bash
   npm run migrate
   ```
   *(Catatan: Anda juga bisa menjalankan `npm run server:generate-seed` jika ingin mengisi database dengan data dummy awal).*
5. Jalankan server backend (Development mode):
   ```bash
   npm run start:dev
   ```
   Backend akan berjalan secara default di `http://localhost:3000`.

---

### 2. Setup AI Chatbot (FastAPI + Python)
Microservice ini mengelola integrasi LLM (Gemini/Groq) untuk fitur asisten finansial pintar.

1. Buka terminal baru dan masuk ke folder `alice-chatbot`:
   ```bash
   cd alice-chatbot
   ```
2. Buat dan aktifkan _Virtual Environment_ (Opsional tapi sangat direkomendasikan):
   ```bash
   # Mac/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   
   # Windows (Command Prompt)
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Instal dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Konfigurasi _Environment Variables_:
   - Buat file `.env` dari `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Isi `GEMINI_API_KEY` dan `GROQ_API_KEY` dengan API Key yang valid.
5. Jalankan server chatbot:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
   Chatbot akan berjalan di `http://localhost:8001`.

---

### 3. Setup Predictive ML Engine (FastAPI + Python)
Microservice ini menyediakan endpoint inferensi untuk model-model ML (LSTM, Autoencoder, DNN).

1. Buka terminal baru dan masuk ke folder `alice-predicted`:
   ```bash
   cd alice-predicted
   ```
2. Buat dan aktifkan _Virtual Environment_:
   ```bash
   # Mac/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   
   # Windows
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Instal dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server ML Engine:
   ```bash
   uvicorn api.main:app --reload --port 10000
   ```
   ML Engine akan berjalan di `http://localhost:10000`.

---

### 4. Setup Frontend (React 19 + Vite)
Ini adalah antarmuka klien yang akan berinteraksi dengan API dari Backend utama.

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi _Environment Variables_:
   - Buat file `.env` dari `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Pastikan variabel berikut sesuai dengan port layanan yang berjalan di lokal Anda:
     ```env
     VITE_API_BASE_URL=http://localhost:3000
     VITE_ALICE_API_BASE_URL=http://localhost:8001
     VITE_GOOGLE_CLIENT_ID=<Google OAuth Client ID Anda>
     ```
4. Jalankan _Development Server_:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan (biasanya) di `http://localhost:5173`.

---

##  Urutan Menjalankan Servis (Best Practice)
Untuk menghindari error koneksi antar-microservices, disarankan menjalankan servis dengan urutan berikut saat _development_:
1. Pastikan layanan Database (PostgreSQL) menyala.
2. Jalankan **Backend** Node.js.
3. Jalankan **Predictive ML Engine**.
4. Jalankan **AI Chatbot** (Pastikan API Key valid).
5. Terakhir, jalankan **Frontend** Vite.


