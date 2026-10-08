import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Evidence from './pages/Evidence';
import Verification from './pages/Verification';
import ChainOfCustody from './pages/ChainOfCustody';
import AuditLogs from './pages/AuditLogs';
import Investigators from './pages/Investigators';
import Reports from './pages/Reports';

function MainLayout() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'cases':
        return <Cases onNavigate={setCurrentPage} />;
      case 'evidence':
        return <Evidence onNavigate={setCurrentPage} />;
      case 'verification':
        return <Verification />;
      case 'custody':
        return <ChainOfCustody />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'investigators':
        return <Investigators />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070c18] text-slate-100 selection:bg-cyan-500/30">
      <Navbar onNavigate={setCurrentPage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950/40">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
