import os
import re
import io
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract

app = Flask(__name__)
CORS(app, origins=["http://localhost:5000"])

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def run_ocr(image_bytes: bytes) -> str:
    """Run Tesseract on raw image bytes and return the plain text."""
    img = Image.open(io.BytesIO(image_bytes))

    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    text = pytesseract.image_to_string(img, lang="eng", config="--oem 3 --psm 4")
    return text


def parse_receipt(raw: str) -> dict:
    lines = [l.strip() for l in raw.replace("\r", "").split("\n")]
    lines = [l for l in lines if l]

    PRICE_RE    = re.compile(r"(?:[\$£€]\s*)?(\d+\.\d{2})\s*$")
    DATE_RE     = re.compile(
        r"\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}"
        r"|\w+ \d{1,2},?\s*\d{4})\b", re.I
    )
    TOTAL_RE    = re.compile(
        r"\b(sub\s?total|subtotal|tax|vat|gst|tip|total"
        r"|grand\s?total|balance|amount\s?due|change|cash|discount)\b", re.I
    )

    date = ""
    date_line_idx = -1
    for i, line in enumerate(lines):
        m = DATE_RE.search(line)
        if m:
            date = m.group(0)
            date_line_idx = i
            break

    items = []
    total = ""
    best_total_val = -1.0

    for i, line in enumerate(lines):
        price_m = PRICE_RE.search(line)
        if not price_m:
            continue

        price_str = price_m.group(1)
        price_val = float(price_str)

        if TOTAL_RE.search(line):
            if price_val > best_total_val:
                best_total_val = price_val
                total = price_str
            continue

        name = PRICE_RE.sub("", line).strip()
        name = re.sub(r"[\$£€]\s*$", "", name).strip()
        name = re.sub(r"\s{2,}", " ", name)

        if len(name) > 1:
            items.append({"name": name, "price": price_str})

    stop = min(date_line_idx if date_line_idx != -1 else 3, 3)
    store_lines = [
        l for l in lines[:stop]
        if not PRICE_RE.search(l) and not DATE_RE.search(l)
    ]
    store_name = " ".join(store_lines).strip() or "Unknown Store"

    if not total and items:
        total = f"{sum(float(it['price']) for it in items):.2f}"

    return {
        "storeName": store_name,
        "date": date,
        "total": total,
        "items": items,
        "rawText": raw[:2000],  
    }

@app.route("/health", methods=["GET"])
def health():
    """Simple liveness check: GET /health → 200 OK"""
    return jsonify({"status": "ok"})


@app.route("/scan", methods=["POST"])
def scan():
    """
    POST /scan
    Multipart field: "receipt" (image file)
    Returns: JSON receipt structure
    """
    if "receipt" not in request.files:
        return jsonify({"error": "No 'receipt' file field in request."}), 400

    file = request.files["receipt"]

    if not file.mimetype.startswith("image/"):
        return jsonify({"error": "Uploaded file must be an image."}), 400

    image_bytes = file.read()
    if not image_bytes:
        return jsonify({"error": "Uploaded file is empty."}), 400

    try:
        log.info("Running OCR on %d bytes (%s)", len(image_bytes), file.filename)
        raw_text   = run_ocr(image_bytes)
        structured = parse_receipt(raw_text)
        log.info("OCR complete – found %d items, total=%s", len(structured["items"]), structured["total"])
        return jsonify(structured)
    except Exception as exc:
        log.exception("OCR failed")
        return jsonify({"error": f"OCR processing failed: {exc}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("OCR_PORT", 5001))
    log.info("OCR microservice starting on port %d", port)
    app.run(host="0.0.0.0", port=port, debug=False)
