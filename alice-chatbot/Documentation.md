# A.L.I.C.E - AI Chatbot API Documentation
Dokumen ini berisi panduan teknis untuk tim Fullstack/Frontend dalam melakukan integrasi dengan fitur asisten virtual A.L.I.C.E (AI Financial Assistant). Sistem chatbot ini dibangun menggunakan FastAPI dan mengintegrasikan model Generative AI (Google Gemini & Groq) dengan mekanisme fallback untuk memastikan ketersediaan layanan (High Availability).

# 📁 Struktur File & Fungsinya
Sebelum melakukan integrasi, berikut adalah daftar file utama yang menggerakkan fitur Chatbot A.L.I.C.E beserta fungsinya:

## main.py

Fungsi: Merupakan file utama (ujung tombak) dari server FastAPI. File ini bertugas mengatur routing API, menangani konfigurasi keamanan (CORS), memvalidasi format data masuk (menggunakan Pydantic), dan menyimulasikan pengambilan data dinamis profil serta histori transaksi pengguna dari database berdasarkan user_id.

## alice_pipeline.py

Fungsi: Merupakan "Otak AI" dari sistem. File ini berisi logika Prompt Engineering dinamis yang merakit data transaksi pengguna menjadi instruksi sistem. File ini juga menangani komunikasi langsung dengan API Google Gemini (Jalur Utama) dan API Groq (Jalur Cadangan/Fallback jika Gemini terkena limit).

## .env

Fungsi: File tersembunyi yang menyimpan kredensial rahasia berupa API Keys (GEMINI_API_KEY dan GROQ_API_KEY). File ini tidak boleh diunggah ke repositori publik (GitHub).

## requirements.txt

Fungsi: Berisi daftar library Python (seperti fastapi, uvicorn, google-genai, groq) yang dibutuhkan agar server backend chatbot dapat berjalan di lingkungan development maupun production.

# 🚀 Panduan Cepat (Swagger UI)
Cara paling mudah untuk melakukan testing dan melihat kontrak API secara interaktif adalah melalui Swagger UI yang telah disediakan secara otomatis oleh FastAPI.
Pastikan server API berjalan (menggunakan perintah uvicorn main:app --reload), lalu buka di browser Anda:
**👉 http://localhost:8000/docs** 

# 📡 Base URL
Secara lokal untuk kebutuhan development, API berjalan di:
```http://localhost:8000```

# 🛠️ Daftar Endpoint
## 1. Chat Assistant (Generative AI Pipeline)
Method: POST
Path: /api/v1/chat

Deskripsi: Menerima pesan teks dari pengguna dan mengembalikan respons edukasi finansial yang sangat personal. Endpoint ini secara dinamis akan mengambil data ringkasan transaksi riil (seperti limit anggaran bulanan, frekuensi belanja impulsif, dan kategori boros) untuk disuntikkan ke konteks AI. API ini bersifat stateless, sehingga history obrolan wajib dikirimkan pada setiap request.

Request Payload (JSON):

``` JSON

{
  "user_id": "USR0787",
  "message": "Kenapa uangku habis terus bulan ini ya? Padahal aku ngerasa biasa aja.",
  "history": [
    {
      "role": "user",
      "text": "Halo ALICE!"
    },
    {
      "role": "model",
      "text": "Halo! Aku A.L.I.C.E. Ada yang bisa kubantu terkait keuanganmu hari ini?"
    }
  ]
}
```
Keterangan Parameter Request:

user_id (String): ID pengguna yang sedang login untuk dicocokkan dengan database.

message (String): Pesan atau pertanyaan terbaru dari pengguna.

history (Array of Objects): Riwayat obrolan sebelumnya untuk mempertahankan konteks (Memori AI). Terdiri dari role (user atau model) dan text.

Response (Success - 200 OK):

```JSON
{
  "success": true,
  "message": "Respons AI berhasil dibuat secara dinamis",
  "data": {
    "user_id": "USR0787",
    "nama_user": "Rian",
    "reply": "Hai Rian! Berdasarkan catatan transaksimu, kamu saat ini sudah overbudget sebesar Rp250.000, lho. Pengeluaran terbesarmu ada di kategori Entertainment. Yuk kita evaluasi pos pengeluaran hiburanmu supaya bulan depan dana daruratmu bisa tetap terisi!"
  }
}
```

Response (Error User Not Found - 404 Not Found):

```JSON
{
  "detail": "User ID USR9999 tidak terdaftar di database sistem A.L.I.C.E."
}
Response (Error Server/AI Failure - 500 Internal Server Error):

JSON
{
  "detail": "Gagal memproses AI: [Pesan error spesifik dari sistem/jaringan]"
}
```