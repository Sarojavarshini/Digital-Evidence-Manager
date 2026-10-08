import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Clock, Bell, UserCheck, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate }) {
  const { user, logout, loginAsAdmin, loginAsInvestigator, isAdmin } = useAuth();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg text-slate-100 tracking-wide">DIGITAL EVIDENCE MANAGER</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              SPRING BOOT v3.2
            </span>
          </div>
          <p className="text-xs text-slate-400">Forensic Integrity & Custody Vault</p>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-4">
        {/* System Time & Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SYS UTC: {time}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
        </div>

        {/* Quick Role Switcher for Presentation Demo */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={loginAsInvestigator}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${!isAdmin ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Investigator View
          </button>
          <button
            onClick={loginAsAdmin}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${isAdmin ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Admin View
          </button>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isAdmin ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40' : 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40'}`}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">{user?.fullName}</div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-purple-400' : 'bg-cyan-400'}`} />
                {user?.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-medium text-slate-200 truncate">{user?.email}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user?.department}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setShowDropdown(false); onNavigate('investigators'); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  Investigator Roster
                </button>
                <button
                  onClick={() => { setShowDropdown(false); logout(); onNavigate('login'); }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
