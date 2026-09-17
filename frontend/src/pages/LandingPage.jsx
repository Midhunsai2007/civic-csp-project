import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Camera, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users,
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import api from '../api/client';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    total: 7,
    resolved: 1,
    departments: 5,
    pending: 3,
  });

  useEffect(() => {
    // Fetch live statistics if available
    const fetchPublicStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data?.stats) {
          setStats({
            total: res.data.stats.total_complaints,
            resolved: res.data.stats.resolved_complaints,
            departments: res.data.stats.total_departments || 5,
            pending: res.data.stats.pending_complaints,
          });
        }
      } catch (err) {
        // Fallback to initial seed numbers
      }
    };
    fetchPublicStats();
  }, []);

  const features = [
    {
      icon: FileCheck,
      title: 'Easy Complaint Registration',
      desc: 'Structured multi-step submission form capturing title, detailed descriptions, category, and priority classification.',
    },
    {
      icon: MapPin,
      title: 'Location & GPS Pinpointing',
      desc: 'One-click browser GPS coordinates acquisition and precise street address routing to assist field inspection crews.',
    },
    {
      icon: Camera,
      title: 'Photo Evidence Upload',
      desc: 'Attach photographic proof of civic hazards directly from smartphone or desktop for accurate assessment.',
    },
    {
      icon: Building,
      title: 'Department-Wise Management',
      desc: 'Automated triage and dispatch to designated municipal authorities including Roads, Sanitation, and Electrical departments.',
    },
    {
      icon: Clock,
      title: 'Real-Time Status Tracking',
      desc: 'End-to-end transparent lifecycle timeline from initial submission through review, assignment, progress, and resolution.',
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Complaint Handling',
      desc: 'High-visibility escalation for immediate civic hazards like sparking transformers or collapsed road drainage.',
    },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Register or Login',
      desc: 'Access the citizen portal using your verified account with secure JWT authentication.',
    },
    {
      num: '02',
      title: 'Submit Complaint with Evidence',
      desc: 'Provide details, attach photos, pinpoint your GPS location, and toggle emergency if critical.',
    },
    {
      num: '03',
      title: 'Department Reviews & Dispatches',
      desc: 'Municipal staff inspects evidence, dispatches repair teams, and records official resolution notes.',
    },
    {
      num: '04',
      title: 'Track Verified Resolution',
      desc: 'Monitor each action in the public audit trail until the grievance is formally closed.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-50 border border-civic-200 text-civic-800 text-xs font-semibold mb-6 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-civic-600" />
              <span>Community Service Project – First Review 2025–2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-6">
              Report Civic Issues. <span className="text-civic-700">Track Progress.</span> Build Better Communities.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              A centralized civic tech platform connecting citizens directly with municipal departments for transparent reporting, GPS-guided triage, and accountable issue resolution.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/citizen/submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-civic-700 hover:bg-civic-800 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-semibold text-sm transition shadow-2xs flex items-center justify-center"
              >
                Explore How It Works
              </a>

              <Link
                to="/ai-preview"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition shadow-2xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Proposed AI Module</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Database Statistics Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-extrabold text-slate-900">{stats.total}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Complaints Registered</p>
              <span className="text-[10px] text-civic-600 font-medium">Live Database Count</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-extrabold text-emerald-600">{stats.resolved}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Resolved Issues</p>
              <span className="text-[10px] text-emerald-600 font-medium">Verified by Staff</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-extrabold text-civic-700">{stats.departments}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Departments</p>
              <span className="text-[10px] text-slate-500 font-medium">Roads, Water, Sanitation, etc.</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-3xl font-extrabold text-amber-600">{stats.pending}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Under Triage / In Progress</p>
              <span className="text-[10px] text-amber-600 font-medium">Active Field Crews</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-civic-600 uppercase tracking-widest mb-2">Workflow Methodology</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">How CivicConnect Resolves Grievances</h3>
            <p className="text-sm text-slate-600 mt-2">
              A transparent, 4-stage pipeline directly reflecting Slide 11 of the project presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <div key={step.num} className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs relative flex flex-col">
                <span className="text-2xl font-black text-civic-700 mb-3 block">{step.num}</span>
                <h4 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-civic-600 uppercase tracking-widest mb-2">Platform Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Built for Citizens, Staff, and Administrators</h3>
            <p className="text-sm text-slate-600 mt-2">
              Robust civic infrastructure engineering eliminating manual reporting bottlenecks and paper registers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 hover:border-civic-300 hover:shadow-sm transition-all duration-200 bg-white">
                  <div className="w-10 h-10 rounded-lg bg-civic-50 border border-civic-100 flex items-center justify-center text-civic-700 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proposed AI Architecture Callout */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700 rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proposed AI Integration – First Review Specification</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Intelligent NLP Complaint Classification & Risk Detection
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Objective 08 of our CSP outlines future integration of fine-tuned BERT/DistilBERT models to automatically categorize complaints, calculate urgency heuristics, and route issues to municipal departments.
              </p>
              <p className="text-xs text-slate-400 italic">
                * Transparency Note: As documented in Slide 4 and Slide 15 of our presentation, the AI processing layer is designed and architected as a Phase 2 extension.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/ai-preview"
                className="px-6 py-3.5 bg-civic-600 hover:bg-civic-500 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2"
              >
                <span>Launch Proposed AI Playground</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project & Literature Context */}
      <section id="about" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xs font-bold text-civic-600 uppercase tracking-widest mb-1">Academic Foundations</h2>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Community Service Project (CSP) Context</h3>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Research Gap Identified (Slide 10):</strong> Most academic literature investigates either text grievance classification (e.g. Caldeira et al., 2022) or computer-vision road damage detection (Cao et al., 2020; Arya et al., 2022) in isolation. Very few platforms provide an end-to-end, runnable lifecycle that bridges Citizens, Staff work-crews, and Municipal Administrators.
              </p>
              <p>
                <strong>Our Position:</strong> CivicConnect bridges this gap by delivering an operational, self-hosted civic management platform with structured databases, GPS-enabled evidence intake, departmental queues, and an API architecture explicitly structured for future AI model deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
