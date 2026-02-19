import { deleteTransaction, CATEGORY_META, fmt, fmtDate } from '../services/api';

export default function TransactionsList({ transactions, onDelete, limit }) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <div className="empty-state-text">No transactions found</div>
      </div>
    );
  }

  function handleDelete(id) {
    deleteTransaction(id);
    onDelete?.();
  }

  return (
    <div>
      {items.map(tx => {
        const meta = CATEGORY_META[tx.category] || CATEGORY_META.other;
        return (
          <div key={tx.id} className="transaction-item">
            <div className={`transaction-icon ${meta.css}`}>
              {meta.emoji}
            </div>
            <div className="transaction-info">
              <div className="transaction-name">{tx.description}</div>
              <div className="transaction-meta">
                {meta.label} &nbsp;·&nbsp; {fmtDate(tx.date)}
              </div>
            </div>
            <span className={`transaction-amount ${tx.type}`}>
              {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
            </span>
            <button
              className="transaction-delete"
              onClick={() => handleDelete(tx.id)}
              title="Delete"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
