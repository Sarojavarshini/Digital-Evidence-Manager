import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  FileCheck2, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  FileCode2, 
  RefreshCw 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalCases: 3,
    totalEvidence: 4,
    verifiedEvidence: 4,
    verificationPercentage: 100,
    integrityAlerts: 0,
    activeInvestigations: 3
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const s = await api.getSummaryStats();
      if (s) setStats(s);
      const logs = await api.getAuditLogs();
      if (logs) setRecentLogs(logs.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  // Chart Demo Data
  const evidenceTypeData = [
    { name: 'Document', value: 1, color: '#06b6d4' },
    { name: 'Video', value: 1, color: '#3b82f6' },
    { name: 'Archive', value: 1, color: '#a855f7' },
    { name: 'Log File', value: 1, color: '#10b981' }
  ];

  const caseStatusData = [
    { status: 'Active', count: 2 },
    { status: 'Under Investigation', count: 1 },
    { status: 'Closed', count: 0 }
  ];

  const uploadTimelineData = [
    { date: 'Sep 12', count: 2 },
    { date: 'Sep 15', count: 1 },
    { date: 'Sep 18', count: 1 },
    { date: 'Sep 25', count: 1 },
    { date: 'Oct 08', count: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-100">Forensic Telemetry Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM SECURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time status of active cases, evidence vaults, and SHA-256 integrity scorecards.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('evidence')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide uppercase transition-all shadow-md shadow-cyan-600/20 flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            Upload Evidence
          </button>
          <button
            onClick={() => onNavigate('verification')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all border border-slate-700 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verify SHA-256
          </button>
        </div>
      </div>

      {/* High Impact Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={FolderLock}
          color="cyan"
          subtext="Active Investigations"
          trend={`${stats.activeInvestigations} Active`}
        />
        <StatCard
          title="Total Evidence"
          value={stats.totalEvidence}
          icon={FileCheck2}
          color="purple"
          subtext="Stored Artifacts"
          trend="100% Vaulted"
        />
        <StatCard
          title="Verified Integrity"
          value={`${stats.verificationPercentage}%`}
          icon={ShieldCheck}
          color="emerald"
          subtext="SHA-256 Match Rate"
          trend={`${stats.verifiedEvidence} Passed`}
        />
        <StatCard
          title="Integrity Alerts"
          value={stats.integrityAlerts}
          icon={ShieldAlert}
          color={stats.integrityAlerts > 0 ? "rose" : "emerald"}
          subtext="Hash Mismatches"
          trend={stats.integrityAlerts > 0 ? "ACTION REQUIRED" : "None Detected"}
        />
        <StatCard
          title="Active Investigations"
          value={stats.activeInvestigations}
          icon={Activity}
          color="amber"
          subtext="Under Analysis"
          trend="In Progress"
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence By Type Chart */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold font-heading text-slate-100">Evidence Distribution</h3>
              <p className="text-[11px] text-slate-400">Categorized by file classification</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">TYPES</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={evidenceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {evidenceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80">
            {evidenceTypeData.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name}
                </span>
                <span className="font-mono font-semibold text-slate-200">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cases By Status Bar Chart */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold font-heading text-slate-100">Cases by Lifecycle Status</h3>
              <p className="text-[11px] text-slate-400">Active vs Closed breakdown</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">CASES</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseStatusData}>
                <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Active Cases: <strong className="text-cyan-400 font-mono">3</strong></span>
            <span>Closed Cases: <strong className="text-slate-200 font-mono">0</strong></span>
          </div>
        </div>

        {/* Upload Timeline Line Chart */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold font-heading text-slate-100">Evidence Upload Velocity</h3>
              <p className="text-[11px] text-slate-400">Telemetry count over timeline</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">TIMELINE</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadTimelineData}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Peak Upload Rate: <strong className="text-purple-400 font-mono">2 files/day</strong></span>
            <span className="text-[11px] text-slate-500">Auto Synced</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Stream & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 cyber-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold font-heading text-slate-100">Recent Audit & Custody Activity</h3>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              View Full Audit Logs
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-mono text-slate-500 uppercase bg-slate-950/60 border-y border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Time</th>
                  <th className="px-3 py-2.5">User</th>
                  <th className="px-3 py-2.5">Action</th>
                  <th className="px-3 py-2.5">Target</th>
                  <th className="px-3 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-all font-sans">
                    <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-200 whitespace-nowrap">{log.username}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        log.action === 'UPLOAD' ? 'badge-cyan' :
                        log.action === 'VERIFY' ? 'badge-green' :
                        log.action === 'INTEGRITY_ALERT' ? 'badge-red' :
                        log.action === 'TRANSFER' ? 'badge-amber' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-cyan-400 whitespace-nowrap">
                      {log.evidenceCode || log.caseCode || 'SYSTEM'}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 truncate max-w-xs">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Health & Engine Info */}
        <div className="cyber-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-heading text-slate-100">Cryptographic Engine</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>AUTHORITY:</span>
                <span className="text-cyan-400 font-bold">JAVA Messagedigest</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ALGORITHM:</span>
                <span className="text-emerald-400 font-bold">SHA-256 (64 hex)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ENCRYPTION:</span>
                <span className="text-purple-400 font-bold">AES-256-CBC</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>DATABASE:</span>
                <span className="text-slate-200">MySQL / JPA Hibernate</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
              <p className="font-semibold text-cyan-400">College Demo Feature:</p>
              <p className="text-[11px] text-cyan-300/80">
                Use the Verification page to test real-time SHA-256 checksum checks or activate "Simulate Tampering" for live red alert demonstration.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('verification')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Launch Integrity Workbench
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
