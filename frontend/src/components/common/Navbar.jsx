import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut, LayoutDashboard, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff') return '/staff/dashboard';
    return '/citizen/dashboard';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-civic-800 flex items-center justify-center text-white shadow-sm ring-2 ring-civic-700/30">
              <ShieldCheck className="w-6 h-6 text-civic-300" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight block leading-tight">
                CivicConnect<span className="text-civic-600">.AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide block uppercase">
                Smart Civic Issue Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-civic-700 transition-colors">Home</Link>
            <a href="/#how-it-works" className="hover:text-civic-700 transition-colors">How It Works</a>
            <a href="/#features" className="hover:text-civic-700 transition-colors">Features</a>
            <Link to="/ai-preview" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-civic-50 text-civic-700 border border-civic-200 hover:bg-civic-100 transition-colors text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-civic-600" />
              Proposed AI Architecture
            </Link>
            <a href="/#about" className="hover:text-civic-700 transition-colors">About</a>
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-civic-50 text-civic-700 hover:bg-civic-100 border border-civic-200 rounded-lg text-xs font-semibold transition shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-civic-600" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[120px] truncate">{user?.name}</p>
                    <span className="text-[10px] uppercase font-bold text-civic-600">{user?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-civic-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-1">Home</Link>
          <a href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-1">How It Works</a>
          <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-1">Features</a>
          <Link to="/ai-preview" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-semibold text-civic-700 py-1">Proposed AI Architecture</Link>
          <a href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-1">About Project</a>
          
          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-civic-100 text-civic-700 text-xs font-bold flex items-center justify-center">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                    <span className="text-[10px] uppercase font-bold text-civic-600">{user?.role}</span>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-xs font-semibold text-civic-700 bg-civic-50 rounded-lg border border-civic-200"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="block w-full text-center py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-white bg-civic-700 rounded-lg"
                >
                  Register as Citizen
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
