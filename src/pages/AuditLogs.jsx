import React, { useState, useEffect } from 'react';
import { FileCode2, Search, Filter, ShieldAlert, RefreshCw, Calendar, User, Terminal } from 'lucide-react';
import { api } from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const data = await api.getAuditLogs();
    if (data) setLogs(data);
  }

  const actionsList = ['LOGIN', 'LOGOUT', 'UPLOAD', 'VIEW', 'DOWNLOAD', 'VERIFY', 'TRANSFER', 'UPDATE', 'DELETE', 'INTEGRITY_ALERT'];

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.evidenceCode && l.evidenceCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (l.caseCode && l.caseCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = selectedAction === 'ALL' || l.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <FileCode2 className="w-7 h-7 text-cyan-400" />
            System Audit Telemetry Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system logs tracking every user authentication, evidence access, transfer, and integrity verification.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Logs
        </button>
      </div>

      {/* Search and Filters */}
      <div className="cyber-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search User, IP Address, Action, or Description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Event Actions</option>
            {actionsList.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Telemetry Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">User & Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Telemetry Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-all font-sans">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-100">{log.username}</div>
                    <div className="text-[10px] font-mono text-slate-500">{log.role || 'USER'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      log.action === 'UPLOAD' ? 'badge-cyan' :
                      log.action === 'VERIFY' ? 'badge-green' :
                      log.action === 'INTEGRITY_ALERT' ? 'badge-red' :
                      log.action === 'TRANSFER' ? 'badge-amber' :
                      log.action === 'DELETE' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-400 whitespace-nowrap">
                    {log.evidenceCode || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                    {log.caseCode || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.ipAddress || '192.168.1.104'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {log.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
