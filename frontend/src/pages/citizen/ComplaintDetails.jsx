import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  FileText, 
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencyBadge } from '../../components/common/EmergencyBadge';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { complaintApi } from '../../api/client';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const justCreated = searchParams.get('created') === 'true';

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await complaintApi.getById(id);
        setComplaint(res.data);
      } catch (err) {
        console.error('Error fetching complaint details:', err);
        setError('Unable to load complaint details. It may not exist or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500 font-medium">Loading complaint case file...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <p className="text-sm font-semibold text-rose-800">{error || 'Complaint not found.'}</p>
              <Link to="/citizen/my-complaints" className="mt-3 inline-block text-xs font-bold text-civic-700 underline">
                Return to My Complaints
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
          {/* Breadcrumb & Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/citizen/my-complaints"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-civic-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Grievance Registry</span>
            </Link>

            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-200 text-slate-800">
              {complaint.complaint_code}
            </span>
          </div>

          {justCreated && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Grievance Successfully Registered!</p>
                <p className="text-emerald-700 mt-0.5">
                  Your complaint reference code is <strong>{complaint.complaint_code}</strong>. It has been routed to the municipal dispatch queue.
                </p>
              </div>
            </div>
          )}

          {/* Grievance Overview Card */}
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
                <p>Submitted On</p>
                <p className="font-semibold text-slate-800">{new Date(complaint.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Grievance Description
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/70 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-civic-600" />
                    Civic Address & Landmark
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
                        <span>Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-civic-600" />
                    Assigned Municipal Department
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {complaint.department_name || 'Pending Departmental Allocation'}
                  </p>
                  {complaint.staff_name && (
                    <p className="text-[11px] text-slate-600 mt-1">
                      Assigned Officer: <strong>{complaint.staff_name}</strong>
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-civic-600" />
                    Reporting Citizen
                  </p>
                  <p className="text-xs font-bold text-slate-800">{complaint.citizen_name || 'Anonymous'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{complaint.citizen_email}</p>
                </div>
              </div>

              {/* Photo Evidence Section */}
              {complaint.image_url && (
                <div className="pt-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Photographic Evidence Attached
                  </h3>
                  <div className="inline-block border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-100">
                    <a href={complaint.image_url} target="_blank" rel="noreferrer" title="Open full-size image">
                      <img
                        src={complaint.image_url}
                        alt="Civic issue evidence"
                        className="max-h-72 max-w-full object-contain cursor-zoom-in"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Official Staff Resolution Remarks */}
          {complaint.resolution_notes && complaint.resolution_notes.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Official Department Resolution Notes
              </h3>
              <div className="space-y-3">
                {complaint.resolution_notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-900">
                        Officer: {note.staff_name || 'Department Staff'}
                      </span>
                      <span className="text-emerald-700 text-[11px]">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Visual Status Timeline */}
          <StatusTimeline
            currentStatus={complaint.status}
            statusHistory={complaint.status_history || []}
          />
        </main>
      </div>
    </div>
  );
};
