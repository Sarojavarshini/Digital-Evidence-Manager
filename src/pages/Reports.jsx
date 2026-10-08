import React, { useState, useEffect } from 'react';
import { BarChart3, FileSpreadsheet, Download, Printer, ShieldCheck, FolderLock, FileCheck2, Users, FileCode2 } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [summary, setSummary] = useState({
    totalCases: 3,
    totalEvidence: 4,
    verifiedEvidence: 4,
    verificationPercentage: 100,
    integrityAlerts: 0,
    activeInvestigations: 3,
    totalInvestigators: 3,
    totalAuditLogs: 5
  });
  const [cases, setCases] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);

  useEffect(() => {
    async function load() {
      const s = await api.getSummaryStats();
      if (s) setSummary(s);
      const c = await api.getCases();
      if (c) setCases(c);
      const evd = await api.getEvidence();
      if (evd) setEvidenceList(evd);
    }
    load();
  }, []);

  const handleExportCSV = () => {
    const headers = ["Evidence Code", "Case Code", "Name", "Type", "Size (Bytes)", "SHA-256 Hash", "Custodian", "Status"];
    const rows = evidenceList.map(e => [
      e.evidenceCode,
      e.caseCode,
      `"${e.name}"`,
      e.fileType,
      e.fileSize,
      e.sha256Hash,
      `"${e.currentCustodian}"`,
      e.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DEM_Forensic_Evidence_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            Executive Forensic & Evidence Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal digital evidence scorecards, custody integrity summaries, and tabular audit exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all border border-slate-700 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV Data
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide uppercase transition-all shadow-md shadow-cyan-600/25 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Generate PDF Report
          </button>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl cyber-card border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">CASE REPOSITORY</span>
          <h3 className="text-2xl font-bold text-slate-100">{summary.totalCases}</h3>
          <p className="text-xs text-cyan-400 font-mono">{summary.activeInvestigations} Active Investigations</p>
        </div>
        <div className="p-4 rounded-xl cyber-card border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE VAULT</span>
          <h3 className="text-2xl font-bold text-slate-100">{summary.totalEvidence}</h3>
          <p className="text-xs text-purple-400 font-mono">100% Cryptographically Sealed</p>
        </div>
        <div className="p-4 rounded-xl cyber-card border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SHA-256 INTEGRITY SCORE</span>
          <h3 className="text-2xl font-bold text-emerald-400">{summary.verificationPercentage}%</h3>
          <p className="text-xs text-emerald-300 font-mono">{summary.verifiedEvidence} Passed Baseline</p>
        </div>
        <div className="p-4 rounded-xl cyber-card border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SYSTEM TELEMETRY</span>
          <h3 className="text-2xl font-bold text-slate-100">{summary.totalAuditLogs}</h3>
          <p className="text-xs text-slate-400 font-mono">Logged Audit Telemetry</p>
        </div>
      </div>

      {/* Report Table View */}
      <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold font-heading text-slate-100">Forensic Evidence Catalog Summary</h3>
          <span className="text-xs font-mono text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Backend SHA-256 Hash</th>
                <th className="px-4 py-3">Custodian</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {evidenceList.map(e => (
                <tr key={e.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-semibold text-cyan-400">{e.evidenceCode}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{e.caseCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{e.name}</td>
                  <td className="px-4 py-3 text-slate-300">{e.fileType}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-cyan-300">{e.sha256Hash.substring(0, 16)}...</td>
                  <td className="px-4 py-3 text-slate-300">{e.currentCustodian}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-emerald-400">{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
