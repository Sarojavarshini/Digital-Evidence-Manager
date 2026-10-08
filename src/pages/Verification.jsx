import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileCode2, 
  Clock, 
  User, 
  Sliders, 
  Copy, 
  Check 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Verification() {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

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

  const handleRunVerification = async () => {
    if (!selectedId) return;
    setVerifying(true);
    setVerificationResult(null);

    // Call API with optional demo tampering toggle
    let res;
    if (simulateTamper) {
      res = await api.toggleTamperDemo(selectedId, true, user?.fullName || 'Det. Sarah Jenkins');
    } else {
      res = await api.verifyIntegrity(selectedId, user?.fullName || 'Det. Sarah Jenkins');
    }

    setVerificationResult(res);
    setVerifying(false);
  };

  const handleRestoreTamper = async () => {
    if (!selectedId) return;
    setVerifying(true);
    const res = await api.toggleTamperDemo(selectedId, false, user?.fullName || 'Det. Sarah Jenkins');
    setVerificationResult(res);
    setSimulateTamper(false);
    setVerifying(false);
  };

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(txt);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const selectedEvidence = evidenceList.find(e => String(e.id) === String(selectedId));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
              SHA-256 Integrity Verification Workbench
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-800">
              SPRING BOOT AUTHORITATIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recalculate cryptographic Java MessageDigest checksums in real-time and compare against baseline vault signatures.
          </p>
        </div>

        {/* Demo Mode Toggle Switch */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <Sliders className="w-4 h-4 text-purple-400" />
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-200">College Demo Tamper Simulation</p>
            <p className="text-[10px] text-slate-400">Test Red Alert Mismatch live</p>
          </div>
          <button
            onClick={() => setSimulateTamper(!simulateTamper)}
            className={`w-12 h-6 rounded-full transition-all relative p-1 ${simulateTamper ? 'bg-rose-600' : 'bg-slate-800'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${simulateTamper ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Main Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection & Controls Box */}
        <div className="cyber-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-semibold font-heading text-slate-100 border-b border-slate-800 pb-2">
            1. Select Evidence Artifact
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Choose Evidence Vault Record</label>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setVerificationResult(null); }}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {evidenceList.map(e => (
                <option key={e.id} value={e.id}>
                  {e.evidenceCode} - {e.name} ({e.fileType})
                </option>
              ))}
            </select>
          </div>

          {selectedEvidence && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>CASE ID:</span>
                <span className="font-mono text-cyan-400 font-semibold">{selectedEvidence.caseCode}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CUSTODIAN:</span>
                <span className="text-slate-200">{selectedEvidence.currentCustodian}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>FILE SIZE:</span>
                <span className="font-mono text-slate-200">{(selectedEvidence.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 block uppercase font-mono mb-1">Stored Baseline Hash:</span>
                <p className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900 p-2 rounded border border-slate-800/80">
                  {selectedEvidence.originalSha256Hash || selectedEvidence.sha256Hash}
                </p>
              </div>
            </div>
          )}

          {simulateTamper && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Simulated Tampering Active!</span>
              </div>
              <p className="text-[11px] text-rose-200/80">
                Running verification will generate an intentional hash mismatch to evaluate RED alert telemetry.
              </p>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <button
              onClick={handleRunVerification}
              disabled={verifying}
              className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                simulateTamper
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/25'
              }`}
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Computing Java SHA-256...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Execute Verification Check
                </>
              )}
            </button>

            {simulateTamper && (
              <button
                onClick={handleRestoreTamper}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Restore Original Intact Hash
              </button>
            )}
          </div>
        </div>

        {/* Result & Scorecard Screen */}
        <div className="lg:col-span-2 cyber-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-semibold font-heading text-slate-100 border-b border-slate-800 pb-2">
            2. Verification Results & Cryptographic Audit
          </h3>

          {!verificationResult ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-400">Select an evidence item and click "Execute Verification Check" to begin.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dynamic Status Banner */}
              {verificationResult.badgeColor === 'GREEN' ? (
                <div className="p-6 rounded-2xl badge-green border flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400">GREEN STATUS</span>
                    <h2 className="text-xl font-bold font-heading text-emerald-200">Evidence Verified</h2>
                    <p className="text-xs text-emerald-300 mt-1">File integrity is intact. Baseline SHA-256 matches computed Java hash 100%.</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl badge-red border flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                    <AlertTriangle className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-400">RED STATUS</span>
                    <h2 className="text-xl font-bold font-heading text-rose-200">Integrity Compromised</h2>
                    <p className="text-xs text-rose-300 mt-1">
                      The evidence file appears to have been modified! SHA-256 checksum mismatch detected. Security alert logged.
                    </p>
                  </div>
                </div>
              )}

              {/* Hash Comparison Table */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Cryptographic Hash Breakdown</h4>
                
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>ORIGINAL STORED HASH (BASELINE)</span>
                      <button onClick={() => copyText(verificationResult.originalHash)} className="hover:text-cyan-400">Copy</button>
                    </div>
                    <p className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 break-all">
                      {verificationResult.originalHash}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>CURRENT COMPUTED HASH (SPRING BOOT JAVA DIGEST)</span>
                      <button onClick={() => copyText(verificationResult.currentHash)} className="hover:text-cyan-400">Copy</button>
                    </div>
                    <p className={`p-2.5 rounded-lg bg-slate-900 border break-all ${
                      verificationResult.integrityIntact ? 'border-emerald-500/40 text-emerald-300' : 'border-rose-500/40 text-rose-300'
                    }`}>
                      {verificationResult.currentHash}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Metadata Footer */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VERIFIED BY</span>
                  <span className="text-slate-200">{verificationResult.verifiedBy || user?.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TIMESTAMP</span>
                  <span className="text-slate-200">
                    {new Date(verificationResult.verificationTime || Date.now()).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
