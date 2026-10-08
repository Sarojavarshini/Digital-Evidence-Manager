import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'cyan', subtext }) {
  const colorStyles = {
    cyan: {
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      text: 'text-cyan-400',
    },
    emerald: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      text: 'text-amber-400',
    },
    rose: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      text: 'text-rose-400',
    },
    purple: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      text: 'text-purple-400',
    }
  };

  const style = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`p-5 rounded-2xl cyber-card cyber-card-hover ${style.bg} border ${style.border} flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold font-heading text-slate-100 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {subtext && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">{subtext}</span>
          {trend && <span className={`font-mono font-semibold ${style.text}`}>{trend}</span>}
        </div>
      )}
    </div>
  );
}
