# Pembaruan API & Integrasi A.L.I.C.E - Panduan untuk Tim Frontend

Dokumen ini memuat daftar perubahan API terbaru di *backend* agar tim *Frontend* / *Mobile* dapat menyesuaikan antarmuka pengguna (UI) dan pengiriman datanya. Terdapat penambahan field profil finansial serta satu buah _endpoint_ baru untuk fitur *Chatbot AI*.

---

## 1. Perubahan pada Payload Update Profil (`PUT /user/update`)

Sekarang, selain bisa mengganti nama pengguna, *endpoint* ini juga menerima data tambahan berupa **Usia (Age)** dan **Pekerjaan (Occupation)**. Tim *Frontend* diharapkan bisa menambah kotak input (form) untuk dua field ini di halaman "Edit Profil".

**URL:** `PUT /user/update` (Atau `/users/user/update`, sesuaikan konfigurasi router)  
**Tipe:** Protected (Bearer Token wajib)

**Request Body (JSON):**
```json
{
  "username": "Eko Ramadani",
  "age": 25,                       // [BARU] Opsional. Min: 10
  "occupation": "Software Engineer" // [BARU] Opsional.
}
```

---

## 2. Perubahan pada Payload Update Pengaturan (`PUT /setting`)

Kini *endpoint* pengaturan tidak hanya menampung batas *budget* mingguan dan penghasilan, melainkan juga menampung **Tujuan Finansial** dan **Masalah Finansial** utama dari *user*. Informasi ini sangat penting agar AI A.L.I.C.E bisa memberikan saran yang sangat personal. Harap tambahkan input (misal berupa `textarea` panjang) untuk _Goal_ dan _Problem_ di halaman "Settings / Budget".

**URL:** `PUT /setting`  
**Tipe:** Protected (Bearer Token wajib)

**Request Body (JSON):**
```json
{
  "monthly_income": 12000000,
  "weekly_budget": 2000000,
  "financial_goal": "Ingin melunasi hutang PayLater dalam 3 bulan.",   // [BARU] Opsional
  "financial_problem": "Sulit menahan hasrat jajan ketika sedang stres." // [BARU] Opsional
}
```
*(Catatan: Jika user mengosongkan form ini, cukup kirimkan empty string `""` atau tidak usah diikutsertakan).*

---

## 3. Fitur BARU: Chatbot AI A.L.I.C.E (`POST /alice/chat`)

Ini adalah _endpoint_ utama untuk halaman interaksi _Chatbot_. *Backend* sudah mengaturnya sedemikian rupa sehingga tim *Frontend* tidak perlu pusing mengirim data transaksi atau limit bulanan ke AI; **Backend yang akan menarik riwayat transaksi, menghitung transaksi boros/impulsif, dan menyuntikkannya secara gaib ke AI sebelum membalas!**

Tim *Frontend* HANYA perlu mengirimkan input teks (_message_) dari user, dan menjaga riwayat obrolan (_history_) di UI *state* (misal: useState di React) agar percakapan terus bersambung.

**URL:** `POST /alice/chat`  
**Tipe:** Protected (Bearer Token wajib)

**Request Body (JSON):**
```json
{
  "message": "Halo, dari pengeluaranku bulan ini, apa saran terbaikmu?", // Wajib
  "history": [                                                          // Opsional (kirim [] jika chat baru)
    {
      "role": "user",
      "text": "Sebelumnya aku nanya soal investasi."
    },
    {
      "role": "model",
      "text": "Tentu, investasi sangat penting untuk masa depanmu."
    }
  ]
}
```

**Response Body (JSON):**
```json
{
  "status": "success",
  "message": "Chat processed successfully",
  "data": {
    "user_id": "id-user-123",
    "nama_user": "Eko Ramadani",
    "reply": "Halo Eko! Berdasarkan analisis data transaksi kamu bulan ini..." 
  }
}
```
Tim *Frontend* tinggal merender string `reply` ke dalam _bubble chat_ balasan dari model.

---

### Kesimpulan untuk Tim Frontend:
1. Buat **Form Input Baru** (age, occupation, financial_goal, financial_problem).
2. Buat **Halaman Chat UI** A.L.I.C.E.
3. Anda tidak perlu menyimpan data chat di SQLite/Room DB (Mobile) jika merepotkan, namun simpan setidaknya _state session_ `history` array selama user belum keluar dari halaman Chat.
