# Setup Database Lokal

Panduan lengkap untuk membuat database PostgreSQL beserta user khusus di lingkungan lokal.

---

## 1. Masuk ke PostgreSQL sebagai Super User

```bash
psql -U <super-user> -d postgres
```

---

## 2. Buat Database

```sql
CREATE DATABASE <nama-database>;
```

---

## 3. Buat User (Role) Khusus

```sql
CREATE USER <user> WITH PASSWORD '<password-user>';
```

---

## 4. Beri Akses User ke Database

```sql
GRANT ALL PRIVILEGES ON DATABASE <nama-database> TO <user>;
```

---

## 5. Masuk ke Database Baru

```sql
\c <nama-database>
```

---

## 6. Atur Akses Skema untuk User

```sql
GRANT ALL ON SCHEMA public TO <user>;
```

---

## 7. Keluar dan Test Login User

Keluar dari sesi PostgreSQL:

```bash
\q
```

Login menggunakan user yang baru dibuat:

```bash
psql -U <user> -d <nama-database> -h localhost
```

---

## 8. Konfigurasi File `.env`

Buat file `.env` di root project dan tambahkan variabel berikut:

```env
# Server
HOST=<host-ip>
PORT=<running-port>

# Database
PGUSER=<user>
PGPASSWORD=<password-user>
PGDATABASE=<nama-database>
PGHOST=<host-database>
PGPORT=5432

# Security
ACCESS_TOKEN_KEY=<secret-token1>
REFRESH_TOKEN_KEY=<secret-token2>
```

> **Catatan:** Jangan pernah meng-commit file `.env` ke repository. Tambahkan `.env` ke dalam `.gitignore`.