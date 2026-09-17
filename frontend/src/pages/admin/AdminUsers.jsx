import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  X, 
  CheckCircle2, 
  AlertCircle,
  UserX,
  UserCheck
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { adminApi } from '../../api/client';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Edit User Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('citizen');
  const [editDeptId, setEditDeptId] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (activeFilter !== '') params.is_active = activeFilter === 'true';

      const [usersRes, deptsRes] = await Promise.all([
        adminApi.getUsers(params),
        adminApi.getDepartments(),
      ]);

      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter, activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openEditModal = (u) => {
    setSelectedUser(u);
    setEditRole(u.role);
    setEditDeptId(u.department_id || '');
    setEditActive(u.is_active);
    setError('');
  };

  const handleUserSave = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    setError('');
    setFeedback('');

    try {
      await adminApi.updateUser(selectedUser.id, {
        role: editRole,
        department_id: editRole === 'staff' ? (editDeptId ? parseInt(editDeptId) : null) : null,
        is_active: editActive,
      });

      setFeedback(`User ${selectedUser.name} permissions updated successfully.`);
      setSelectedUser(null);
      await loadData();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.detail || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">Admin</span>;
      case 'staff':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">Staff</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Citizen</span>;
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
                User Access & Security Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage registered citizens, staff roles, department affiliations, and account activation
              </p>
            </div>
          </div>

          {feedback && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500"
                />
              </form>

              <div className="w-full sm:w-44">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-civic-500"
                >
                  <option value="">All Roles</option>
                  <option value="citizen">Citizens</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              <div className="w-full sm:w-44">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-civic-500"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Active Accounts</option>
                  <option value="false">Deactivated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading user directory...</div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">User Profile</th>
                      <th className="px-5 py-3">Email Address</th>
                      <th className="px-5 py-3">System Role</th>
                      <th className="px-5 py-3">Assigned Department</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-[11px] text-slate-400">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                          {u.email}
                          {u.phone && <p className="text-[11px] text-slate-400">{u.phone}</p>}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {getRoleBadge(u.role)}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {u.department_name ? (
                            <span className="font-medium text-slate-700">{u.department_name}</span>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {u.is_active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-civic-700 hover:text-civic-900 bg-civic-50 hover:bg-civic-100 rounded border border-civic-200 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Access</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Edit User Modal */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-civic-700" />
                    <h3 className="text-sm font-bold text-slate-900">Manage User Access</h3>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4 text-xs">
                  <p className="font-bold text-slate-800">{selectedUser.name}</p>
                  <p className="text-slate-500">{selectedUser.email}</p>
                </div>

                {error && (
                  <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleUserSave} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                      Assigned Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-civic-500"
                    >
                      <option value="citizen">Citizen (Grievance Submitter)</option>
                      <option value="staff">Department Staff (Resolution Crew)</option>
                      <option value="admin">Administrator (System Controller)</option>
                    </select>
                  </div>

                  {editRole === 'staff' && (
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                        Department Affiliation <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={editDeptId}
                        onChange={(e) => setEditDeptId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-civic-500"
                      >
                        <option value="">Select Department...</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="userActive"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                      className="w-4 h-4 text-civic-600 rounded border-slate-300"
                    />
                    <label htmlFor="userActive" className="text-slate-700 font-semibold cursor-pointer">
                      Account is active and authorized to log in
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save User Access'}
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
