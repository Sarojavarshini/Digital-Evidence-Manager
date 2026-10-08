import React, { useState, useEffect } from 'react';
import { GitCommit, Search, ShieldCheck, User, Calendar, FileText, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function ChainOfCustody() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [custodyChain, setCustodyChain] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await api.getEvidence();
      if (data && data.length > 0) {
        setEvidenceList(data);
        setSelectedId(String(data[0].id));
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function fetchChain() {
      if (!selectedId) return;
      const chain = await api.getCustodyChain(selectedId);
      if (chain) setCustodyChain(chain);
    }
    fetchChain();
  }, [selectedId]);

  const selectedEvidence = evidenceList.find(e => String(e.id) === String(selectedId));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <GitCommit className="w-7 h-7 text-cyan-400" />
            Chain of Custody Audit Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit trail tracking physical and digital evidence transfers, reviews, and SHA-256 verification stamps.
          </p>
        </div>

        {/* Evidence Selection Selector */}
        <div className="w-full md:w-80">
          <label className="block text-[11px] font-mono text-slate-400 mb-1">Select Evidence Artifact</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            {evidenceList.map(e => (
              <option key={e.id} value={e.id}>
                {e.evidenceCode} - {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEvidence && (
        <div className="p-4 rounded-2xl cyber-card border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">EVIDENCE IDENTIFIER</span>
            <span className="font-bold text-cyan-400 font-mono text-sm">{selectedEvidence.evidenceCode}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">FILE NAME</span>
            <span className="font-medium text-slate-200">{selectedEvidence.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">CURRENT CUSTODIAN</span>
            <span className="font-semibold text-amber-400">{selectedEvidence.currentCustodian}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">BASELINE SHA-256</span>
            <span className="font-mono text-cyan-300 text-[11px]">{selectedEvidence.sha256Hash.substring(0, 16)}...</span>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="cyber-card p-8 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold font-heading text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          Custody Lifecycle Timeline ({custodyChain.length} Events Logged)
        </h3>

        {custodyChain.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No custody events recorded for this artifact.</div>
        ) : (
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pl-6">
            {custodyChain.map((event, index) => (
              <div key={event.id || index} className="relative group">
                {/* Timeline Dot Icon */}
                <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-xl flex items-center justify-center border text-xs ${
                  index === custodyChain.length - 1
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                  <GitCommit className="w-4 h-4" />
                </div>

                {/* Event Card */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{event.action}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-800">
                        STEP #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">PERFORMED BY</span>
                      <span className="text-slate-200 font-medium">{event.userName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CUSTODY TRANSFER</span>
                      <div className="flex items-center gap-1 text-slate-300 font-medium">
                        <span>{event.previousCustodian || 'N/A'}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-300">{event.newCustodian || event.userName}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SHA-256 INTEGRITY STAMP</span>
                      <span className="font-mono text-[11px] text-cyan-400 truncate block">
                        {event.sha256Stamp ? event.sha256Stamp.substring(0, 16) + '...' : 'Intact'}
                      </span>
                    </div>
                  </div>

                  {event.remarks && (
                    <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-sans italic">
                      "{event.remarks}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
