import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  UploadCloud, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  ShieldCheck, 
  ArrowRightLeft, 
  Trash2, 
  X, 
  FileText, 
  Copy, 
  Check, 
  FileCode, 
  ShieldAlert 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { calculateClientSHA256 } from '../services/cryptoService';

export default function Evidence({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const [evidenceList, setEvidenceList] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  
  // Modals State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [clientHash, setClientHash] = useState('');
  const [formCaseCode, setFormCaseCode] = useState('CASE-2026-001');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Document');
  const [formSource, setFormSource] = useState('Workstation WS-14');
  const [formLocation, setFormLocation] = useState('HQ Forensic Lab Desk 3');
  const [formDesc, setFormDesc] = useState('');

  // Transfer Form State
  const [transferTo, setTransferTo] = useState('Det. Marcus Vance');
  const [transferReason, setTransferReason] = useState('Escalated Forensic Analysis');
  const [transferNotes, setTransferNotes] = useState('');

  // Copy State
  const [copiedHash, setCopiedHash] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const evd = await api.getEvidence();
    if (evd) setEvidenceList(evd);
    const c = await api.getCases();
    if (c) setCasesList(c);
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (!formName) setFormName(file.name);
      // Client Web Crypto preview hash
      const hash = await calculateClientSHA256(file);
      setClientHash(hash);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (uploadFile) formData.append('file', uploadFile);
    formData.append('caseCode', formCaseCode);
    formData.append('name', formName);
    formData.append('fileType', formType);
    formData.append('sourceDevice', formSource);
    formData.append('collectionLocation', formLocation);
    formData.append('uploadedBy', user?.fullName || 'Det. Sarah Jenkins');
    formData.append('description', formDesc);
    formData.append('clientHash', clientHash);

    const res = await api.uploadEvidence(formData);
    setShowUploadModal(false);
    setUploadResult(res);
    setShowSuccessModal(true);
    
    // Reset Form
    setUploadFile(null);
    setClientHash('');
    setFormName('');
    loadData();
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferTarget) return;
    await api.transferEvidence(transferTarget.id, {
      newCustodian: transferTo,
      reason: transferReason,
      notes: transferNotes,
      transferredBy: user?.fullName || 'Det. Sarah Jenkins'
    });
    setShowTransferModal(false);
    setTransferTarget(null);
    loadData();
  };

  const handleDelete = async (evidenceId) => {
    if (window.confirm("Admin Security Action: Are you sure you want to purge this evidence file?")) {
      await api.deleteEvidence(evidenceId, user?.email || 'admin@dem.gov');
      loadData();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredEvidence = evidenceList.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.evidenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || e.fileType === selectedType;
    return matchesSearch && matchesType;
  });

  const evidenceTypes = ['Image', 'Video', 'Audio', 'Document', 'Email', 'Log File', 'Archive', 'Other'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
            Evidence Vault Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative Java SHA-256 evidence cataloging, custody management, and cryptographic seals.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-600/25 flex items-center gap-2 self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          Upload New Evidence
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Evidence ID, File Name, SHA-256 Hash..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">File Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Evidence Types</option>
            {evidenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Evidence Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Backend SHA-256 Checksum</th>
                <th className="px-4 py-3">Custodian</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredEvidence.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="px-4 py-3 font-mono font-semibold text-cyan-400">{e.evidenceCode}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{e.caseCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-100 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{e.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {e.fileType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 w-fit">
                      <span className="text-cyan-400">{e.sha256Hash.substring(0, 12)}...{e.sha256Hash.substring(56)}</span>
                      <button
                        onClick={() => copyToClipboard(e.sha256Hash)}
                        className="hover:text-cyan-300 text-slate-500 p-0.5"
                        title="Copy Full SHA-256"
                      >
                        {copiedHash === e.sha256Hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{e.currentCustodian}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      e.status === 'VERIFIED' ? 'badge-green' :
                      e.status === 'COMPROMISED' ? 'badge-red' : 'badge-amber'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEvidence(e)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        title="View Full Metadata"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate('verification')}
                        className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800"
                        title="Verify SHA-256 Integrity"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setTransferTarget(e); setShowTransferModal(true); }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
                        title="Transfer Custody"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800"
                          title="Purge Evidence (Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Evidence Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Upload & Seal Evidence
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Case</label>
                <select
                  value={formCaseCode}
                  onChange={(e) => setFormCaseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  {casesList.map(c => (
                    <option key={c.id} value={c.caseCode}>{c.caseCode} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">File Dropzone / Upload</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-cyan-950 file:text-cyan-300 file:font-semibold"
                />
              </div>

              {clientHash && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-mono block uppercase">Client UI SHA-256 Preview:</span>
                  <p className="font-mono text-[11px] text-slate-200 break-all">{clientHash}</p>
                  <span className="text-[9px] text-slate-500 block">
                    * Official authoritative SHA-256 checksum will be computed by Spring Boot Java MessageDigest upon server submission.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Evidence Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Memory_Dump_DB.raw"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Evidence Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    {evidenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source / Device</label>
                  <input
                    type="text"
                    required
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="e.g. Workstation Host WS-04"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Collection Location</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Room 402, Server Rack B"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Seizure remarks, warrant number..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500 shadow-md shadow-cyan-600/20"
                >
                  Register & Seal Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prominent Success Modal after Upload */}
      {showSuccessModal && uploadResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-emerald-500/40 max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-lg font-bold font-heading text-slate-100">Evidence Successfully Registered</h3>
            <p className="text-xs text-slate-300">{uploadResult.message}</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 font-mono text-xs">
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Authoritative Spring Boot Java SHA-256 Hash:</div>
              <p className="text-slate-100 break-all bg-slate-900 p-2 rounded border border-slate-800 text-[11px] font-bold">
                {uploadResult.authoritativeHash || uploadResult.evidence?.sha256Hash}
              </p>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>EVIDENCE ID: {uploadResult.evidence?.evidenceCode}</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
            >
              Acknowledge & Continue
            </button>
          </div>
        </div>
      )}

      {/* Transfer Custody Modal */}
      {showTransferModal && transferTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                Transfer Evidence Custody
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">TARGET EVIDENCE:</span>
                <p className="font-semibold text-cyan-400">{transferTarget.evidenceCode} - {transferTarget.name}</p>
                <p className="text-[11px] text-slate-400">Current Custodian: <strong className="text-slate-200">{transferTarget.currentCustodian}</strong></p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Transfer Custody To</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="Det. Marcus Vance">Det. Marcus Vance (Incident Response)</option>
                  <option value="Det. Sarah Jenkins">Det. Sarah Jenkins (Digital Forensics)</option>
                  <option value="Det. Elena Rostova">Det. Elena Rostova (Financial Crimes)</option>
                  <option value="Chief Inspector Cyber Warfare">Chief Inspector (Executive Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reason for Transfer</label>
                <input
                  type="text"
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Transfer Notes</label>
                <textarea
                  rows="2"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Additional handoff notes..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-500 shadow-md shadow-amber-600/20"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedEvidence.evidenceCode}</span>
                <h2 className="text-lg font-bold font-heading text-slate-100">{selectedEvidence.name}</h2>
              </div>
              <button onClick={() => setSelectedEvidence(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CASE CODE</span>
                <span className="text-slate-200 font-semibold">{selectedEvidence.caseCode}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FILE TYPE</span>
                <span className="text-cyan-400 font-semibold">{selectedEvidence.fileType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">FILE SIZE</span>
                <span className="text-slate-200 font-mono">{(selectedEvidence.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CURRENT CUSTODIAN</span>
                <span className="text-amber-400 font-semibold">{selectedEvidence.currentCustodian}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono block uppercase">Authoritative Backend SHA-256 Hash:</span>
              <p className="font-mono text-[11px] text-slate-100 break-all bg-slate-900 p-2 rounded border border-slate-800">
                {selectedEvidence.sha256Hash}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SOURCE DEVICE</span>
                <span className="text-slate-200">{selectedEvidence.sourceDevice}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">COLLECTION LOCATION</span>
                <span className="text-slate-200">{selectedEvidence.collectionLocation}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => { setSelectedEvidence(null); onNavigate('custody'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                View Custody Chain Timeline
              </button>
              <button
                onClick={() => { setSelectedEvidence(null); onNavigate('verification'); }}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500"
              >
                Verify SHA-256 Integrity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
