import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Project Overview */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-civic-400" />
              <span>AI-Powered Community Complaint & Smart Civic Issue Management System</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
              A centralized civic platform empowering citizens to report public issues, enabling departmental work crews to manage resolution pipelines, and providing administrators with transparent oversight and future-ready AI classification.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Community Service Project (CSP) – First Review 2025–2026
            </div>
          </div>

          {/* Col 2: Academic Team */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Project Team</h4>
            <ul className="space-y-1.5 text-xs">
              <li>M. Mahitha <span className="text-slate-500 text-[11px]">(99240041229)</span></li>
              <li>C. Sindhu <span className="text-slate-500 text-[11px]">(99240040807)</span></li>
              <li>B. Vijayasankar <span className="text-slate-500 text-[11px]">(99240040398)</span></li>
              <li>D. Rajesh <span className="text-slate-500 text-[11px]">(99240040897)</span></li>
            </ul>
          </div>

          {/* Col 3: Academic Credits */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Institution & Guide</h4>
            <p className="text-white font-medium text-xs mb-1">Faculty Guide:</p>
            <p className="text-slate-400 text-xs mb-3">Dr M. Vijay</p>
            <p className="text-white font-medium text-xs mb-1">Department & College:</p>
            <p className="text-slate-400 text-xs">
              Dept. of Computer Science & Engineering (AI & ML)<br />
              Kalasalingam Academy of Research and Education (Deemed to be University)
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 CivicConnect. Academic demonstration build. All rights reserved.</p>
          <p className="text-slate-500">
            Emergency Notice: For imminent life-threatening civic emergencies, contact 112 / Fire & Rescue dispatch immediately.
          </p>
        </div>
      </div>
    </footer>
  );
};
