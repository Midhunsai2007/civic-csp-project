import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Building2,
  Users,
  BarChart3,
  LogOut,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-civic-700 text-white shadow-xs'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* User Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-civic-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-civic-100 text-civic-800">
            Role: {user?.role}
          </span>
          {user?.department_name && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700 truncate max-w-[130px]">
              {user.department_name}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* CITIZEN PORTAL LINKS */}
        {user?.role === 'citizen' && (
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Citizen Services</p>
            <nav className="space-y-1">
              <NavLink to="/citizen/dashboard" className={navClass}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </NavLink>
              <NavLink to="/citizen/submit" className={navClass}>
                <PlusCircle className="w-4 h-4 text-civic-500" />
                Report New Issue
              </NavLink>
              <NavLink to="/citizen/my-complaints" className={navClass}>
                <FileText className="w-4 h-4" />
                My Complaints & History
              </NavLink>
            </nav>
          </div>
        )}

        {/* STAFF PORTAL LINKS */}
        {user?.role === 'staff' && (
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Operations</p>
            <nav className="space-y-1">
              <NavLink to="/staff/dashboard" className={navClass}>
                <LayoutDashboard className="w-4 h-4" />
                Staff Queue Overview
              </NavLink>
              <NavLink to="/staff/assigned" className={navClass}>
                <FileText className="w-4 h-4" />
                Assigned Complaints
              </NavLink>
            </nav>
          </div>
        )}

        {/* ADMIN PORTAL LINKS */}
        {user?.role === 'admin' && (
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Municipal Administration</p>
            <nav className="space-y-1">
              <NavLink to="/admin/dashboard" className={navClass}>
                <LayoutDashboard className="w-4 h-4" />
                Executive Dashboard
              </NavLink>
              <NavLink to="/admin/complaints" className={navClass}>
                <FileText className="w-4 h-4" />
                All Complaints & Assignment
              </NavLink>
              <NavLink to="/admin/departments" className={navClass}>
                <Building2 className="w-4 h-4" />
                Department Directory
              </NavLink>
              <NavLink to="/admin/users" className={navClass}>
                <Users className="w-4 h-4" />
                User Access Management
              </NavLink>
            </nav>
          </div>
        )}

        {/* SYSTEM & AI SECTION */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System & Research</p>
          <nav className="space-y-1">
            <NavLink to="/ai-preview" className={navClass}>
              <Sparkles className="w-4 h-4 text-civic-500" />
              Proposed AI Architecture
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Platform
        </button>
      </div>
    </aside>
  );
};
