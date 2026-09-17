import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  FileText,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { staffApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const AssignedComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [emergencyFilter, setEmergencyFilter] = useState('');

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (emergencyFilter !== '') params.is_emergency = emergencyFilter === 'true';

      const res = await staffApi.getAssigned(params);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [statusFilter, emergencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssigned();
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
                <Building2 className="w-4 h-4 text-civic-600" />
                <span className="text-xs font-semibold text-slate-500">
                  {user?.department_name || 'Department Assigned Queue'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Department Grievance Registry
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review assigned public complaints, coordinate field work, and provide resolution updates
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assigned cases by title, complaint code, or landmark..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500"
                />
              </form>

              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-civic-500 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={emergencyFilter}
                  onChange={(e) => setEmergencyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-civic-500 font-medium"
                >
                  <option value="">All Priorities</option>
                  <option value="true">Emergency Only</option>
                  <option value="false">Standard Issues</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading department queue...</div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No complaints matching filter criteria</p>
                <p className="text-xs text-slate-500 mt-1">There are no complaints assigned to your department matching this view.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Case ID</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Citizen Contact</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {c.complaint_code}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {new Date(c.created_at).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 line-clamp-1">{c.title}</span>
                            {c.is_emergency && <EmergencyBadge />}
                          </div>
                          <span className="text-[11px] text-slate-500">{c.category}</span>
                        </td>

                        <td className="px-5 py-4 max-w-xs truncate text-slate-600">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {c.address}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-800">{c.citizen_name}</p>
                          <p className="text-[11px] text-slate-500">{c.citizen_email}</p>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <Link
                            to={`/staff/complaints/${c.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-civic-700 hover:bg-civic-800 rounded-lg transition shadow-2xs"
                          >
                            <span>Manage Case</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
