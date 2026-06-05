# A.L.I.C.E API v2 — Dokumentasi & Spesifikasi Integrasi

Selamat datang di Dokumentasi Resmi **A.L.I.C.E API v2** (Artificial Intelligence for Literacy, Investment, and Cost Efficiency). API ini dibangun menggunakan FastAPI untuk melayani inference real-time dari seluruh suite model AI A.L.I.C.E.

> [!NOTE]  
> Versi v2 ini memuat **Model B v2** (`budget_model_v2.keras`) yang telah dilatih menggunakan Genetic Algorithm (GA) yang disempurnakan dengan *Lifestyle-aware Penalty* dan batas alokasi logis per kategori.

---

## 🛠️ Cara Menjalankan API Server

Pastikan Anda berada di direktori `api_v2/` atau arahkan python path ke lokasi tersebut, kemudian jalankan perintah berikut:

```bash
# Dari direktori root /Testing2/
uvicorn api_v2.main_v2:app --reload --port 8000
```

Dokumentasi interaktif (Swagger UI) dapat diakses langsung melalui browser di:
🔗 **`http://localhost:8000/docs`**

---

## 🚀 Ringkasan Endpoints

| Method | Endpoint | Deskripsi | Model AI yang Digunakan |
|---|---|---|---|
| **GET** | `/health` | Mengecek status kesiapan server dan status load model | - |
| **POST** | `/api/v1/predict-balance` | Prediksi saldo harian 10 hari ke depan | **Model A**: LSTM Forecaster |
| **POST** | `/api/v1/optimize-budget` | Optimasi budget mingguan berdasarkan pengeluaran | **Model B v2**: DNN Regressor (v2) |
| **POST** | `/api/v1/segment-user` | Pengelompokan segmen finansial user | **Model C-1**: Autoencoder Latent |
| **POST** | `/api/v1/predict-risk` | Deteksi risiko transaksi real-time | **Model C-2**: DNN Classifier |

---

## 📖 Spesifikasi Detail Endpoint

