# 🛠️ Panduan Setup A.L.I.C.E. Financial Dashboard

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan aplikasi Dashboard Analitik (*Streamlit*) di komputer lokal Anda.

---

## 1. Prasyarat

- Pastikan Anda sudah menginstal **Python** (disarankan versi 3.10 atau lebih baru) di perangkat Anda.
- Pastikan file dataset `alice_transactions_final.csv` sudah berada di dalam folder `Dashboard` ini.

---

## 2. Setup Virtual Environment (Direkomendasikan)

Untuk menjaga agar *library* (dependensi) Python proyek ini tidak bertabrakan dengan sistem global komputer Anda, sangat disarankan menggunakan *Virtual Environment*.

Buka terminal Anda, arahkan ke direktori `Dashboard`, lalu ketik perintah berikut:

**Pengguna Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Pengguna Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

---

## 3. Instalasi Dependensi

Setelah *virtual environment* aktif, jalankan perintah ini untuk menginstal `streamlit`, `pandas`, dan `plotly` secara serentak:

```bash
pip install -r requirements.txt
```

---

## 4. Menjalankan Dashboard

Setelah instalasi selesai dengan sukses, Anda dapat langsung menghidupkan _web server_ lokal Streamlit dengan perintah:

```bash
streamlit run dashboard.py
```

Streamlit akan secara otomatis membuka jendela tab baru di *browser* (peramban) internet Anda. Secara default, antarmuka dashboard dapat diakses melalui:
👉 **`http://localhost:8501`**

---

## ⚠️ Troubleshooting (Penyelesaian Masalah)

- **Masalah: `ModuleNotFoundError` saat menjalankan aplikasi.**
  - **Solusi:** Pastikan Anda sudah mengaktifkan _virtual environment_ (Langkah 2) dan telah sukses menjalankan `pip install -r requirements.txt` (Langkah 3).
- **Masalah: `FileNotFoundError: [Errno 2] No such file or directory: 'alice_transactions_final.csv'`**
  - **Solusi:** Hal ini terjadi karena _script_ membaca file CSV di direktori tempat perintah dieksekusi. Pastikan Anda menjalankan perintah `streamlit run` *tepat* di dalam folder `Dashboard`, bukan di folder root `main-alice`.
