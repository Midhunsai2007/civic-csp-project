import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Send
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { complaintApi, staffApi } from '../../api/client';

export const StaffComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update state
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');

  // Note state
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await complaintApi.getById(id);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      console.error('Error fetching complaint details:', err);
      setError('Unable to load complaint details or not assigned to your department.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!newStatus) return;

    setUpdatingStatus(true);
    setStatusSuccess('');
    setError('');

    try {
      const res = await staffApi.updateStatus(id, {
        status: newStatus,
        remarks: statusRemarks.trim() || undefined,
      });
      setComplaint(res.data);
      setStatusSuccess(`Status successfully updated to "${newStatus}".`);
      setStatusRemarks('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    setNoteSuccess('');
    setError('');

    try {
      await staffApi.addNote(id, {
        note: newNote.trim(),
        is_internal: isInternal,
      });
      setNoteSuccess('Resolution note recorded successfully.');
      setNewNote('');
      // Refresh case to show new note
      await fetchDetail();
    } catch (err) {
      console.error('Error adding resolution note:', err);
      setError(err.response?.data?.detail || 'Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500 font-medium">Loading department case file...</p>
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <p className="text-sm font-semibold text-rose-800">{error}</p>
              <Link to="/staff/assigned" className="mt-3 inline-block text-xs font-bold text-civic-700 underline">
                Return to Assigned Complaints
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/staff/assigned"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-civic-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Department Queue</span>
            </Link>

            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-200 text-slate-800">
              {complaint.complaint_code}
            </span>
          </div>

          {/* Feedback messages */}
          {statusSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusSuccess}</span>
            </div>
          )}

          {noteSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{noteSuccess}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Case Information Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {complaint.category}
                  </span>
                  <StatusBadge status={complaint.status} />
                  {complaint.is_emergency && <EmergencyBadge />}
                  <span className="text-xs font-semibold text-slate-500">
                    Priority: <strong className="text-slate-700">{complaint.priority}</strong>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{complaint.title}</h1>
              </div>

              <div className="text-right text-xs text-slate-500">
                <p>Reported on</p>
                <p className="font-semibold text-slate-800">{new Date(complaint.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Citizen Grievance Description
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Citizen & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-civic-600" />
                    Site Address & GPS
                  </p>
                  <p className="text-xs font-bold text-slate-800">{complaint.address}</p>
                  {complaint.latitude && complaint.longitude && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] flex items-center justify-between">
                      <span className="font-mono text-slate-600">
                        GPS: {complaint.latitude}, {complaint.longitude}
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-civic-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Open Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-civic-600" />
                    Citizen Contact
                  </p>
                  <p className="text-xs font-bold text-slate-800">{complaint.citizen_name}</p>
                  <p className="text-[11px] text-slate-600 mt-1">{complaint.citizen_email}</p>
                  {complaint.citizen_phone && (
                    <p className="text-[11px] text-slate-500">{complaint.citizen_phone}</p>
                  )}
                </div>
              </div>

              {/* Attached Evidence */}
              {complaint.image_url && (
                <div className="pt-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Evidence Attached by Citizen
                  </h3>
                  <div className="inline-block border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-100">
                    <a href={complaint.image_url} target="_blank" rel="noreferrer">
                      <img
                        src={complaint.image_url}
                        alt="Evidence"
                        className="max-h-64 max-w-full object-contain cursor-zoom-in"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Panels: Status Update & Resolution Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 1. Status Update Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-civic-600" />
                Update Complaint Status
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Advance the complaint through the official lifecycle stages
              </p>

              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Lifecycle Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-xs font-medium bg-white"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Transition Remarks / Audit Note
                  </label>
                  <input
                    type="text"
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="e.g., Dispatched road maintenance team #2 for asphalt filling"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full py-2.5 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${updatingStatus ? 'animate-spin' : ''}`} />
                  <span>{updatingStatus ? 'Saving Status...' : 'Apply Status Update'}</span>
                </button>
              </form>
            </div>

            {/* 2. Add Resolution Note Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Add Official Resolution Note
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Record technical findings, inspection details, or completion reports
              </p>

              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Note / Work Report
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g., Completed cold asphalt compaction over 15-meter stretch. Traffic restored normally."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="internalNote"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="w-3.5 h-3.5 text-civic-600 rounded border-slate-300"
                  />
                  <label htmlFor="internalNote" className="text-xs text-slate-600 cursor-pointer">
                    Internal departmental note only (hide from citizen view)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={addingNote}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{addingNote ? 'Recording Note...' : 'Record Resolution Note'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Timeline */}
          <StatusTimeline
            currentStatus={complaint.status}
            statusHistory={complaint.status_history || []}
          />
        </main>
      </div>
    </div>
  );
};
