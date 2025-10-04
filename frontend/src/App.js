import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import useIdleTimeout from "./hooks/useIdleTimeout";
import { supabase } from "./utils/wallet";

// Create a wrapper component to use hooks inside BrowserRouter
function AppContent() {
  const navigate = useNavigate();

  const handleIdle = async () => {
    console.log('User is idle. Logging out.');
    
    // Get user ID before signing out to clean up their history
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.auth.signOut();
    
    // Clean up user-specific history from localStorage
    if (user) {
      const HISTORY_KEY = `sentry_history_${user.id}`;
      localStorage.removeItem(HISTORY_KEY);
    }
    
    navigate('/login'); // Redirect to login page
  };

  // Call the hook to start the timer (10 minutes = 600000 ms)
  useIdleTimeout(handleIdle, 600000);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<TransactionHistoryPage />} />
      <Route path="/settings" element={<UserSettingsPage />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;