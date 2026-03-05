/**
 * receiptRoutes.js
 * POST /api/receipts/scan  – upload a receipt image, get structured JSON back
 */

const express  = require('express');
const multer   = require('multer');
const os       = require('os');
const path     = require('path');
const protect  = require('../middleware/authMiddleware');
const { scanReceipt } = require('../controllers/receiptController');

const router = express.Router();

// Store uploads in the system temp folder with a unique name
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename:    (_req,  file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `receipt_${Date.now()}${ext}`);
  },
});

// Only accept image files (jpg, png, webp, bmp, tiff)
const fileFilter = (_req, file, cb) => {
  if (/^image\//i.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are accepted.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
});

// POST /api/receipts/scan
router.post('/scan', protect, upload.single('receipt'), scanReceipt);

module.exports = router;
