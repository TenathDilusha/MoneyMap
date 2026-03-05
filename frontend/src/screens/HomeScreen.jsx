import { useState, useEffect, useCallback } from 'react';
import BalanceCard from '../components/BalanceCard';
import TransactionsList from '../components/TransactionsList';
import PieChartComponent from '../components/PieChartComponent';
import AnalyticsCard from '../components/AnalyticsCard';
import AddTransactionModal from '../components/AddTransactionModal';
import ReceiptScanModal from '../components/ReceiptScanModal';
import {
  getTransactions, getSummary, getCategoryBreakdown, getMonthlyData, fmt,
} from '../services/api';

export default function HomeScreen({ onNavigate }) {
  const [modal,        setModal]        = useState(false);   // add-transaction modal
  const [receiptModal, setReceiptModal] = useState(false);   // receipt scan modal
  // Pre-filled initial data passed from receipt scan → add-transaction modal
  const [receiptInitial, setReceiptInitial] = useState(null);
  const [transactions, setTxns]     = useState([]);
  const [loading, setLoading]       = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTxns(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const summary   = getSummary(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const monthly   = getMonthlyData(transactions);
  const recent    = transactions.slice(0, 5);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Receipt scan → auto-fill transaction */}
          <button className="btn btn-receipt" onClick={() => setReceiptModal(true)}>
            🧾 Add Receipt
          </button>
          {/* Manual transaction entry */}
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            + Add Transaction
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading…</div>
      ) : (
        <>
          <BalanceCard summary={summary} />
          <div className="grid-7-5" style={{ marginBottom: 24 }}>
            <AnalyticsCard monthlyData={monthly} />
            <PieChartComponent breakdown={breakdown} />
          </div>
          <div className="card">
            <div className="transactions-header">
              <div>
                <div className="card-title" style={{ marginBottom: 2 }}>Recent Transactions</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest 5 entries</div>
              </div>
              <button
                className="btn btn-outline"
                style={{ fontSize: 12, padding: '6px 12px' }}
                onClick={() => onNavigate?.('expenses')}
              >
                View All
              </button>
            </div>
            <TransactionsList transactions={recent} onDelete={loadData} />
          </div>
        </>
      )}

      {/* Standard add-transaction modal (also used after receipt scan) */}
      {modal && (
        <AddTransactionModal
          onClose={() => { setModal(false); setReceiptInitial(null); }}
          onAdded={loadData}
          initial={receiptInitial}
        />
      )}

      {/* Receipt scan modal */}
      {receiptModal && (
        <ReceiptScanModal
          onClose={() => setReceiptModal(false)}
          onConfirm={data => {
            setReceiptModal(false);
            if (data) {
              // Map scanned receipt data → AddTransactionModal's expected shape
              setReceiptInitial({
                type: 'expense',
                description: data.storeName || '',
                amount: data.total ? String(data.total) : '',
                date: data.date || '',
                category: 'shopping',  // sensible default; user can change it
              });
            }
            // Open the transaction modal pre-filled (or blank for manual)
            setModal(true);
          }}
        />
      )}
    </div>
  );
}
