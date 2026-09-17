import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  UserCheck, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { complaintApi, adminApi } from '../../api/client';

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [emergencyFilter, setEmergencyFilter] = useState('');

  // Assignment Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (deptFilter) params.department_id = deptFilter;
      if (emergencyFilter !== '') params.is_emergency = emergencyFilter === 'true';

      const [complaintsRes, deptsRes] = await Promise.all([
        complaintApi.getAll(params),
        adminApi.getDepartments(),
      ]);

      setComplaints(complaintsRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Error loading admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, deptFilter, emergencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setTargetDeptId(complaint.assigned_department_id || (departments[0]?.id || ''));
    setAssignRemarks('');
    setActionError('');
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!targetDeptId || !selectedComplaint) return;

    setAssigning(true);
    setActionError('');
    setActionSuccess('');

    try {
      await adminApi.assignComplaint(selectedComplaint.id, {
        department_id: parseInt(targetDeptId),
        remarks: assignRemarks.trim() || undefined,
      });

      setActionSuccess(`Assigned complaint "${selectedComplaint.complaint_code}" to department.`);
      setSelectedComplaint(null);
      await loadData();
    } catch (err) {
      console.error('Error assigning complaint:', err);
      setActionError(err.response?.data?.detail || 'Failed to assign complaint.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Master Grievance Registry & Assignment
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Central municipal authority: triage unassigned cases and route to department work-crews
              </p>
            </div>
          </div>

          {actionSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by code, title, address, or description..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500"
                />
              </form>

              <div className="w-full sm:w-44">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-civic-500"
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

              <div className="w-full sm:w-52">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-civic-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-40">
                <select
                  value={emergencyFilter}
                  onChange={(e) => setEmergencyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-civic-500"
                >
                  <option value="">All Priorities</option>
                  <option value="true">Emergency Only</option>
                  <option value="false">Standard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading master registry...</div>
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No complaints matching filter criteria</p>
                <p className="text-xs text-slate-500 mt-1">Adjust search parameters or clear filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Code / Date</th>
                      <th className="px-4 py-3">Subject & Category</th>
                      <th className="px-4 py-3">Citizen Contact</th>
                      <th className="px-4 py-3">Department Allocation</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {c.complaint_code}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {new Date(c.created_at).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-slate-900 line-clamp-1">{c.title}</span>
                            {c.is_emergency && <EmergencyBadge />}
                          </div>
                          <p className="text-[11px] text-slate-500">{c.category}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{c.address}</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="font-semibold text-slate-800">{c.citizen_name}</p>
                          <p className="text-[11px] text-slate-500">{c.citizen_email}</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {c.department_name ? (
                            <div>
                              <span className="px-2 py-0.5 rounded bg-civic-50 text-civic-800 border border-civic-200 font-medium text-[11px]">
                                {c.department_name}
                              </span>
                              {c.staff_name && (
                                <p className="text-[11px] text-slate-500 mt-0.5">Staff: {c.staff_name}</p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                              UNASSIGNED
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => openAssignModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-civic-700 hover:text-civic-900 bg-civic-50 hover:bg-civic-100 rounded border border-civic-200 transition"
                          >
                            <Building2 className="w-3 h-3" />
                            <span>Assign Dept</span>
                          </button>

                          <Link
                            to={`/citizen/complaints/${c.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition"
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

          {/* Department Assignment Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-civic-700" />
                    <h3 className="text-sm font-bold text-slate-900">Assign Department</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4 text-xs">
                  <p className="text-slate-500 mb-1">Grievance Case:</p>
                  <p className="font-bold text-slate-800">{selectedComplaint.title}</p>
                  <p className="font-mono text-slate-500 text-[11px] mt-0.5">{selectedComplaint.complaint_code}</p>
                </div>

                <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                      Target Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={targetDeptId}
                      onChange={(e) => setTargetDeptId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-civic-500 font-medium"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                      Assignment Remarks (Recorded in audit trail)
                    </label>
                    <input
                      type="text"
                      value={assignRemarks}
                      onChange={(e) => setAssignRemarks(e.target.value)}
                      placeholder="e.g., Fast-tracked to Roads & Infrastructure unit"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={assigning}
                      className="px-4 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                    >
                      {assigning ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
