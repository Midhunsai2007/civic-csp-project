import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Info
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { ImageUploader } from '../../components/forms/ImageUploader';
import { LocationPicker } from '../../components/forms/LocationPicker';
import { complaintApi } from '../../api/client';

const CATEGORIES = [
  'Roads & Infrastructure',
  'Sanitation & Waste Management',
  'Electrical & Streetlighting',
  'Water Supply & Drainage',
  'Public Health & Safety',
  'Other Civic Issue'
];

export const SubmitComplaint = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isEmergency, setIsEmergency] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setAddress('');
    setLatitude('');
    setLongitude('');
    setPriority('Medium');
    setIsEmergency(false);
    setImageFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !address.trim()) {
      setError('Please provide a title, description, and street address.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('address', address.trim());
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('priority', isEmergency ? 'Emergency' : priority);
      formData.append('is_emergency', isEmergency);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await complaintApi.create(formData);
      navigate(`/citizen/complaints/${res.data.id}?created=true`);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.response?.data?.detail || 'Failed to submit complaint. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Register Civic Grievance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit an official report to municipal authorities. Please provide precise details and photographic evidence.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
              {/* Category & Emergency Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Civic Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Priority
                  </label>
                  <select
                    disabled={isEmergency}
                    value={isEmergency ? 'Emergency' : priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm bg-white disabled:bg-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Complaint Subject / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Deep asphalt pothole causing traffic obstruction"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Detailed Grievance Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the severity, exact landmark, how long the issue has persisted, and any hazards to pedestrians or vehicles..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
                />
              </div>

              {/* Location Picker */}
              <LocationPicker
                address={address}
                setAddress={setAddress}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
              />

              {/* Evidence Upload */}
              <ImageUploader
                onImageSelect={(file) => setImageFile(file)}
              />

              {/* Emergency Complaint Callout */}
              <div className={`p-4 rounded-xl border transition-colors ${
                isEmergency ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="emergencyCheck"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 mt-1 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <div className="flex-1 text-xs">
                    <label htmlFor="emergencyCheck" className="font-bold text-slate-900 cursor-pointer block">
                      Mark as Critical Civic Emergency
                    </label>
                    <p className="text-slate-600 mt-0.5">
                      Select this only for imminent hazards (e.g., active sparking transformer, collapsed drainage slab, severe water pipe burst).
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      * Statutory Notice: This is an expedited civic complaint channel. For immediate life danger, please call 112 directly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-civic-700 hover:bg-civic-800 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting Grievance...' : 'Submit Official Complaint'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
