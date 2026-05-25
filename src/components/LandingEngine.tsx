import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Layout, ShieldAlert, Sparkles, CheckCircle2, Copy, Check, RefreshCw } from 'lucide-react';
import { SAMPLE_LANDING_PAGES, DEMO_LANDING_RESULTS } from '../data';
import { LandingAnalysisResult } from '../types';

interface LandingEngineProps {
  apiKeyAvailable: boolean;
}

export default function LandingEngine({ apiKeyAvailable }: LandingEngineProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [targetAudience, setTargetAudience] = useState('Early stage startup founders looking for productivity hacks');
  const [copyInput, setCopyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LandingAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handlePresetSelect = (id: string) => {
    setSelectedPreset(id);
    const preset = SAMPLE_LANDING_PAGES.find(p => p.id === id);
    if (preset) {
      setTargetAudience(preset.targetAudience);
      setCopyInput(preset.copyText);
      setError(null);
      
      // Load demo results instantly for extreme reliability
      setResult(DEMO_LANDING_RESULTS[id] || null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyInput.trim()) {
      setError('Please provide landing page copy to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedPreset(null);

    try {
      const response = await fetch('/api/analyze/landing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          copyText: copyInput,
          targetAudience
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Conversion calculation aborted by server.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error executing landing conversion parsing.');
    } finally {
      setLoading(false);
    }
  };

  const copyCodeToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="landing-engine-container">
      {/* Configuration structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Sidebar (5 cols) */}
        <div className="lg:col-span-5 border border-swiss-charcoal/10 bg-swiss-cream p-6 rounded-lg space-y-5">
          <div>
            <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase mb-2">
              // Conversion Presets
            </h3>
            <div className="space-y-2">
              {SAMPLE_LANDING_PAGES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`w-full text-left p-2.5 rounded border transition-all text-xs flex items-center justify-between gap-2 ${
                    selectedPreset === preset.id
                      ? 'border-swiss-charcoal bg-swiss-grey font-medium'
                      : 'border-swiss-charcoal/10 bg-white/70 hover:border-swiss-charcoal/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-swiss-charcoal/50" />
                    <span className="truncate max-w-[180px]">{preset.id === 'generic_saas' ? 'Generic AI-synergy SaaS' : 'Minimalist Typewriter SaaS'}</span>
                  </div>
                  <span className="text-[9px] font-mono text-swiss-accent uppercase pr-1">Demos</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-swiss-charcoal/5 pt-4">
            <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase mb-3">
              // Custom Landing Analyzer
            </h3>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-swiss-charcoal/50 uppercase mb-1">Target Persona / Reader Archetype</label>
                <input 
                  type="text" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Solo developers, CMOs, dental clinics"
                  className="w-full text-xs p-2.5 border border-swiss-charcoal/10 bg-white focus:outline-none focus:border-swiss-charcoal/40 roundedSB"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-swiss-charcoal/50 uppercase mb-1">Landing Copy Structure / Headers</label>
                <textarea 
                  rows={8}
                  value={copyInput}
                  onChange={(e) => setCopyInput(e.target.value)}
                  placeholder="Paste your landing page headline, subheadline, benefit items, and CTA text here..."
                  className="w-full text-xs p-2.5 border border-swiss-charcoal/10 bg-white focus:outline-none focus:border-swiss-charcoal/40 rounded font-sans leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-xs p-3 bg-swiss-charcoal text-white hover:bg-swiss-accent transition-all font-mono font-medium tracking-wide flex items-center justify-center gap-2 rounded cursor-pointer disabled:bg-swiss-charcoal/40"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    DECODING COGNITIVE FRICTION...
                  </>
                ) : (
                  <>
                    <Target className="w-3.5 h-3.5" />
                    ANALYZE CONVERSION PSYCHOLOGY
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-swiss-charcoal/10 bg-white rounded-lg p-12 text-center"
              >
                <RefreshCw className="w-10 h-10 text-swiss-accent animate-spin mx-auto mb-4" />
                <h3 className="font-serif italic text-lg text-swiss-charcoal">Measuring Cognitive Bandwidth Overload</h3>
                <p className="font-mono text-xs text-swiss-charcoal/50 mt-2 max-w-sm mx-auto leading-relaxed">
                  Querying Gemini models to map Fitts\' Law click targets, isolate generic copy buzzwords, and evaluate high-contrast value positioning...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={result.contrastScore}
                className="space-y-6"
              >
                {/* Score panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trust contrast ratio */}
                  <div className="border border-swiss-charcoal/10 bg-white p-5 rounded-lg flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-mono text-swiss-charcoal/40 uppercase tracking-wider mb-1">// Persuasion Contrast Ratio</h4>
                      <div className="text-4xl font-serif font-semibold text-swiss-charcoal">
                        <span className={result.contrastScore > 75 ? 'text-emerald-700' : result.contrastScore > 45 ? 'text-amber-600' : 'text-swiss-accent'}>
                          {result.contrastScore}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-swiss-charcoal/50 leading-relaxed font-sans mt-2 pt-2 border-t border-swiss-charcoal/5">
                      Measures explicit value clarity divided by intellectual friction in copy. Goal is &gt;80% for premium conversion.
                    </div>
                  </div>

                  {/* Trust indicator */}
                  <div className="border border-swiss-charcoal/10 bg-swiss-cream p-5 rounded-lg flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-mono text-swiss-charcoal/40 uppercase tracking-wider mb-1">// Value Prop 3-Second Polish</h4>
                      <p className="text-xs font-serif leading-relaxed italic text-swiss-charcoal/80">
                        "{result.valuePropEvaluation.clarity}"
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-swiss-accent font-semibold uppercase mt-2">
                      Angle: {result.valuePropEvaluation.psychologicalAngle}
                    </div>
                  </div>
                </div>

                {/* Premium Perception Verdict */}
                <div className="border border-swiss-charcoal/10 bg-white p-5 rounded-lg">
                  <h4 className="text-xs font-mono text-swiss-charcoal/40 uppercase tracking-widest mb-2">// Brand Integrity Analysis</h4>
                  <p className="text-xs leading-relaxed text-swiss-charcoal/80 font-sans">
                    {result.premiumPerception}
                  </p>
                </div>

                {/* Persuasive Friction Blocks */}
                <div className="border border-swiss-charcoal/10 bg-white p-5 rounded-lg space-y-4">
                  <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-widest border-b border-swiss-charcoal/5 pb-2">
                    ⚠️ Conversion Friction & Credibility Flaws
                  </h4>

                  <div className="space-y-4">
                    {result.frictionPoints.map((pt, idx) => (
                      <div key={idx} className="border border-swiss-charcoal/10 rounded overflow-hidden text-xs">
                        <div className="bg-swiss-grey p-3 border-b border-swiss-charcoal/10 flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-swiss-accent font-semibold uppercase">ANOMALY {idx + 1}: {pt.frictionType}</span>
                            <div className="font-sans font-medium text-swiss-charcoal leading-relaxed bg-white px-2 py-1 rounded">
                              "{pt.element}"
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-3 bg-white">
                          <div>
                            <div className="text-[10px] font-mono text-swiss-charcoal/40 uppercase mb-0.5">Why this reduces Conversion</div>
                            <p className="text-swiss-charcoal leading-relaxed">{pt.whyItFails}</p>
                          </div>

                          <div className="border-t border-swiss-charcoal/5 pt-3 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-700 font-bold uppercase">
                              <span>Premium Psychological Corrective Solution</span>
                              <button
                                onClick={() => copyCodeToClipboard(pt.improvement, idx)}
                                className="text-swiss-charcoal/40 hover:text-swiss-charcoal transition-colors font-normal lowercase flex items-center gap-1"
                              >
                                {copiedIndex === idx ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>copied params</span>
                                  </>
                                ) : (
                                  <span>copy parameter</span>
                                )}
                              </button>
                            </div>
                            <p className="font-mono text-[11px] text-emerald-800 bg-emerald-500/5 px-2.5 py-2 border-l-2 border-emerald-500 leading-relaxed font-semibold">
                              {pt.improvement}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="border border-swiss-charcoal/5 bg-swiss-grey/30 rounded-lg p-12 text-center h-[350px] flex flex-col items-center justify-center">
                <Layout className="w-12 h-12 text-swiss-charcoal/15 mb-2" />
                <h4 className="font-serif italic text-base text-swiss-charcoal">Conversion Simulation Standby</h4>
                <p className="text-xs text-swiss-charcoal/40 mt-1 max-w-sm">
                  Select a classic landing copy preset to analyze trust indicators instantly, or write custom copy drafts in the sandboxed editor.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
