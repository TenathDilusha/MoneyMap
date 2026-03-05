/**
 * receiptController.js
 *
 * Forwards the uploaded receipt image to the Python OCR microservice
 * (running on port 5001) and returns the structured JSON it produces.
 *
 * All heavy ML / OCR work lives in backend/ocr_service/app.py – this file is
 * purely a thin proxy so the Node.js API surface stays unchanged.
 */

const fs       = require('fs');
const path     = require('path');
const axios    = require('axios');
const FormData = require('form-data');

// Base URL for the Python OCR microservice.
// Override via OCR_SERVICE_URL env var if needed.
const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:5001';

/**
 * POST /api/receipts/scan
 *
 * Receives a multipart image (field: "receipt") from the frontend (via multer),
 * re-forwards it as multipart to the Python microservice, and returns
 * the extracted JSON to the client.
 */
async function scanReceipt(req, res) {
  // multer writes the file to a temp path before this handler runs
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  const tempPath = req.file.path;

  try {
    // Step 1 – build a multipart form to forward to the Python service
    const form = new FormData();
    form.append('receipt', fs.createReadStream(tempPath), {
      filename:    req.file.originalname || path.basename(tempPath),
      contentType: req.file.mimetype     || 'image/jpeg',
    });

    // Step 2 – call the Python OCR microservice
    const { data } = await axios.post(`${OCR_SERVICE_URL}/scan`, form, {
      headers: form.getHeaders(),
      timeout: 60_000, // give OCR up to 60 s for large images
    });

    // Step 3 – relay the structured receipt JSON straight to the client
    res.json(data);

  } catch (err) {
    console.error('Receipt scan error:', err.message);

    // Distinguish "microservice not running" from other errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      return res.status(503).json({
        message: 'OCR service is not running. Please start the Python microservice.',
        hint: 'cd backend/ocr_service && venv/bin/pip install -r requirements.txt && venv/bin/python app.py',
      });
    }

    const upstream = err.response?.data?.error || err.message;
    res.status(500).json({ message: `Failed to process receipt: ${upstream}` });

  } finally {
    // Always clean up the temp file to avoid disk bloat
    fs.unlink(tempPath, () => {});
  }
}

module.exports = { scanReceipt };
