import { fmt } from '../services/api';

export default function BalanceCard({ summary }) {
  const { balance, income, expense } = summary;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <div className="summary-cards">
      {/* Balance */}
      <div className="summary-card balance">
        <div className="summary-card-icon">💰</div>
        <div className="summary-card-label">
          <span className="dot" />
          Net Balance
        </div>
        <div className={`summary-card-amount ${balance >= 0 ? 'green' : 'red'}`}>
          {fmt(balance)}
        </div>
        <div className="summary-card-change">
          Savings rate: <strong style={{ color: savingsRate >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {savingsRate}%
          </strong>
        </div>
      </div>

      {/* Income */}
      <div className="summary-card income">
        <div className="summary-card-icon">📈</div>
        <div className="summary-card-label">
          <span className="dot" />
          Total Income
        </div>
        <div className="summary-card-amount green">{fmt(income)}</div>
        <div className="summary-card-change">All income sources</div>
      </div>

      {/* Expense */}
      <div className="summary-card expense">
        <div className="summary-card-icon">📉</div>
        <div className="summary-card-label">
          <span className="dot" />
          Total Expenses
        </div>
        <div className="summary-card-amount red">{fmt(expense)}</div>
        <div className="summary-card-change">
          {income > 0
            ? `${Math.round((expense / income) * 100)}% of income spent`
            : 'No income recorded'}
        </div>
      </div>
    </div>
  );
}
