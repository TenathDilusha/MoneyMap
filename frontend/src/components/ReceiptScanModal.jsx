/**
 * ReceiptScanModal.jsx
 *
 * Flow:
 *   1. User clicks "Add Receipt" → this modal opens (step = 'upload')
 *   2. User picks an image file  → preview shown, "Scan Receipt" button enabled
 *   3. User clicks "Scan Receipt" → image sent to POST /api/receipts/scan
 *   4. Backend returns structured data → step = 'review'
 *   5. User edits / adds / removes fields, then confirms
 *   6. onConfirm(data) is called so the parent can open AddTransactionModal
 *      pre-filled with the scanned values.
 */

import { useState, useRef } from 'react';
import axios from 'axios';

// ─── Axios instance matching the rest of the app ────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// ─── Small helpers ───────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);

/** Generate a stable local key for new list items */
let _uid = 0;
const uid = () => `item_${++_uid}`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function ReceiptScanModal({ onClose, onConfirm }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [step,      setStep]      = useState('upload');   // 'upload' | 'review'
  const [imageFile, setImageFile] = useState(null);       // File object
  const [preview,   setPreview]   = useState('');         // data-URL for <img>
  const [scanning,  setScanning]  = useState(false);
  const [error,     setError]     = useState('');

  // Editable receipt fields
  const [storeName, setStoreName] = useState('');
  const [date,      setDate]      = useState(today());
  const [total,     setTotal]     = useState('');
  const [items,     setItems]     = useState([]);         // [{ id, name, price }]

  const fileInputRef = useRef(null);

  // ── Image selection ────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject non-image files
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc.).');
      return;
    }

    setError('');
    setImageFile(file);

    // Create a local preview URL
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Allow drag-and-drop on the upload zone
  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Simulate a change event by directly setting
    const fakeEvt = { target: { files: [file] } };
    handleFileChange(fakeEvt);
  }

  // ── OCR scan ───────────────────────────────────────────────────────────────
  async function handleScan() {
    if (!imageFile) return;
    setScanning(true);
    setError('');

    try {
      // Build multipart form data
      const formData = new FormData();
      formData.append('receipt', imageFile);

      // POST to backend OCR endpoint
      const { data } = await api.post('/receipts/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Populate editable state with extracted values
      setStoreName(data.storeName || '');
      setDate(data.date          || today());
      setTotal(data.total        || '');
      // Give each item a local id for React key / removal tracking
      setItems(
        (data.items || []).map(it => ({ id: uid(), name: it.name, price: it.price }))
      );

      setStep('review');
    } catch (err) {
      console.error('Scan error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to scan receipt. Please try again or enter details manually.'
      );
    } finally {
      setScanning(false);
    }
  }

  // ── Item helpers ───────────────────────────────────────────────────────────
  function addItem() {
    setItems(prev => [...prev, { id: uid(), name: '', price: '' }]);
  }

  function updateItem(id, field, value) {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, [field]: value } : it))
    );
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  // ── Recalculate total from items ───────────────────────────────────────────
  function recalcTotal() {
    const sum = items.reduce((s, it) => s + (parseFloat(it.price) || 0), 0);
    setTotal(sum.toFixed(2));
  }

  // ── Confirm & pass to parent ───────────────────────────────────────────────
  function handleConfirm() {
    onConfirm?.({
      storeName,
      date,
      total: parseFloat(total) || 0,
      items,
    });
    onClose();
  }

  // ── Skip scan – just open add-transaction modal blank ──────────────────────
  function handleManual() {
    onConfirm?.(null);   // parent decides what to do with null
    onClose();
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal receipt-modal">

        {/* ── Header ── */}
        <div className="receipt-modal-header">
          <div className="receipt-modal-title">
            {step === 'upload' ? '🧾 Scan Receipt' : '📋 Receipt Details'}
          </div>
          <button className="receipt-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ════════════════ STEP 1 – UPLOAD ════════════════ */}
        {step === 'upload' && (
          <div className="receipt-upload-step">

            {/* Drop zone */}
            <div
              className={`receipt-dropzone ${preview ? 'has-preview' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="Receipt preview" className="receipt-preview-img" />
              ) : (
                <>
                  <div className="receipt-dropzone-icon">📷</div>
                  <div className="receipt-dropzone-text">
                    <strong>Click to upload</strong> or drag &amp; drop here
                  </div>
                  <div className="receipt-dropzone-hint">JPG, PNG, WEBP – max 10 MB</div>
                </>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {preview && (
              <button
                className="btn btn-outline receipt-change-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                🔄 Change Image
              </button>
            )}

            {error && <div className="receipt-error">⚠ {error}</div>}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleScan}
                disabled={!imageFile || scanning}
                style={{ flex: 1 }}
              >
                {scanning ? '🔍 Scanning…' : '🔍 Scan Receipt'}
              </button>
              <button className="btn btn-outline" onClick={handleManual}>
                Enter Manually
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 2 – REVIEW / EDIT ════════════════ */}
        {step === 'review' && (
          <div className="receipt-review-step">

            {/* Store + Date row */}
            <div className="receipt-grid-2">
              <div className="form-row">
                <label className="form-label">Store / Merchant</label>
                <input
                  className="form-input"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="Store name"
                />
              </div>
              <div className="form-row">
                <label className="form-label">Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Items table */}
            <div className="form-row">
              <div className="receipt-items-header">
                <label className="form-label" style={{ margin: 0 }}>Items</label>
                <button className="btn btn-outline receipt-add-item-btn" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              {items.length === 0 && (
                <div className="receipt-empty-items">No items extracted – add them manually.</div>
              )}

              <div className="receipt-items-list">
                {items.map(item => (
                  <div key={item.id} className="receipt-item-row">
                    <input
                      className="form-input receipt-item-name"
                      placeholder="Item name"
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                    />
                    <div className="receipt-item-price-wrap">
                      <span className="receipt-dollar">$</span>
                      <input
                        className="form-input receipt-item-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', e.target.value)}
                      />
                    </div>
                    <button
                      className="receipt-remove-btn"
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total row */}
            <div className="receipt-total-row">
              <div className="form-row" style={{ flex: 1 }}>
                <label className="form-label">Total Amount ($)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <button
                className="btn btn-outline receipt-recalc-btn"
                onClick={recalcTotal}
                title="Recalculate total from items"
              >
                ∑ Recalc
              </button>
            </div>

            {error && <div className="receipt-error">⚠ {error}</div>}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleConfirm}
              >
                ✅ Use This Data
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setStep('upload')}
              >
                ← Re-scan
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
