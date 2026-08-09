# 💰 MoneyMap

A full-stack personal finance tracker with an AI-powered receipt scanner.  
Track income & expenses, visualize spending with charts, and scan receipt images with Tesseract OCR to auto-fill transactions.

---

## ✨ Features

- **Dashboard** — balance overview, monthly income vs. expense bar chart, category pie chart, recent transactions
- **Transactions** — add, edit, delete income/expense entries with categories and dates
- **Expenses screen** — filter & search all transactions by type, category, or keyword
- **Receipt Scanner** — upload a receipt photo → Tesseract OCR reads the text → editable popup pre-fills a transaction
- **Analytics** — monthly trend chart across the last 6 months
- **Authentication** — email/password register & login + Google/GitHub OAuth via Firebase, JWT session cookies

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts, Tailwind CSS, Firebase Auth |
| Backend | Node.js, Express 5, PostgreSQL, JWT, Multer, Tesseract OCR |

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
│   ├── services/              # In-process OCR + receipt parsing
│   └── db.js                  # PostgreSQL pool
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** (running locally)
- **Tesseract OCR** (system package — used by the backend receipt scanner)

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

Optional variables:

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Set to `production` for secure HTTPS-only cookies |
| `PORT` | `5000` | Node API port |

Ensure the PostgreSQL database exists before starting the backend:

```bash
createdb moneymap
```

### 3. Run the app

Use **two terminals**.

**Terminal 1 — Backend (API on :5000)**

```bash
cd backend
node server.js
```

Expected output:

```
Server running on port 5000
Database connected successfully!
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
