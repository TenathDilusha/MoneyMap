import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomeScreen from "./screens/HomeScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import TotalExpenseScreen from "./screens/TotalExpenseScreen";
import Profile from "./screens/Profile";

import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import AuthWrapper from "./components/AuthWrapper";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <AuthWrapper>
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/expenses" element={<ExpensesScreen />} />
                    <Route path="/analytics" element={<TotalExpenseScreen />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            </AuthWrapper>
          }
        />
      </Routes>
    </Router>
  );
}