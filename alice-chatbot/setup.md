#  Panduan Setup AI Chatbot (A.L.I.C.E.)

Panduan ini berisi langkah-langkah untuk menjalankan *microservice* AI Chatbot berbasis **FastAPI** di lingkungan lokal Anda.

---

## 1. Prasyarat (Prerequisites)

- **Python** (Disarankan versi 3.10 atau 3.12).
- API Key aktif dari [Google Gemini (Google AI Studio)](https://aistudio.google.com/) dan [Groq](https://console.groq.com/).

---

## 2. Pembuatan Virtual Environment

Untuk memastikan instalasi _library_ tidak mengganggu proyek Python Anda yang lain, buatlah *virtual environment* baru.

Buka terminal, arahkan ke folder `alice-chatbot`, lalu ketik:

**Untuk Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Untuk Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

*(Tanda bahwa virtual environment aktif adalah adanya tulisan `(.venv)` di bagian kiri prompt terminal Anda).*

---

## 3. Instalasi Dependensi

Jalankan perintah berikut untuk mengunduh semua paket yang tercantum dalam `requirements.txt`:

```bash
pip install -r requirements.txt
```
*(Paket yang diinstal meliputi `fastapi`, `uvicorn`, `pydantic`, `google-genai`, `groq`, dll).*

---

## 4. Konfigurasi Kredensial (.env)

Server AI membutuhkan kunci API untuk bisa mengakses model LLM.

1. Buat salinan file `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan masukkan API Key Anda:
   ```env
   GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
   GROQ_API_KEY=masukkan_api_key_groq_anda_di_sini
   ```
> **Peringatan Keamanan:** Jangan pernah melakukan *commit* file `.env` ke GitHub atau repositori publik!

---

## 5. Menjalankan Server (Development Mode)

Setelah semuanya siap, hidupkan server FastAPI dengan menggunakan **Uvicorn**:

```bash
uvicorn main:app --reload --port 8001
```

- Parameter `--reload` memungkinkan server _restart_ otomatis jika Anda mengubah kode `main.py` atau `alice_pipeline.py`.
- Parameter `--port 8001` menentukan agar _service_ chatbot ini berjalan di port 8001, sehingga tidak bentrok dengan backend Node.js (3000) atau Predictive ML (10000).

Server akan dapat diakses di:
 **`http://localhost:8001`**

Dokumentasi endpoint (Swagger UI) dapat dibuka di:
 **`http://localhost:8001/docs`**
