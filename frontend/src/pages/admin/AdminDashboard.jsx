import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatCard } from '../../components/common/StatCard';
import { adminApi } from '../../api/client';

const COLORS = ['#0c87eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const stats = data?.stats || {
    total_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
    emergency_complaints: 0,
    total_users: 0,
    total_departments: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
                  Municipal Administration
                </span>
                <span className="text-xs text-slate-500 font-medium">Executive Control Desk</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Civic Analytics & Operational Oversight
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                System-wide grievance monitoring, department workload metrics, and real-time status intelligence
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/complaints"
                className="px-3.5 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Assign Grievances
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
            <StatCard
              title="Total Grievances"
              value={stats.total_complaints}
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Pending Triage"
              value={stats.pending_complaints}
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="In Progress"
              value={stats.in_progress_complaints}
              icon={TrendingUp}
              color="purple"
            />
            <StatCard
              title="Resolved Cases"
              value={stats.resolved_complaints}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Emergency"
              value={stats.emergency_complaints}
              icon={AlertTriangle}
              color="rose"
            />
            <StatCard
              title="Registered Users"
              value={stats.total_users}
              icon={Users}
              color="slate"
            />
          </div>

          {loading ? (
            <div className="p-16 text-center text-xs text-slate-500">Generating analytics charts from database...</div>
          ) : (
            <div className="space-y-6">
              {/* Chart Row 1: Category Breakdown & Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Category Bar Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-civic-600" />
                    Complaints by Civic Category
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Volume distribution across municipal categories</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.by_category || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 10, fill: '#64748b' }} 
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }} />
                        <Bar dataKey="count" fill="#0c87eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Status Distribution Pie */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-emerald-600" />
                    Lifecycle Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Ratio of submitted, active, and resolved cases</p>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.by_status || []}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={3}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {(data?.by_status || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Chart Row 2: Department Load & Monthly Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3. Department Load */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Department Workload Allocation
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Active and unassigned complaints per department</p>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={data?.by_department || []} margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={120} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Intake vs Resolution Trend */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-civic-600" />
                    Monthly Intake vs Resolution Trend
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Longitudinal efficiency comparison</p>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.monthly_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="submitted" stroke="#0c87eb" fill="#0c87eb" fillOpacity={0.15} name="Submitted Grievances" />
                        <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Resolved Grievances" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
