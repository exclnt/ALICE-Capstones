#  Panduan Setup Predictive ML Engine

Panduan ini berisi langkah-langkah untuk mengonfigurasi dan menjalankan *microservice Machine Learning* **A.L.I.C.E** yang berjalan di atas FastAPI dan TensorFlow.

---

## 1. Prasyarat (Prerequisites)

- Pastikan Anda menggunakan **Python versi 3.12** (versi yang sama saat model ML ini dilatih, sangat disarankan untuk menghindari inkompatibilitas arsitektur model Keras/TensorFlow).
# A.L.I.C.E.

**Artificial Intelligence for Literacy, Insight , and Cost Efficiency**

  <p><em>Asisten Keuangan Cerdas Berbasis AI Generatif dan Prediktif Machine Learning</em></p>
---

## 2. Pembuatan Virtual Environment

Karena ukuran dan spesifikasi spesifik pustaka Machine Learning (terutama TensorFlow) yang cukup berat, Anda **wajib** menggunakan *virtual environment*.

Buka terminal, masuk ke folder `alice-predicted`, dan ketik:

**Untuk Mac / Linux / WSL:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```
*(Catatan: Jika Anda menggunakan shell Fish, gunakan `source .venv/bin/activate.fish`)*

**Untuk Windows (Command Prompt / PowerShell):**
```bash
python -m venv .venv
.venv\Scripts\activate
```

---

## 3. Instalasi Dependensi ML

Setelah *virtual environment* aktif `(.venv)`, instal seluruh pustaka komputasi saintifik dan _web framework_ dengan menjalankan:

```bash
pip install -r requirements.txt
```
*Proses ini mungkin memakan waktu lebih lama dibandingkan service lain karena akan mengunduh paket TensorFlow, Pandas, Numpy, dan Scikit-Learn.*

---

## 4. Menjalankan Server ML Engine

Jalankan server aplikasi FastAPI menggunakan **Uvicorn**:

```bash
uvicorn api.main:app --reload --port 10000
```

- `--reload` memungkinkan server melakukan *hot-reload* jika terjadi perubahan skrip di mode *development*.
- `--port 10000` mengatur _port_ aplikasi agar sesuai dengan yang dikonfigurasi pada environment file utama (`VITE_ALICE_API_BASE_URL` di Frontend).

Server ML Engine Anda akan mulai memuat _file-file_ model `.keras` ke memori dan akhirnya dapat diakses di:
 **`http://localhost:10000`**

Anda dapat memverifikasi status kelengkapan model (Health Check) dengan membuka:
 **`http://localhost:10000/health`**
