# Express Starter Kit

Starter project Express.js dengan struktur bersih, middleware siap pakai, dan error handling terstandarisasi. Cocok untuk membangun REST API yang scalable dan maintainable.

![Express](https://img.shields.io/badge/Express-5.2.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-LTS-green) ![License](https://img.shields.io/badge/license-MIT-purple)

---

## Navigasi

- [Express Starter Kit](#express-starter-kit)
  - [Navigasi](#navigasi)
  - [Fitur](#fitur)
  - [Struktur Proyek](#struktur-proyek)
  - [Instalasi](#instalasi)
  - [Skrip yang Tersedia](#skrip-yang-tersedia)
  - [Endpoint Khusus](#endpoint-khusus)
  - [Tech Stack](#tech-stack)
    - [Dependencies](#dependencies)
    - [Dev Dependencies](#dev-dependencies)
  - [Catatan](#catatan)

---

## Fitur

- Express.js minimal setup dengan konfigurasi siap pakai
- Modular routing — mudah dikembangkan per modul
- Error handling middleware terstandarisasi dengan kelas exception khusus
- Struktur folder bersih dan konsisten
- Dokumentasi API otomatis via Swagger UI di `/docs`
- API testing terintegrasi menggunakan Newman + Postman collection

---

## Struktur Proyek

```
express-starter/
│
├── test/
│   ├── Stater-Backend-express-Env.postman_environment.json
│   └── Stater-Backend-Express.postman_collection.json
│
├── src/
│   ├── exceptions/             # Kelas error kustom
│   │   ├── AuthenticationError.js
│   │   ├── AuthorizationError.js
│   │   ├── ClientError.js
│   │   ├── InvariantError.js
│   │   ├── NotFoundError.js
│   │   └── index.js
│   │
│   ├── middlewares/            # Middleware Express
│   │   ├── errorHandler.js
│   │   ├── validate.js
│   │   └── validateQuery.js
│   │
│   ├── routes/                 # Definisi rute API
│   │   └── index.js
│   │
│   ├── server/                 # Konfigurasi server
│   │   └── index.js
│   │
│   ├── services/               # service server
│   │   └── users/
│   │       ├── controllers/
│   │       │   └── usersController.js
│   │       │
│   │       └── routes/
│   │           └── index.js
│   │
│   └── utils/                  # Utilitas pembantu
│       └── response.js
│
├── .env
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── nodemon.json
├── package.json
├── package-lock.json
└── server.js                   # Entry point utama
```

---

## Instalasi

Pastikan [Node.js](https://nodejs.org) dan npm sudah terpasang di sistem Anda.

```bash
git clone https://github.com/username/express-starter.git
cd express-starter
npm install
```

Pasang Newman secara global untuk keperluan pengujian API:

```bash
npm install -g newman
```

Jalankan server pada mode development:

```bash
npm run start:dev
```

---

## Skrip yang Tersedia

| Perintah               | Deskripsi                                |
| ---------------------- | ---------------------------------------- |
| `npm run start:dev`    | Menjalankan server pada mode development |
| `npm run lint`         | Melihat panduan gaya linter              |
| `npm run lint:fix`     | Memperbaiki otomatis gaya kode           |
| `npm run format`       | Memformat penulisan kode                 |
| `npm run format:check` | Memeriksa format penulisan kode          |
| `npm run test:api`     | Menjalankan pengujian endpoint API       |

---

## Endpoint Khusus

| Method | Path    | Deskripsi                               |
| ------ | ------- | --------------------------------------- |
| `GET`  | `/docs` | Dokumentasi API interaktif (Swagger UI) |

---

## Tech Stack

### Dependencies

```json
{
  "@types/express": "^5.0.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "global": "^4.4.0",
  "morgan": "^1.10.1",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1"
}
```

### Dev Dependencies

```json
{
  "@eslint/js": "^10.0.1",
  "eslint": "^10.2.1",
  "eslint-config-dicodingacademy": "^0.9.5",
  "eslint-config-prettier": "^10.1.8",
  "prettier": "3.8.3"
}
```

---

## Catatan

Proyek ini menggunakan Newman sebagai dependensi global. Jalankan perintah berikut untuk instalasi:

```bash
npm install -g newman
```

Pastikan Newman sudah terpasang sebelum menjalankan `npm run test:api`.