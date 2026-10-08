import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-200',
    info: 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-200'
  };

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertTriangle : Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${typeStyles[toast.type] || typeStyles.info}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-medium font-sans">{toast.message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
