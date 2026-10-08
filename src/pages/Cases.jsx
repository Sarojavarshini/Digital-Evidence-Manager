import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  FileCheck2, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle, 
  X, 
  CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Cases({ onNavigate }) {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Cybercrime',
    priority: 'HIGH',
    status: 'Active',
    investigatorName: user?.fullName || 'Det. Sarah Jenkins'
  });

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    const data = await api.getCases();
    if (data) setCases(data);
    const evd = await api.getEvidence();
    if (evd) setEvidenceList(evd);
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await api.createCase(formData);
    setShowCreateModal(false);
    setFormData({
      name: '',
      description: '',
      type: 'Cybercrime',
      priority: 'HIGH',
      status: 'Active',
      investigatorName: user?.fullName || 'Det. Sarah Jenkins'
    });
    loadCases();
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.investigatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || c.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const caseTypes = ['Cybercrime', 'Fraud', 'Unauthorized Access', 'Data Theft', 'Harassment', 'Other'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-cyan-400" />
            Case Management Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track digital forensics investigation cases, assign leads, and monitor evidence volume.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-600/25 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Case
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID, Title, or Investigator..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              {caseTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Case Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Investigator</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Evidence</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="px-4 py-3 font-mono font-semibold text-cyan-400">{c.caseCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{c.investigatorName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      c.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      c.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.status === 'Active' ? 'badge-cyan' :
                      c.status === 'Under Investigation' ? 'badge-amber' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-purple-400">
                    {c.evidenceCount || 0} Files
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedCase(c)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-all inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-cyan-400" />
                Register New Forensic Case
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Case Name / Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Unauthorized Database Intrusion Incident"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Case Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide forensic context, incident scope, and target systems..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Case Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    {caseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Investigator</label>
                  <input
                    type="text"
                    value={formData.investigatorName}
                    onChange={(e) => setFormData({ ...formData, investigatorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500 shadow-md shadow-cyan-600/20"
                >
                  Create Case Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedCase.caseCode}</span>
                <h2 className="text-lg font-bold font-heading text-slate-100">{selectedCase.name}</h2>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CASE TYPE</span>
                <span className="text-slate-200 font-semibold">{selectedCase.type}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PRIORITY</span>
                <span className="text-rose-400 font-semibold">{selectedCase.priority}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">STATUS</span>
                <span className="text-cyan-400 font-semibold">{selectedCase.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LEAD INVESTIGATOR</span>
                <span className="text-slate-200 font-semibold">{selectedCase.investigatorName}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedCase.description || 'No detailed case notes specified.'}
              </p>
            </div>

            {/* Associated Evidence Files */}
            <div>
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Associated Evidence Files ({evidenceList.filter(e => e.caseCode === selectedCase.caseCode).length})</span>
                <button
                  onClick={() => { setSelectedCase(null); onNavigate('evidence'); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  + Upload New Evidence
                </button>
              </h4>
              <div className="space-y-2">
                {evidenceList.filter(e => e.caseCode === selectedCase.caseCode).map(evd => (
                  <div key={evd.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-cyan-400 font-semibold">{evd.evidenceCode}</span>
                      <span className="text-slate-200 font-medium ml-2">{evd.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{evd.sha256Hash.substring(0, 16)}...</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
