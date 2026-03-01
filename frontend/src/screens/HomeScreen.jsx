import { useState, useCallback } from 'react';
import BalanceCard from '../components/BalanceCard';
import TransactionsList from '../components/TransactionsList';
import PieChartComponent from '../components/PieChartComponent';
import AnalyticsCard from '../components/AnalyticsCard';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  getTransactions, getSummary, getCategoryBreakdown, getMonthlyData, fmt,
} from '../services/api';

export default function HomeScreen({ onNavigate }) {
  const [modal, setModal]       = useState(false);
  const [refresh, setRefresh]   = useState(0);
  const reload = useCallback(() => setRefresh(r => r + 1), []);

  const transactions  = getTransactions();
  const summary       = getSummary(transactions);
  const breakdown     = getCategoryBreakdown(transactions);
  const monthly       = getMonthlyData(transactions);
  const recent        = transactions.slice(0, 5);

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

      {/* Key Stats */}
      <BalanceCard summary={summary} />

      {/* Charts Row */}
      <div className="grid-7-5" style={{ marginBottom: 24 }}>
        <AnalyticsCard monthlyData={monthly} />
        <PieChartComponent breakdown={breakdown} />
      </div>

      {/* Recent Transactions */}
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
        <TransactionsList transactions={recent} onDelete={reload} />
      </div>

      {modal && <AddTransactionModal onClose={() => setModal(false)} onAdded={reload} />}
    </div>
  );
}
