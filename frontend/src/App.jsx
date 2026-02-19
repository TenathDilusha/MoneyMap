import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import TotalExpenseScreen from './screens/TotalExpenseScreen';

export default function App() {
  const [page, setPage] = useState('home');

  function renderPage() {
    switch (page) {
      case 'home':      return <HomeScreen onNavigate={setPage} />;
      case 'expenses':  return <ExpensesScreen />;
      case 'analytics': return <TotalExpenseScreen />;
      default:          return <HomeScreen onNavigate={setPage} />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
