import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';

export const LocationPicker = ({ 
  address, 
  setAddress, 
  latitude, 
  setLatitude, 
  longitude, 
  setLongitude 
}) => {
  const [geoStatus, setGeoStatus] = useState(null); // 'loading', 'success', 'error'
  const [geoMessage, setGeoMessage] = useState('');

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('loading');
    setGeoMessage('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGeoStatus('success');
        setGeoMessage(`GPS Acquired: ${lat}, ${lng} (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        setGeoStatus('error');
        setGeoMessage(`Unable to retrieve GPS: ${err.message}. You can type the coordinates manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-4">
      {/* Address Field */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Street Address / Landmark <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Near Bus Stand, University Road, Krishnankoil"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* GPS Action and Coordinate Display */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Geographic Coordinates (GPS)
            </span>
            <span className="text-[11px] text-slate-500">
              Pinpoints municipal work crews directly to the grievance site
            </span>
          </div>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={geoStatus === 'loading'}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-civic-600 hover:bg-civic-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${geoStatus === 'loading' ? 'animate-spin' : ''}`} />
            {geoStatus === 'loading' ? 'Detecting...' : 'Detect GPS Location'}
          </button>
        </div>

        {geoMessage && (
          <div className={`p-2.5 rounded-md text-xs mb-3 flex items-center gap-2 ${
            geoStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            geoStatus === 'error' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
            'bg-blue-50 text-blue-800'
          }`}>
            {geoStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>{geoMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude ?? ''}
              onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="e.g., 9.5812"
              className="w-full px-3 py-1.5 text-xs bg-white rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-civic-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude ?? ''}
              onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="e.g., 77.6711"
              className="w-full px-3 py-1.5 text-xs bg-white rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-civic-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
