import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  FileText,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { citizenApi } from '../../api/client';

export const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await citizenApi.getMyComplaints(params);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                My Grievance Records
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track status changes, audit timestamps, and staff resolution notes
              </p>
            </div>

            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-sm transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, complaint code, or landmark..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500"
                />
              </form>

              {/* Status Filter */}
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

              {/* Category Filter */}
              <div className="w-full sm:w-56">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-civic-500 font-medium"
                >
                  <option value="">All Categories</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Sanitation & Waste Management">Sanitation & Waste Management</option>
                  <option value="Electrical & Streetlighting">Electrical & Streetlighting</option>
                  <option value="Water Supply & Drainage">Water Supply & Drainage</option>
                  <option value="Public Health & Safety">Public Health & Safety</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints Table/Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading complaints...</div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No complaints matching filter criteria</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting your filters or submit a new grievance report.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Complaint Code</th>
                      <th className="px-5 py-3">Subject & Category</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-civic-700 bg-civic-50 px-2 py-0.5 rounded border border-civic-200 text-[11px]">
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
                          {c.department_name ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {c.department_name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Pending Triage</span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <Link
                            to={`/citizen/complaints/${c.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-civic-700 hover:text-civic-900 bg-civic-50 hover:bg-civic-100 rounded border border-civic-200 transition"
                          >
                            <span>Inspect</span>
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
