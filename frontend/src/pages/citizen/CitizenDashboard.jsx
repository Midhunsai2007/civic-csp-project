import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { citizenApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
    emergency_complaints: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          citizenApi.getDashboard(),
          citizenApi.getMyComplaints(),
        ]);
        setStats(statsRes.data);
        setRecentComplaints(complaintsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching citizen dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Citizen Grievance Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, {user?.name}. Monitor your submitted issues and local civic progress.
              </p>
            </div>

            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-sm transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </Link>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
            <StatCard
              title="Total Submitted"
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
              title="Emergency"
              value={stats.emergency_complaints}
              icon={AlertTriangle}
              color="rose"
            />
          </div>

          {/* Recent Grievances Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Recent Grievances</h2>
                <p className="text-xs text-slate-500">Live track active issues and departmental action</p>
              </div>
              <Link
                to="/citizen/my-complaints"
                className="text-xs font-semibold text-civic-600 hover:text-civic-800 flex items-center gap-1"
              >
                <span>View All ({stats.total_complaints})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading your grievances...</div>
            ) : recentComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No complaints registered yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Notice a broken streetlight, pothole, or drainage overflow in your locality? Submit a report now.
                </p>
                <Link
                  to="/citizen/submit"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-civic-600 text-white rounded-lg text-xs font-semibold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit First Complaint</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentComplaints.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-civic-700 bg-civic-50 px-2 py-0.5 rounded border border-civic-200">
                          {item.complaint_code}
                        </span>
                        <StatusBadge status={item.status} size="sm" />
                        {item.is_emergency && <EmergencyBadge />}
                        <span className="text-xs text-slate-500 font-medium">{item.category}</span>
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
                        {item.department_name && (
                          <span className="text-slate-600 font-medium">
                            Dept: {item.department_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <Link
                        to={`/citizen/complaints/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-civic-400 text-xs font-semibold text-slate-700 hover:text-civic-700 hover:bg-white transition shadow-2xs"
                      >
                        <span>View Details</span>
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
