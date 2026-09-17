import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, onClick }) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100 hover:border-blue-300',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100 hover:border-amber-300',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100 hover:border-purple-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300',
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      border: 'border-rose-100 hover:border-rose-300',
    },
    slate: {
      bg: 'bg-slate-50',
      icon: 'text-slate-600',
      border: 'border-slate-100 hover:border-slate-300',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border transition-all duration-200 shadow-sm ${scheme.border} ${onClick ? 'cursor-pointer hover:shadow' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value ?? 0}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${scheme.bg}`}>
            <Icon className={`w-6 h-6 ${scheme.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
};
