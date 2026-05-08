# Setup Environment Project

## 1. Install Infisical CLI

```bash
npm install -g @infisical/cli
```

---

## 2. Login ke Infisical

```bash
infisical login
```

Login menggunakan akun yang sudah diinvite ke project.

---

## 3. Clone repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 4. Connect project ke Infisical

```bash
infisical init
```

Pilih:

* Organization
* Project
* Environment (`dev`)

---

## 5. Download file `.env`

```bash
infisical export --env=dev > .env
```

Pastikan file `.env` sudah muncul di root project.

---

## 6. Install dependency

```bash
npm install
```

---

## 7. Jalankan project

```bash
npm run dev
```

---

# Update Environment Variable

Kalau ada perubahan secret terbaru:

```bash
infisical export --env=dev > .env
```

---

# Penting

Jangan commit file berikut:

```gitignore
.env
.infisical
```
