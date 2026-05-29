# Setup Project

## 1. Gunakan Python versi 3.12.2

Pastikan Python 3.12.2 sudah terinstal di sistem kamu.

## 2. Buat Virtual Environment

```bash
python -m venv .venv
```

## 3. Jalankan Virtual Environment

Untuk **Fish terminal**:

```fish
source .venv/bin/activate.fish
```

## 4. Instal Paket yang Diperlukan

```bash
pip install -r requirements.txt
```

## 5. Masuk ke Folder `api` dan Jalankan FastAPI

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

## 6. Jika Selesai, Matikan Virtual Environment

```bash
deactivate
```
