# 💰 MoneyMap

A full-stack personal finance tracker with an AI-powered receipt scanner.  
Track income & expenses, visualize spending with charts, and scan receipt images with an ML OCR model to auto-fill transactions.

---

## ✨ Features

- **Dashboard** — balance overview, monthly income vs. expense bar chart, category pie chart, recent transactions
- **Transactions** — add, edit, delete income/expense entries with categories and dates
- **Expenses screen** — filter & search all transactions by type, category, or keyword
- **Receipt Scanner** — upload a receipt photo → Python ML (Tesseract OCR) reads the text → editable popup pre-fills a transaction
- **Analytics** — monthly trend chart across the last 6 months
- **Authentication** — email/password register & login + Google/GitHub OAuth via Firebase, JWT session cookies

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts, Tailwind CSS, Firebase Auth |
| Backend API | Node.js, Express 5, PostgreSQL, JWT, Multer |
| OCR Microservice | Python 3, Flask, pytesseract, Pillow |

---

## 📁 Project Structure

```
MoneyMap/
├── frontend/                  # React + Vite app (port 5173)
│   └── src/
│       ├── components/        # UI components (modals, cards, charts)
│       ├── screens/           # Page-level views (Home, Expenses, Profile)
│       └── services/api.js    # Axios calls to Node backend
│
├── backend/                   # Node.js Express API (port 5000)
│   ├── controllers/           # Route handlers (auth, expenses, receipts)
│   ├── routes/                # Express routers
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # DB query helpers
│   ├── db.js                  # PostgreSQL pool
│   └── ocr_service/           # Python Flask OCR microservice (port 5001)
│       ├── app.py
│       └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL
- Python ≥ 3.10
- Tesseract OCR binary — `sudo apt install tesseract-ocr` (Ubuntu/Debian)

---

### 1. Clone the repo

```bash
git clone https://github.com/TenathDilusha/MoneyMap.git
cd MoneyMap
```

---

### 2. Backend — Node.js API

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/moneymap
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Start the server:

```bash
node server.js          # production
npx nodemon server.js   # development (auto-reload)
```

Runs on **http://localhost:5000**

---

### 3. OCR Microservice — Python Flask

```bash
cd backend/ocr_service
python3 -m venv venv
venv/bin/pip install -r requirements.txt
venv/bin/python app.py
```

Runs on **http://localhost:5001**  
The Node backend proxies receipt images to this service automatically.

---

### 4. Frontend — React + Vite

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173**

---

## 🔑 Environment Variables

| File | Variable | Description |
|---|---|---|
| `backend/.env` | `DATABASE_URL` | PostgreSQL connection string |
| `backend/.env` | `JWT_SECRET` | Secret key for JWT signing |
| `backend/.env` | `NODE_ENV` | `development` or `production` |
| `backend/.env` | `OCR_SERVICE_URL` | OCR microservice URL (default: `http://localhost:5001`) |

---

## 🧾 Receipt Scanner Flow

```
Browser
  │  POST /api/receipts/scan  (multipart image)
  ▼
Node.js backend  (multer saves temp file)
  │  POST /scan  (forwards image)
  ▼
Python Flask OCR service
  │  pytesseract → raw text → parse storeName / date / total / items
  ▼
Structured JSON  →  Node  →  Browser
  │
  ▼
Editable review popup  →  pre-fills AddTransaction modal
```

---

## 📡 API Endpoints

### Auth  `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create account |
| POST | `/login` | Login, sets JWT cookie |
| POST | `/oauth` | Firebase OAuth sign-in |
| GET  | `/me` | Get current user |
| POST | `/logout` | Clear session cookie |

### Expenses  `/api/expenses`
| Method | Path | Description |
|---|---|---|
| GET    | `/` | List all transactions |
| POST   | `/` | Add transaction |
| PUT    | `/:id` | Edit transaction |
| DELETE | `/:id` | Delete transaction |

### Receipts  `/api/receipts`
| Method | Path | Description |
|---|---|---|
| POST | `/scan` | Upload receipt image → returns extracted data |

---

## 🛠️ Database

Run this SQL to create the required tables:

```sql
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email    VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE expenses (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(10)  NOT NULL DEFAULT 'expense',
  description TEXT,
  amount      NUMERIC(12,2) NOT NULL,
  category    VARCHAR(50),
  date        DATE NOT NULL
);
```

---

## 📜 License

MIT
