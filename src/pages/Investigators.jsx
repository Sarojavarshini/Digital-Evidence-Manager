import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, Building, Plus, X, Power, Edit3 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Investigators() {
  const { user, isAdmin } = useAuth();
  const [investigators, setInvestigators] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDept, setFormDept] = useState('Digital Forensics Unit');
  const [formRole, setFormRole] = useState('Senior Investigator');

  useEffect(() => {
    loadInvestigators();
  }, []);

  async function loadInvestigators() {
    const data = await api.getInvestigators();
    if (data) setInvestigators(data);
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await api.addInvestigator({
      name: formName,
      email: formEmail,
      department: formDept,
      role: formRole
    }, user?.email || 'admin@dem.gov');

    setShowAddModal(false);
    setFormName('');
    setFormEmail('');
    loadInvestigators();
  };

  const handleToggleStatus = async (inv) => {
    const nextStatus = inv.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await api.updateInvestigatorStatus(inv.id, nextStatus, user?.email || 'admin@dem.gov');
    loadInvestigators();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl cyber-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <Users className="w-7 h-7 text-purple-400" />
              Investigator Roster & Personnel
            </h1>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 text-[10px] font-mono border border-purple-800">
              ADMINISTRATOR CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized forensic personnel, active case loads, and security clearance status.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add Investigator
          </button>
        )}
      </div>

      {/* Investigators Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Investigator ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role / Designation</th>
                <th className="px-4 py-3">Assigned Cases</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {investigators.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="px-4 py-3 font-mono font-semibold text-purple-400">{inv.investigatorCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                      {inv.name.charAt(0)}
                    </div>
                    <span>{inv.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono">{inv.email}</td>
                  <td className="px-4 py-3 text-slate-400">{inv.department}</td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{inv.role}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-cyan-400">{inv.assignedCasesCount || 0} Cases</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      inv.status === 'ACTIVE' ? 'badge-green' : 'badge-red'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isAdmin ? (
                      <button
                        onClick={() => handleToggleStatus(inv)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all inline-flex items-center gap-1 ${
                          inv.status === 'ACTIVE'
                            ? 'bg-rose-950/60 hover:bg-rose-900 border-rose-800 text-rose-300'
                            : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {inv.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Investigator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="cyber-card p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Register New Investigator
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Det. Alex Rivera"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Agency Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="alex.rivera@dem.gov"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Department / Division</label>
                <input
                  type="text"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role Designation</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 shadow-md shadow-purple-600/20"
                >
                  Add Investigator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
