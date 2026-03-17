const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/receipts', receiptRoutes); // OCR receipt scanning

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start OCR microservice with Gunicorn
const ocrPath = path.join(__dirname, 'ocr_service');
const ocrBind = process.env.OCR_BIND || '0.0.0.0:5001';

const commandCandidates = [
    { cmd: path.join(ocrPath, '.venv', 'bin', 'gunicorn'), args: ['app:app', '--bind', ocrBind], type: 'file' },
    { cmd: path.join(ocrPath, 'venv', 'bin', 'gunicorn'), args: ['app:app', '--bind', ocrBind], type: 'file' },
    { cmd: 'python3', args: ['-m', 'gunicorn', 'app:app', '--bind', ocrBind], type: 'path' },
];

function resolveOcrCommand() {
    for (const candidate of commandCandidates) {
        if (candidate.type === 'file' && fs.existsSync(candidate.cmd)) {
            return candidate;
        }
        if (candidate.type === 'path') {
            return candidate;
        }
    }
    return null;
}

const selected = resolveOcrCommand();

if (!selected) {
    console.error('OCR autostart disabled: no Gunicorn command found.');
    console.error('Install with: cd backend/ocr_service && python3 -m venv venv && venv/bin/pip install -r requirements.txt');
    process.exit(1);
}

console.log(`Starting OCR microservice: ${selected.cmd} ${selected.args.join(' ')}`);

const ocrProcess = spawn(selected.cmd, selected.args, {
    cwd: ocrPath,
    stdio: 'inherit',
});

ocrProcess.on('error', (err) => {
    console.error('Failed to start OCR microservice:', err);
    console.error('Try: cd backend/ocr_service && python3 -m venv venv && venv/bin/pip install -r requirements.txt');
});

ocrProcess.on('exit', (code, signal) => {
    console.log(`OCR microservice exited with code ${code}, signal ${signal}`);
});