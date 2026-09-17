import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-semibold';

  const config = {
    'Submitted': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Submitted'
    },
    'Under Review': {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-500',
      label: 'Under Review'
    },
    'Assigned': {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-500',
      label: 'Assigned'
    },
    'In Progress': {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-500',
      label: 'In Progress'
    },
    'Resolved': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Resolved'
    },
    'Rejected': {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      label: 'Rejected'
    },
  };

  const current = config[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status || 'Unknown'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};
