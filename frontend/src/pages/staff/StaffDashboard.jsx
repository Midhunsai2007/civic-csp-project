import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { staffApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
    emergency_complaints: 0,
  });
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          staffApi.getDashboard(),
          staffApi.getAssigned(),
        ]);
        setStats(statsRes.data);
        setAssignedComplaints(complaintsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error loading staff dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStaffData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Staff Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-civic-100 text-civic-800 text-xs font-bold uppercase tracking-wider">
                  Department Work Desk
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {user?.department_name || 'Municipal Staff'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Staff Resolution Queue
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage incoming civic grievances, assign work crews, and submit resolution progress.
              </p>
            </div>

            <Link
              to="/staff/assigned"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-sm transition self-start sm:self-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect Full Queue</span>
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
            <StatCard
              title="Assigned Queue"
              value={stats.total_complaints}
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Pending Review"
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
              title="Resolved"
              value={stats.resolved_complaints}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Emergency Cases"
              value={stats.emergency_complaints}
              icon={AlertTriangle}
              color="rose"
            />
          </div>

          {/* Urgent Queue List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Complaints Awaiting Department Action</h2>
                <p className="text-xs text-slate-500">Prioritize emergency cases and update status regularly</p>
              </div>
              <Link
                to="/staff/assigned"
                className="text-xs font-semibold text-civic-600 hover:text-civic-800 flex items-center gap-1"
              >
                <span>View All ({stats.total_complaints})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading department queue...</div>
            ) : assignedComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No pending complaints in your department queue</p>
                <p className="text-xs text-slate-500 mt-1">All issues assigned to your team have been processed or resolved.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {assignedComplaints.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {item.complaint_code}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                        {item.is_emergency && <EmergencyBadge />}
                        <span className="text-xs text-slate-500">{item.category}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-slate-600 font-medium">
                          Citizen: {item.citizen_name}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <Link
                        to={`/staff/complaints/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-civic-700 hover:bg-civic-800 text-white text-xs font-semibold shadow-2xs transition"
                      >
                        <span>Manage & Update</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
