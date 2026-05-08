# Google Authentication Setup Guide

## Application Origins

### Frontend

```txt
http://localhost:5500
```

### Backend

```txt
http://localhost:3000
```

---

# Google OAuth Configuration

Masuk ke Google Cloud Console:

```txt
APIs & Services
→ Credentials
→ OAuth 2.0 Client IDs
```

Pilih OAuth Client yang digunakan.

---

# Authorized JavaScript Origins

Tambahkan origin berikut:

```txt
http://localhost:5500
http://localhost:3000
```

---

# Backend CORS Setup

Install dependency:

```bash
npm install cors
```

---

## Express Configuration

```js
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
}));
```

Pastikan middleware `cors()` dipasang sebelum routes.

---

# ▶ Run Application

## Frontend

```bash
npx serve .
```

atau gunakan Live Server.

---

## Backend

```bash
npm run dev
```

---

# Important Notes

* Jangan buka frontend menggunakan `file:///`
* Gunakan HTTP local server
* Pastikan origin frontend sama dengan yang didaftarkan di Google OAuth
* Jika menggunakan mode testing, tambahkan email team ke:

```txt
OAuth Consent Screen
→ Test Users
```

## Testing Guide Google auth
- jalankan googleAuthTest.html meggunakan live server ganti `data-client_id="<GOOGLE_CLIENT_ID>"` menggunakan dalam `.env`
