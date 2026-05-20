# A.L.I.C.E - AI Backend API Documentation

Dokumen ini berisi panduan untuk tim Fullstack/Frontend dalam melakukan integrasi dengan model Artificial Intelligence (A.L.I.C.E) berbasis FastAPI.

## 🚀 Panduan Cepat (Swagger UI)
Cara paling mudah untuk melakukan testing dan melihat kontrak API adalah melalui **Swagger UI** yang telah disediakan secara otomatis oleh FastAPI.
Pastikan API Server berjalan, lalu buka:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📡 Base URL
Secara lokal, API berjalan di:
`http://localhost:8000`

---

## 🛠️ Daftar Endpoint

### 1. Health Check
*   Method: `GET`
*   Path: `/health`
*   Deskripsi: Digunakan untuk mengecek status server dan memastikan seluruh file model Machine Learning (AI) telah berhasil dimuat ke memori.
*   **Response:**
    ```json
    {
      "status": "healthy",
      "models_loaded": true,
      "model_count": 4
    }
    ```

### 2. Predict Balance (Model A - LSTM)
*   Method: `POST`
*   Path: `/api/v1/predict-balance`
*   Deskripsi: Melakukan peramalan (forecasting) saldo harian user untuk 10 hari ke depan berdasarkan riwayat transaksi 30 hari terakhir. Jika saldo diprediksi menyentuh angka negatif, API akan mengembalikan status peringatan (warning).
*   **Request Payload (JSON):**
    _Note: Array harus berjumlah tepat 30 data (merepresentasikan 30 hari)._
    ```json
    {
      "daily_spending": [50000, 120000, 30000, 0, 45000, 200000, 15000, 0, 60000, 80000,
    150000, 0, 25000, 40000, 100000, 35000, 0, 50000, 75000, 10000,
    0, 250000, 45000, 30000, 60000, 0, 85000, 120000, 50000, 20000], 
      "daily_net": [-50000, -120000, -30000, 0, -45000, -200000, -15000, 0, -60000, -80000,
    -150000, 5000000, -25000, -40000, -100000, -35000, 0, -50000, -75000, -10000,
    0, -250000, -45000, -30000, -60000, 0, -85000, -120000, -50000, -20000],
      "balance": [1450000, 1330000, 1300000, 1300000, 1255000, 1055000, 1040000, 1040000, 980000, 900000,
    750000, 5750000, 5725000, 5685000, 5585000, 5550000, 5550000, 5500000, 5425000, 5415000,
    5415000, 5165000, 5120000, 5090000, 5030000, 5030000, 4945000, 4825000, 4775000, 4755000]
    }
    ```
*   **Response:**
    ```json
    {
  "predictions": [0.329437, 0.331143, 0.335266, 0.335514, 0.340612, 0.343958, 0.346482, 0.349427, 0.350585, 0.355016],
  "warnings": [],
  "status": "success"
  }
    ```

### 3. Optimize Budget (Model B - DNN Regressor)
*   Method: `POST`
*   Path: `/api/v1/optimize-budget`
*   Deskripsi: Memberikan rekomendasi alokasi persentase budget yang ideal untuk 7 kategori pengeluaran dan tabungan. Bertujuan menekan kebiasaan impulsif pengguna.
*   Request Payload (JSON):
    _Note: `category_proportions` adalah array persentase pengeluaran user (urutan: Bills, Entertainment, Food, Hobby, Investment, Shopping, Transport). Total harus mendekati 1.0_
    ```json
    {
      "category_proportions": [0.20, 0.15, 0.30, 0.05, 0.00, 0.20, 0.10],
      "monthly_income": 8500000,
      "weekly_budget": 1500000
    }
    ```
*   Response:
    ```json
    {
      "optimal_pct": [0.166, 0.0, 0.171, 0.0, 0.461, 0.0, 0.202],
      "optimal_amount": [249000, 0, 256500, 0, 691500, 0, 303000],
      "status": "success"
    }
    ```

### 4. Segment User (Model C-1 - Autoencoder)
*   Method: `POST`
*   Path: `/api/v1/segment-user`
*   Deskripsi: Mengelompokkan user ke dalam segmen finansial tertentu berdasarkan kebiasaan transaksi mereka untuk keperluan personalisasi rekomendasi.
*   Request Payload (JSON):
    ```json
    {
      "avg_spending": 150000,
      "impulsive_ratio": 0.6,
      "spending_cv": 1.2,
      "end_month_ratio": 0.3,
      "overbudget_freq": 0.5
    }
    ```
*   **Response:**
    ```json
    {
  "latent_features": [
    0.4992,
    0.8611
    ],
    "segment_label": "Impulsif Tinggi",
    "status": "success"
    }
    ```

### 5. Predict Risk (Model C-2 - DNN Classifier)
*   Method: `POST`
*   Path: `/api/v1/predict-risk`
*   Deskripsi: Menilai apakah sebuah transaksi yang akan atau sedang dilakukan bersifat berisiko (Risky) atau normal (Normal). Jika berisiko tinggi (Risky), Frontend dapat menampilkan _behavioral nudging_ (peringatan) kepada pengguna.
*   **Request Payload (JSON):**
    ```json
    {
      "day_of_week": 5,
      "day_of_month": 28,
      "hour_of_day": 21,
      "segment": 2,
      "category": "Shopping",
      "amount": 500000,
      "weekly_budget": 800000,
      "is_impulsive": 1,
      "impulsive_ratio": 0.6,
      "overbudget_freq": 0.4
    }
    ```
*   **Response:**
    ```json
    {
      "risk_probability": 0.73,
      "is_risky": true,
      "risk_level": "HIGH",
      "nudge_message": "⚠️ Hati-hati! Transaksi Shopping sebesar Rp500,000 pada hari Sabtu jam 21:00 terdeteksi berisiko (HIGH). Pertimbangkan untuk menunda pengeluaran ini.",
      "status": "success"
    }
    ```

---
**Catatan Penting Error Handling:**
Jika payload JSON yang dikirim Frontend tidak sesuai tipe datanya (misal: mengirim String padahal diminta Integer), atau ada field yang kurang, FastAPI akan otomatis memblokir request dan mengembalikan error **HTTP 422 Unprocessable Entity** berisi detail field mana yang bermasalah.
