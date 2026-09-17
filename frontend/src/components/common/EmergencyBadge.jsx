import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const EmergencyBadge = ({ priority = 'Emergency' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded-full animate-pulse shadow-sm">
      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      <span>EMERGENCY</span>
    </span>
  );
};
