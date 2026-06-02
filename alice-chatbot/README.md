# 🤖 A.L.I.C.E - AI Chatbot Microservice

Sistem *backend microservice* untuk fitur asisten finansial virtual A.L.I.C.E. Dibangun menggunakan **FastAPI**, _service_ ini mengintegrasikan model Generative AI secara dinamis dengan menggunakan **Google Gemini** sebagai jalur utama dan **Groq / Llama-3** sebagai mekanisme _fallback_ (cadangan) guna menjamin ketersediaan layanan (_High Availability_).

---

## 📁 Struktur File & Fungsinya

- **`main.py`**
  Ujung tombak server FastAPI. Bertugas mengatur _routing_ API, konfigurasi CORS, memvalidasi _payload_ menggunakan Pydantic, serta menyimulasikan/mengatur _context_ data transaksi dari pengguna (misal: *user_id*).
- **`alice_pipeline.py`**
  "Otak AI" dari sistem ini. Berisi logika _Prompt Engineering_ yang bertugas merakit data keuangan pengguna menjadi instruksi sistem (System Prompt). File ini juga mengatur _request_ langsung ke API Gemini dan Groq.
- **`requirements.txt`**
  Daftar _library_ Python yang dibutuhkan seperti `fastapi`, `uvicorn`, `google-genai`, dan `groq`.

---

## 🚀 Dokumentasi API & Swagger UI

FastAPI menyediakan dokumentasi interaktif bawaan secara otomatis. Setelah server dijalankan, Anda bisa langsung mengakses **Swagger UI** di peramban pada alamat:
👉 **`http://localhost:8001/docs`**

---

## 🛠️ Daftar Endpoint Utama

### 1. Chat Assistant (Generative AI Pipeline)
- **Method:** `POST`
- **Path:** `/api/v1/chat`
- **Deskripsi:** Menerima pesan teks dari pengguna dan riwayat percakapan (*stateless*), lalu merakitnya dengan data profil/transaksi di _backend_ untuk menghasilkan respons edukasi finansial yang terpersonalisasi.

**Request Payload (JSON):**
```json
{
  "user_id": "USR0787",
  "message": "Kenapa uangku cepat habis bulan ini ya?",
  "history": [
    {
      "role": "user",
      "text": "Halo ALICE!"
    },
    {
      "role": "model",
      "text": "Halo! Aku A.L.I.C.E. Ada yang bisa kubantu terkait keuanganmu?"
    }
  ]
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Respons AI berhasil dibuat secara dinamis",
  "data": {
    "user_id": "USR0787",
    "nama_user": "Rian",
    "reply": "Berdasarkan transaksimu, kamu sering jajan kopi minggu ini..."
  }
}
```

---

> **Catatan:** Untuk panduan instalasi dan menjalankan server ini di perangkat lokal Anda, silakan baca file [`setup.md`](./setup.md).
