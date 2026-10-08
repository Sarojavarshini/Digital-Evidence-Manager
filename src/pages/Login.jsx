import React, { useState } from 'react';
import { Shield, Lock, Mail, UserCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onLoginSuccess }) {
  const { login, loginAsAdmin, loginAsInvestigator } = useAuth();
  const [email, setEmail] = useState('sarah.jenkins@dem.gov');
  const [password, setPassword] = useState('investigator123');
  const [role, setRole] = useState('INVESTIGATOR');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password, role });
      onLoginSuccess();
    } catch (err) {
      setError('Invalid credentials or role authorization error.');
    }
  };

  const handleQuickAdmin = () => {
    loginAsAdmin();
    onLoginSuccess();
  };

  const handleQuickInvestigator = () => {
    loginAsInvestigator();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#070c18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cyber Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md cyber-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        {/* Header Shield */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20 border border-cyan-400/40">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-100 tracking-wide">DIGITAL EVIDENCE MANAGER</h1>
          <p className="text-xs text-slate-400 mt-1">Secure Digital-Forensics Custody Portal</p>
        </div>

        {/* Demo Quick Login Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <p className="text-[11px] font-mono text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
            ⚡ Quick Evaluation Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              Login Admin
            </button>
            <button
              type="button"
              onClick={handleQuickInvestigator}
              className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Login Investigator
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="sarah.jenkins@dem.gov"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Authorized User Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="INVESTIGATOR">Investigator (Forensic Agent)</option>
              <option value="ADMIN">Administrator (Executive Command)</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2"
          >
            <span>Authenticate & Access Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 mx-auto"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Forgot Security Key / Password?
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4">
              <h3 className="text-base font-bold text-slate-100">Reset Password Request</h3>
              <p className="text-xs text-slate-400">
                Enter your agency email to dispatch an automated security token for password reset.
              </p>
              <input
                type="email"
                placeholder="investigator@dem.gov"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
              {forgotMsg && <p className="text-xs text-emerald-400 font-mono">{forgotMsg}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setForgotMsg(''); }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setForgotMsg('Reset token sent to administrator queue.')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-medium"
                >
                  Send Reset Token
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