### 1. Health Check
* **Endpoint**: `/health`
* **Method**: `GET`
* **Response Contoh**:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "model_count": 4
}
```

---

### 2. Model B: Optimize Budget (v2)
Endpoint ini merekomendasikan pembagian alokasi budget mingguan yang optimal berdasarkan rata-rata proporsi spending historis, total income, dan batas pengeluaran mingguan yang ditentukan.

> [!IMPORTANT]  
> **Mengapa API v2 lebih unggul?**  
> Pada versi sebelumnya (`main_revised.py`), model rentan jenuh (stuck pada 100% Bills atau meledak di Transport hingga 40%) akibat GA asli mengabaikan profil awal user. Di **v2**, model dilatih dengan *lifestyle penalty* sehingga alokasi optimal disesuaikan secara personal dan aman (Transport dikunci maks 25%, Food minimal 12%).

* **Endpoint**: `/api/v1/optimize-budget`
* **Method**: `POST`
* **Request Payload**:
```json
{
  "category_proportions": [0.08, 0.32, 0.11, 0.08, 0.24, 0.04, 0.12],
  "monthly_income": 5000000.0,
  "weekly_budget": 1500000.0
}
```
* **Keterangan Request**:
  - `category_proportions`: 7 nilai float (jumlah = 1.0) dengan urutan: **[Bills, Entertainment, Food & Beverage, Hobby, Shopping, Subscriptions, Transport]**.
  - `monthly_income`: Pendapatan bulanan asli (Rupiah).
  - `weekly_budget`: Limit pengeluaran mingguan asli (Rupiah).

* **Response Contoh**:
```json
{
  "allocations": [
    {
      "category": "Bills",
      "current_pct": 8.0,
      "optimal_pct": 8.44,
      "optimal_amount": 126600
    },
    {
      "category": "Entertainment",
      "current_pct": 32.0,
      "optimal_pct": 0.0,
      "optimal_amount": 0
    },
    {
      "category": "Food & Beverage",
      "current_pct": 11.0,
      "optimal_pct": 25.33,
      "optimal_amount": 379950
    },
    {
      "category": "Hobby",
      "current_pct": 8.0,
      "optimal_pct": 0.0,
      "optimal_amount": 0
    },
    {
      "category": "Shopping",
      "current_pct": 24.0,
      "optimal_pct": 0.0,
      "optimal_amount": 0
    },
    {
      "category": "Subscriptions",
      "current_pct": 4.0,
      "optimal_pct": 0.0,
      "optimal_amount": 0
    },
    {
      "category": "Transport",
      "current_pct": 12.0,
      "optimal_pct": 25.0,
      "optimal_amount": 375000
    },
    {
      "category": "Savings",
      "current_pct": 0.0,
      "optimal_pct": 41.23,
      "optimal_amount": 618450
    }
  ],
  "monthly_savings_potential": 2473800.0,
  "status": "success"
}
```

---

### 3. Model A: Predict Balance (LSTM)
Memprediksi tren saldo selama 10 hari ke depan berdasarkan runtun waktu 30 hari terakhir.

* **Endpoint**: `/api/v1/predict-balance`
* **Method**: `POST`
* **Request Payload**:
```json
{
  "daily_spending": [50000, 45000, 120000, ...], // Harus tepat 30 data point
  "daily_net": [150000, -10000, 30000, ...],      // Harus tepat 30 data point
  "balance": [2500000, 2490000, 2520000, ...]     // Harus tepat 30 data point
}
```

* **Response Contoh**:
```json
{
  "predictions": [0.45, 0.44, 0.43, 0.41, 0.39, 0.38, 0.37, 0.35, 0.32, 0.30],
  "warnings": [],
  "status": "success"
}
```

---

### 4. Model C-1: Segment User
Menganalisis karakteristik pengeluaran bulanan user ke dalam representasi laten dan memberikan label segmentasi finansial.

* **Endpoint**: `/api/v1/segment-user`
* **Method**: `POST`
* **Request Payload**:
```json
{
  "avg_spending": 450000.0,
  "impulsive_ratio": 0.23,
  "spending_cv": 0.65,
  "end_month_ratio": 0.12,
  "overbudget_freq": 0.15
}
```

* **Response Contoh**:
```json
{
  "latent_features": [0.1245, 0.8921],
  "segment_label": "Konsisten Hemat",
  "segment_number": 0,
  "status": "success"
}
```

---

### 5. Model C-2: Predict Risk (Classifier)
Menilai tingkat risiko suatu rencana transaksi secara real-time untuk mencegah *overbudgeting* impulsif.

* **Endpoint**: `/api/v1/predict-risk`
* **Method**: `POST`
* **Request Payload**:
```json
{
  "day_of_week": 4,
  "day_of_month": 15,
  "hour_of_day": 19,
  "segment": 1,
  "category": "Entertainment",
  "amount": 250000.0,
  "weekly_budget": 1000000.0,
  "is_impulsive": 1,
  "impulsive_ratio": 0.30,
  "overbudget_freq": 0.25
}
```

* **Response Contoh**:
```json
{
  "risk_probability": 0.5421,
  "is_risky": true,
  "risk_level": "MEDIUM",
  "nudge_message": "⚠️ Hati-hati! Transaksi Entertainment sebesar Rp250,000 pada hari Jumat jam 19:00 terdeteksi berisiko (MEDIUM). Pertimbangkan untuk menunda pengeluaran ini.",
  "status": "success"
}
```

---

> [!TIP]  
> **Tips Integrasi Frontend:**  
> Untuk Model B (Optimize Budget), pastikan frontend mengirimkan total 7 elemen proporsi `category_proportions` dengan jumlah totalnya bernilai tepat 1.0 (atau 100% jika dinyatakan dalam desimal).
