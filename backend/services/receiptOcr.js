/**
 * In-process receipt OCR using the system Tesseract binary.
 */

const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const PRICE_RE = /(?:[\$£€]\s*)?(\d+\.\d{2})\s*$/;
const DATE_RE = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\w+ \d{1,2},?\s*\d{4})\b/i;
const TOTAL_RE = /\b(sub\s?total|subtotal|tax|vat|gst|tip|total|grand\s?total|balance|amount\s?due|change|cash|discount)\b/i;

async function runOcr(imagePath) {
  const { stdout } = await execFileAsync(
    'tesseract',
    [imagePath, 'stdout', '-l', 'eng', '--oem', '3', '--psm', '4'],
    { maxBuffer: 10 * 1024 * 1024 },
  );
  return stdout;
}

function parseReceipt(raw) {
  const lines = raw
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  let date = '';
  let dateLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(DATE_RE);
    if (m) {
      date = m[0];
      dateLineIdx = i;
      break;
    }
  }

  const items = [];
  let total = '';
  let bestTotalVal = -1;

  for (const line of lines) {
    const priceM = line.match(PRICE_RE);
    if (!priceM) continue;

    const priceStr = priceM[1];
    const priceVal = parseFloat(priceStr);

    if (TOTAL_RE.test(line)) {
      if (priceVal > bestTotalVal) {
        bestTotalVal = priceVal;
        total = priceStr;
      }
      continue;
    }

    let name = line.replace(PRICE_RE, '').trim();
    name = name.replace(/[\$£€]\s*$/, '').trim();
    name = name.replace(/\s{2,}/g, ' ');

    if (name.length > 1) {
      items.push({ name, price: priceStr });
    }
  }

  const stop = Math.min(dateLineIdx !== -1 ? dateLineIdx : 3, 3);
  const storeLines = lines
    .slice(0, stop)
    .filter((l) => !PRICE_RE.test(l) && !DATE_RE.test(l));
  const storeName = storeLines.join(' ').trim() || 'Unknown Store';

  if (!total && items.length) {
    total = items.reduce((sum, it) => sum + parseFloat(it.price), 0).toFixed(2);
  }

  return {
    storeName,
    date,
    total,
    items,
    rawText: raw.slice(0, 2000),
  };
}

async function scanReceiptImage(imagePath) {
  const rawText = await runOcr(imagePath);
  return parseReceipt(rawText);
}

module.exports = { scanReceiptImage, parseReceipt, runOcr };
