import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  FileText, 
  Mail, 
  Phone, 
  Edit3, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { adminApi } from '../../api/client';

export const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      description: '',
      contact_email: '',
      contact_phone: '',
      is_active: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description || '',
      contact_email: dept.contact_email || '',
      contact_phone: dept.contact_phone || '',
      is_active: dept.is_active,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setErrorMsg('');
    setFeedbackMsg('');

    try {
      if (editingDept) {
        await adminApi.updateDepartment(editingDept.id, formData);
        setFeedbackMsg(`Department "${formData.name}" updated successfully.`);
      } else {
        await adminApi.createDepartment(formData);
        setFeedbackMsg(`New department "${formData.name}" created.`);
      }
      setIsModalOpen(false);
      await fetchDepartments();
    } catch (err) {
      console.error('Error saving department:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to save department.');
    } finally {
      setSaving(false);
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
                Department Directory & Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure municipal departments, contact channels, and monitor assigned operational workloads
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Department</span>
            </button>
          </div>

          {feedbackMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Department Cards Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading department directory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-civic-300 transition">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-civic-50 border border-civic-100 flex items-center justify-center text-civic-700">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            dept.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {dept.is_active ? 'Operational' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-1.5 text-slate-400 hover:text-civic-700 hover:bg-slate-100 rounded-md transition"
                        title="Edit Department"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {dept.description || 'No description provided.'}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                      {dept.contact_email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{dept.contact_email}</span>
                        </p>
                      )}
                      {dept.contact_phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{dept.contact_phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Department Stats Footer */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dept.staff_count} Staff Officers</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-civic-700 font-bold bg-civic-50 px-2.5 py-1 rounded-md border border-civic-200">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{dept.active_complaints_count} Active Cases</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create / Edit Department Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-civic-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingDept ? 'Edit Municipal Department' : 'Create New Department'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                      Department Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Parks & Public Gardens"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1.5">
                      Operational Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jurisdiction, responsibilities, and civic scope..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1.5">Contact Email</label>
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="dept@civic.gov"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1.5">Contact Phone</label>
                      <input
                        type="text"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="+91 44 ..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="deptActive"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-civic-600 rounded border-slate-300"
                    />
                    <label htmlFor="deptActive" className="text-slate-700 font-semibold cursor-pointer">
                      Department is currently active and accepting complaints
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-civic-700 hover:bg-civic-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : editingDept ? 'Save Changes' : 'Create Department'}
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
