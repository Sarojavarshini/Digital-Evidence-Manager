import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  FileCheck2, 
  ShieldCheck, 
  GitCommit, 
  FileCode2, 
  Users, 
  BarChart3, 
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentPage, onNavigate }) {
  const { isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Management', icon: FolderLock },
    { id: 'evidence', label: 'Evidence Management', icon: FileCheck2 },
    { id: 'verification', label: 'SHA-256 Verification', icon: ShieldCheck, badge: 'JAVA 17' },
    { id: 'custody', label: 'Chain of Custody', icon: GitCommit },
    { id: 'audit-logs', label: 'Audit Telemetry', icon: FileCode2 },
    ...(isAdmin ? [{ id: 'investigators', label: 'Investigator Roster', icon: Users, badge: 'ADMIN' }] : []),
    { id: 'reports', label: 'Forensic Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="space-y-6">
        {/* Navigation Group Header */}
        <div>
          <h3 className="px-3 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Core Operations
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      item.badge === 'ADMIN' ? 'bg-purple-950 text-purple-400 border border-purple-800/60' : 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Security Status Footnote */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">ENGINE:</span>
          <span className="text-emerald-400 font-semibold">SPRING BOOT 3</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">HASH:</span>
          <span className="text-cyan-400 font-semibold">JAVA SHA-256</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">CIPHER:</span>
          <span className="text-purple-400 font-semibold">AES-256-CBC</span>
        </div>
      </div>
    </aside>
  );
}
