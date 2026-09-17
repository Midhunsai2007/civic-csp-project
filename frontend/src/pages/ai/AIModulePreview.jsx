import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  BrainCircuit, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { aiApi } from '../../api/client';

export const AIModulePreview = () => {
  // Playground 1: Text Classification
  const [classifyTitle, setClassifyTitle] = useState('Deep asphalt pothole causing accidents near main cross');
  const [classifyDesc, setClassifyDesc] = useState('Several two-wheelers have slipped due to 2-foot wide pothole crater on the highway road.');
  const [classifyLoading, setClassifyLoading] = useState(false);
  const [classifyResult, setClassifyResult] = useState(null);

  // Playground 2: Priority Detection
  const [priorityTitle, setPriorityTitle] = useState('Sparking live wire hanging over school bus stop');
  const [priorityDesc, setPriorityDesc] = useState('Electrical cable snapped and actively sparking during rain on the pedestrian pavement.');
  const [priorityEmergency, setPriorityEmergency] = useState(true);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityResult, setPriorityResult] = useState(null);

  const handleRunClassification = async (e) => {
    e.preventDefault();
    setClassifyLoading(true);
    try {
      const res = await aiApi.classify({
        title: classifyTitle,
        description: classifyDesc,
      });
      setClassifyResult(res.data);
    } catch (err) {
      console.error('Error running AI classification:', err);
    } finally {
      setClassifyLoading(false);
    }
  };

  const handleRunPriority = async (e) => {
    e.preventDefault();
    setPriorityLoading(true);
    try {
      const res = await aiApi.detectPriority({
        title: priorityTitle,
        description: priorityDesc,
        is_emergency_flagged: priorityEmergency,
      });
      setPriorityResult(res.data);
    } catch (err) {
      console.error('Error running AI priority detection:', err);
    } finally {
      setPriorityLoading(false);
    }
  };

  const plannedComponents = [
    {
      title: 'Multiclass NLP Grievance Classifier',
      target: 'Fine-tuned DistilBERT / BERT',
      desc: 'Automatic routing of complaints into Roads, Sanitation, Electrical, Water Supply, and Public Health categories based on citizen text.',
      ref: 'Caldeira et al. (2022) / Joshi et al. (2025 Cityzen)',
      status: 'Proposed (Slide 12 - Layer 6)',
    },
    {
      title: 'Automated Risk & Priority Profiler',
      target: 'MobileBERT + Civic Urgency Heuristics',
      desc: 'Real-time hazard detection flagging live wires, gas leaks, and bridge collapses for instant municipal escalation.',
      ref: 'Slide 4 (Objective 8) & Slide 17',
      status: 'Proposed (Phase 2)',
    },
    {
      title: 'Computer Vision Road Damage Inspection',
      target: 'MobileNetV2 / ResNet-50 / YOLOv8',
      desc: 'Analysis of citizen photo evidence to verify pothole severity, pavement cracking, and illegal garbage dumping.',
      ref: 'Madan et al. (2026) / Cao et al. (2020)',
      status: 'Proposed (Future Extension)',
    },
    {
      title: 'Duplicate Grievance Clustering',
      target: 'Sentence Transformers + Geohash Radius',
      desc: 'Detects and merges duplicate complaints submitted by multiple citizens within a 50-meter radius to prevent work redundancy.',
      ref: 'Slide 17 (Future Enhancement #4)',
      status: 'Proposed (Phase 2)',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Academic Review: Proposed Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Proposed AI Architecture & Intelligence Layer
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Technical blueprint for intelligent complaint classification, urgency detection, and automated department triage as outlined in our Community Service Project (CSP) First Review.
          </p>
        </div>

        {/* Mandatory Academic Transparency Notice */}
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 mb-10 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-amber-950">
                Academic Integrity & Scope Declaration (Presentation Slide 4 & 15)
              </p>
              <p className="leading-relaxed text-amber-800">
                In strict accordance with Slide 4 (Objective 8) and Slide 15: <em>“Objective 08 is intentionally separated — it is the proposed AI layer and is not implemented at the first-review stage. No AI model has been trained or deployed yet.”</em>
              </p>
              <p className="leading-relaxed text-amber-800">
                The interactive demos below connect to operational backend preview endpoints (<code>/api/ai/*</code>) that simulate the expected input/output contract of the planned neural network architecture.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Playground 1: NLP Text Classifier */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-civic-50 text-civic-700 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Module A: NLP Complaint Classifier</h2>
                  <span className="text-[10px] text-civic-600 font-bold uppercase">Simulation Endpoint: /api/ai/classify-complaint</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Predicts the civic category and routes to the appropriate municipal department using text analysis.
              </p>

              <form onSubmit={handleRunClassification} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Complaint Title</label>
                  <input
                    type="text"
                    required
                    value={classifyTitle}
                    onChange={(e) => setClassifyTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Complaint Description</label>
                  <textarea
                    rows={3}
                    required
                    value={classifyDesc}
                    onChange={(e) => setClassifyDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-civic-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={classifyLoading}
                  className="w-full py-2.5 bg-civic-700 hover:bg-civic-800 text-white font-semibold rounded-lg shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{classifyLoading ? 'Analyzing Text...' : 'Run Proposed NLP Classification'}</span>
                </button>
              </form>
            </div>

            {/* Results Output */}
            {classifyResult && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Predicted Category:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-civic-100 text-civic-800 font-bold">
                    {classifyResult.predicted_category}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Model Confidence:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {(classifyResult.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Target Department:</span>
                  <span className="font-semibold text-slate-800">
                    {classifyResult.suggested_departments.join(', ')}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-slate-600 block mb-1">Detected Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {classifyResult.detected_keywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-200">
                  {classifyResult.disclaimer}
                </p>
              </div>
            )}
          </div>

          {/* Playground 2: Urgency & Priority Detection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Module B: Risk & Priority Profiler</h2>
                  <span className="text-[10px] text-rose-600 font-bold uppercase">Simulation Endpoint: /api/ai/detect-priority</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Detects urgent civic hazard indicators like sparking, open manholes, or gas leaks.
              </p>

              <form onSubmit={handleRunPriority} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Hazard Title</label>
                  <input
                    type="text"
                    required
                    value={priorityTitle}
                    onChange={(e) => setPriorityTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">Hazard Description</label>
                  <textarea
                    rows={3}
                    required
                    value={priorityDesc}
                    onChange={(e) => setPriorityDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flagEmergency"
                    checked={priorityEmergency}
                    onChange={(e) => setPriorityEmergency(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300"
                  />
                  <label htmlFor="flagEmergency" className="font-semibold text-slate-700 cursor-pointer">
                    Citizen marked as Emergency
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={priorityLoading}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{priorityLoading ? 'Evaluating Urgency...' : 'Run Risk & Urgency Profiler'}</span>
                </button>
              </form>
            </div>

            {/* Results Output */}
            {priorityResult && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Estimated Priority:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    priorityResult.estimated_priority === 'Emergency' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    priorityResult.estimated_priority === 'High' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {priorityResult.estimated_priority}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Urgency Score:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {(priorityResult.urgency_score * 100).toFixed(0)} / 100
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-slate-600 block mb-1">Triggered Risk Factors:</span>
                  <div className="flex flex-wrap gap-1">
                    {priorityResult.risk_factors.length > 0 ? (
                      priorityResult.risk_factors.map((rf, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-semibold">
                          {rf}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No acute hazardous keywords detected</span>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-200">
                  {priorityResult.disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Proposed Architecture Specifications Blueprint */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xs font-bold text-civic-600 uppercase tracking-widest mb-1">System Architecture Blueprint</h2>
            <h3 className="text-xl font-bold text-slate-900">4-Stage Planned AI Pipeline (Phase 2)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Referenced directly from literature survey papers [1]–[8] of our First Review Presentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plannedComponents.map((comp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900">{comp.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {comp.status}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-civic-700 mb-1.5">Target: {comp.target}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{comp.desc}</p>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Literature Source: {comp.ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
