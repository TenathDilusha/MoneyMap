import { useState, useEffect, useCallback } from 'react';
import BalanceCard from '../components/BalanceCard';
import TransactionsList from '../components/TransactionsList';
import PieChartComponent from '../components/PieChartComponent';
import AnalyticsCard from '../components/AnalyticsCard';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  getTransactions, getSummary, getCategoryBreakdown, getMonthlyData, fmt,
} from '../services/api';

export default function HomeScreen({ onNavigate }) {
  const [modal, setModal]           = useState(false);
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
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          + Add Transaction
        </button>
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

      {modal && <AddTransactionModal onClose={() => setModal(false)} onAdded={loadData} />}
    </div>
  );
}
