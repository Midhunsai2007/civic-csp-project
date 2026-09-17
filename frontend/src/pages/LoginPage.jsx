import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo accounts for quick review evaluation
  const demoAccounts = [
    {
      roleName: 'System Administrator',
      email: 'admin@civic.gov',
      pass: 'admin123',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      roleName: 'Staff (Roads Lead)',
      email: 'staff.roads@civic.gov',
      pass: 'staff123',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      roleName: 'Staff (Sanitation Officer)',
      email: 'staff.sanitation@civic.gov',
      pass: 'staff123',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      roleName: 'Citizen (Mahitha Mohan)',
      email: 'citizen@example.com',
      pass: 'citizen123',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  const handleQuickLogin = async (accEmail, accPass) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
    setLoading(true);
    try {
      const user = await login(accEmail, accPass);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-civic-800 text-white rounded-xl flex items-center justify-center shadow-sm mb-3">
              <ShieldCheck className="w-7 h-7 text-civic-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign in to CivicConnect</h2>
            <p className="text-xs text-slate-500 mt-1">
              Secure role-based access for Citizens, Municipal Staff, and Administrators
            </p>
          </div>

          {/* Quick Demo Selector Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Academic Review 1-Click Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.pass)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition hover:brightness-95 ${acc.badgeColor}`}
                >
                  <p className="font-bold truncate">{acc.roleName}</p>
                  <p className="text-[10px] opacity-80 truncate">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-civic-700 hover:bg-civic-800 text-white font-semibold rounded-lg text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-500">
              New citizen?{' '}
              <Link to="/register" className="font-semibold text-civic-600 hover:text-civic-800">
                Register an account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
