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
│   ├── .env.example           # Environment variable template
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

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** (running locally)
- **Tesseract OCR** (system package — required by the Python OCR service)

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y tesseract-ocr

# macOS
brew install tesseract
```

### 1. Clone and install dependencies

```bash
git clone https://github.com/TenathDilusha/MoneyMap.git
cd MoneyMap

# Frontend
cd frontend && npm install && cd ..

# Backend API
cd backend && npm install && cd ..

# OCR microservice (Python virtualenv)
cd backend/ocr_service
python3 -m venv venv
venv/bin/pip install -r requirements.txt
cd ../..
```

### 2. Configure environment

Copy the example env file and edit it with your values:

```bash
cd backend
cp .env.example .env
```

Required variables in `backend/.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random string for signing session cookies (`openssl rand -base64 32`) |

Optional variables (defaults shown in `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Set to `production` for secure HTTPS-only cookies |
| `PORT` | `5000` | Node API port |
| `OCR_BIND` | `0.0.0.0:5001` | Gunicorn bind address for OCR |
| `OCR_SERVICE_URL` | `http://localhost:5001` | URL the API uses to reach OCR |

Ensure the PostgreSQL database exists before starting the backend:

```bash
createdb moneymap
```

### 3. Run the app

Use **two terminals** — the backend starts both the API and OCR service together.

**Terminal 1 — Backend (API on :5000, OCR on :5001)**

```bash
cd backend
node server.js
```

Expected output:

```
Starting OCR microservice: .../venv/bin/gunicorn app:app --bind 0.0.0.0:5001
Server running on port 5000
Database connected successfully!
[INFO] Listening at: http://0.0.0.0:5001
```

**Terminal 2 — Frontend (Vite on :5173)**

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Ports

| Service | Port |
|---|---|
| React frontend (Vite) | 5173 |
| Node.js API | 5000 |
| Python OCR (Gunicorn) | 5001 |
