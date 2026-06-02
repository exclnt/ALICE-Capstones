# 🧠 A.L.I.C.E - Predictive ML Engine

_Microservice_ ini adalah mesin analitik prediktif utama untuk aplikasi **A.L.I.C.E**. Dibangun menggunakan **FastAPI** dan pustaka **TensorFlow/Keras**, layanan ini bertugas mengeksekusi model *Machine Learning* yang telah dilatih untuk memberikan wawasan keuangan tingkat lanjut kepada pengguna.

---

## 🏗️ Model Machine Learning yang Digunakan

Sistem ini memuat dan melayani beberapa model spesifik secara bersamaan:
1. **Model A (LSTM - Long Short-Term Memory):** Mengelola fitur *Early Warning System* dengan melakukan peramalan (*forecasting*) saldo pengguna hingga 10 hari ke depan berdasarkan pola transaksi historis.
2. **Model B (DNN Regressor):** Mengelola *Budget Optimization* dengan merekomendasikan proporsi pembagian pengeluaran ideal untuk berbagai kategori guna menekan kebiasaan impulsif.
3. **Model C-1 (Autoencoder):** Melakukan ekstraksi fitur tak kasat mata (*latent features*) untuk menyegmentasikan pengguna berdasarkan pola perilaku kedisiplinan keuangan mereka.
4. **Model C-2 (DNN Classifier):** Menilai tingkat risiko (*Predictive Risk*) dari suatu transaksi spesifik secara _real-time_, mendeteksi _impulsive buying_, dan memicu peringatan berupa _behavioral nudging_ ke *Frontend*.

---

## 🚀 Dokumentasi API & Swagger UI

Cara paling mudah untuk melakukan *testing* dan meninjau kontrak API secara interaktif adalah melalui **Swagger UI** bawaan FastAPI.
Pastikan API Server telah berjalan, lalu buka *browser* Anda di alamat:
👉 **`http://localhost:10000/docs`**

---

## 🛠️ Daftar Endpoint Utama

Semua *endpoint* menerima dan mengembalikan data dalam format JSON. Jika struktur *payload* tidak sesuai, FastAPI secara otomatis mengembalikan pesan galat `422 Unprocessable Entity`.

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/health` | Memeriksa ketersediaan server dan memastikan keempat model ML telah berhasil dimuat ke dalam memori. |
| `POST` | `/api/v1/predict-balance` | Meramalkan saldo 10 hari ke depan (LSTM). Mengembalikan peringatan (warning) jika terdeteksi indikasi defisit kas. |
| `POST` | `/api/v1/optimize-budget` | Merekomendasikan alokasi anggaran (*budgeting*) yang optimal antar kategori pengeluaran (DNN Regressor). |
| `POST` | `/api/v1/segment-user` | Mengategorikan perilaku finansial pengguna (contoh: "Impulsif Tinggi") menggunakan Autoencoder. |
| `POST` | `/api/v1/predict-risk` | Memprediksi probabilitas risiko tinggi sebuah transaksi sebelum dieksekusi pengguna (DNN Classifier). |

---

> **Catatan:** Untuk panduan instalasi dependensi (seperti TensorFlow) dan cara menghidupkan server di lingkungan lokal, silakan lihat file [`setup.md`](./setup.md).
