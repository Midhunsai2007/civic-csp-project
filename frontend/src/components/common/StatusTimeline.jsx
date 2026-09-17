import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const STAGES = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

export const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isRejected = currentStatus === 'Rejected';

  const getStageIndex = (status) => {
    return STAGES.indexOf(status);
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 text-civic-600" />
        Resolution Lifecycle Timeline
      </h3>

      {isRejected ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>This complaint was marked as <strong>Rejected</strong> by the municipal review authority. Check history remarks below for explanation.</span>
        </div>
      ) : (
        /* Progress Stepper */
        <div className="hidden sm:grid sm:grid-cols-5 gap-2 mb-8 relative">
          {STAGES.map((stage, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;

            return (
              <div key={stage} className="flex flex-col items-center text-center relative z-10">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-civic-600 text-white ring-4 ring-civic-100 shadow'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-civic-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* History Log List */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Action History Trail</h4>
        <div className="space-y-4">
          {statusHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No status transitions recorded yet.</p>
          ) : (
            statusHistory.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-civic-600 mt-1.5 shrink-0"></div>
                <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-800">
                      {item.old_status ? `${item.old_status} → ${item.new_status}` : `Initial Status: ${item.new_status}`}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.remarks || 'Status updated by system.'}</p>
                  {item.changed_by_name && (
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">Actor: {item.changed_by_name}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
