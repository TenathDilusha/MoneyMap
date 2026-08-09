/**
 * POST /api/receipts/scan
 * Runs Tesseract OCR in-process and returns structured receipt JSON.
 */

const fs = require('fs');
const { scanReceiptImage } = require('../services/receiptOcr');

async function scanReceipt(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  const tempPath = req.file.path;

  try {
    const data = await scanReceiptImage(tempPath);
    res.json(data);
  } catch (err) {
    console.error('Receipt scan error:', err.message);

    if (err.code === 'ENOENT') {
      return res.status(503).json({
        message: 'Tesseract OCR is not installed on this machine.',
        hint: 'Install with: sudo apt install tesseract-ocr  (or brew install tesseract)',
      });
    }

    res.status(500).json({ message: `Failed to process receipt: ${err.message}` });
  } finally {
    fs.unlink(tempPath, () => {});
  }
}

module.exports = { scanReceipt };
