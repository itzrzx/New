import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FileText, AlertTriangle, Sparkles, CheckCircle2, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { SAMPLE_SCRIPTS, DEMO_NARRATIVE_RESULTS } from '../data';
import { NarrativeAnalysisResult } from '../types';

interface NarrativeEngineProps {
  apiKeyAvailable: boolean;
}

export default function NarrativeEngine({ apiKeyAvailable }: NarrativeEngineProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [formatInput, setFormatInput] = useState('YouTube (10-min Dev/Tech video)');
  const [scriptInput, setScriptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NarrativeAnalysisResult | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const handlePresetSelect = (id: string) => {
    setSelectedPreset(id);
    const preset = SAMPLE_SCRIPTS.find(s => s.id === id);
    if (preset) {
      setTitleInput(preset.title);
      setFormatInput(preset.targetFormat);
      setScriptInput(preset.scriptText);
      setError(null);
      
      // Auto load demo analysis instantly for outstanding UX
      // (User can also hit "Rerun Analysis" if API is set)
      setResult(DEMO_NARRATIVE_RESULTS[id] || null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptInput.trim()) {
      setError('Please provide a video script or hook draft to evaluate.');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedPreset(null);

    try {
      const response = await fetch('/api/analyze/narrative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptText: scriptInput,
          title: titleInput,
          targetFormat: formatInput
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Syntax evaluation failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error executing narrative perception parsing.');
    } finally {
      setLoading(false);
    }
  };

  // Render responsive SVG dual line chart for Tension and Energy curves
  const renderRetentionCurve = () => {
    if (!result || !result.retentionGraph || result.retentionGraph.length === 0) return null;
    
    // SVG Dimensions
    const width = 600;
    const height = 180;
    const paddingLeft = 30;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 20;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Sort nodes by timestamp percent to be secure
    const sortedNodes = [...result.retentionGraph].sort((a, b) => a.timestampPercent - b.timestampPercent);

    // Map mathematical coordinate points
    const getCoords = (node: typeof sortedNodes[0]) => {
      const x = paddingLeft + (node.timestampPercent / 100) * chartW;
      // tension: 0 to 100 mapped to chartH to 0 (higher value = higher up)
      const yTension = paddingTop + chartH - (node.tension / 100) * chartH;
      const yEnergy = paddingTop + chartH - (node.energy / 100) * chartH;
      return { x, yTension, yEnergy };
    };

    const coords = sortedNodes.map(getCoords);

    // Build SVG paths
    let tensionPath = '';
    let energyPath = '';
    
    // Spark and line drawing helper
    coords.forEach((pt, idx) => {
      if (idx === 0) {
        tensionPath = `M ${pt.x} ${pt.yTension}`;
        energyPath = `M ${pt.x} ${pt.yEnergy}`;
      } else {
        // Curve fit
        tensionPath += ` L ${pt.x} ${pt.yTension}`;
        energyPath += ` L ${pt.x} ${pt.yEnergy}`;
      }
    });

    return (
      <div className="border border-swiss-charcoal/10 bg-white p-5 rounded-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-swiss-charcoal/5 pb-2">
          <div>
            <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-widest">// Subconscious Viewer Attention Dynamics</h4>
            <p className="text-[10px] text-swiss-charcoal/40 font-mono mt-0.5">PROGRESS CORRELATION (0% TO 100% TIMELINE)</p>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 bg-swiss-accent" />
              <span className="text-swiss-charcoal/80">CURIOSITY / TENSION</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-swiss-charcoal/40" />
              <span className="text-swiss-charcoal/60">INFORMATION RATE / ENERGY</span>
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft + chartW} y2={paddingTop} stroke="#e5e5e5" strokeDasharray="2 2" />
            <line x1={paddingLeft} y1={paddingTop + chartH/2} x2={paddingLeft + chartW} y2={paddingTop + chartH/2} stroke="#f0f0f0" strokeDasharray="3 3" />
            <line x1={paddingLeft} y1={paddingTop + chartH} x2={paddingLeft + chartW} y2={paddingTop + chartH} stroke="#dcdcd3" />

            {/* Paths */}
            <path d={tensionPath} fill="none" stroke="#ff4500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={energyPath} fill="none" stroke="currentColor" className="text-swiss-charcoal/40" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Nodes */}
            {coords.map((pt, idx) => {
              const node = sortedNodes[idx];
              const isHovered = hoveredNode === idx;

              return (
                <g key={idx}>
                  {/* Invisible expansion target for easy hover */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.yTension} 
                    r="14" 
                    fill="transparent" 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(idx)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />

                  {/* Tension circle indicator */}
                  <circle
                    cx={pt.x}
                    cy={pt.yTension}
                    r={isHovered ? '6' : '3.5'}
                    className="fill-swiss-accent stroke-white hover:stroke-swiss-accent transition-all cursor-pointer"
                    strokeWidth="1.5"
                    onMouseEnter={() => setHoveredNode(idx)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />

                  {/* Energy dot indicator */}
                  <circle
                    cx={pt.x}
                    cy={pt.yEnergy}
                    r="3.5"
                    className="fill-swiss-charcoal/50 stroke-white"
                    strokeWidth="1"
                  />

                  {/* Vertical coordinate marker */}
                  {isHovered && (
                    <line x1={pt.x} y1={paddingTop} x2={pt.x} y2={paddingTop + chartH} stroke="#ff4500" strokeWidth="0.5" strokeDasharray="1 1" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Timeline axis labels */}
          <div className="flex justify-between text-[9px] font-mono text-swiss-charcoal/40 px-1 mt-1">
            <span>0% SEC (HOOK)</span>
            <span>25% TIMELINE</span>
            <span>50% (BODY SETUP)</span>
            <span>75% TIMELINE</span>
            <span>100% SEC (OUTRO)</span>
          </div>
        </div>

        {/* Dynamic Node Explainer Board on Hover/Focus */}
        <div className="bg-swiss-grey p-3.5 rounded-lg border border-swiss-charcoal/5 min-h-[70px] flex flex-col justify-center">
          {hoveredNode !== null ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-swiss-accent uppercase font-bold mb-1">
                <span>Beat {hoveredNode + 1}: {result.retentionGraph[hoveredNode].label}</span>
                <span>Time progress: {result.retentionGraph[hoveredNode].timestampPercent}%</span>
              </div>
              <div className="text-swiss-charcoal font-sans flex items-center justify-between">
                <span>Viewer Tension / Curiosity: <strong className="font-mono text-swiss-accent">{result.retentionGraph[hoveredNode].tension}%</strong></span>
                <span className="text-swiss-charcoal/60">Pacing Speed: <strong className="font-mono text-swiss-charcoal">{result.retentionGraph[hoveredNode].energy}%</strong></span>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-[11px] text-swiss-charcoal/40 font-mono italic">
              ✦ Hover over any custom node markers on the timeline above to read sequence details.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in" id="narrative-engine-container">
      {/* Narrative input layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Input area (5 cols) */}
        <div className="lg:col-span-5 border border-swiss-charcoal/10 bg-swiss-cream p-6 rounded-lg space-y-5">
          <div>
            <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase mb-2">
              // Direct Preset Inspiration
            </h3>
            <div className="space-y-2">
              {SAMPLE_SCRIPTS.map((preset) => (
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
                    <FileText className="w-3.5 h-3.5 text-swiss-charcoal/50" />
                    <span className="truncate max-w-[180px]">{preset.title}</span>
                  </div>
                  <span className="text-[9px] font-mono text-swiss-accent uppercase pr-1">Demos</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-swiss-charcoal/5 pt-4">
            <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase mb-3">
              // Custom Sandbox Evaluation
            </h3>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-swiss-charcoal/50 uppercase mb-1">Content Anchor Title</label>
                <input 
                  type="text" 
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Stop Doing Your To-Do Lists Wrong..."
                  className="w-full text-xs p-2.5 border border-swiss-charcoal/10 bg-white focus:outline-none focus:border-swiss-charcoal/40 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-swiss-charcoal/50 uppercase mb-1">Video Format & Length</label>
                <input 
                  type="text" 
                  value={formatInput}
                  onChange={(e) => setFormatInput(e.target.value)}
                  placeholder="e.g. TikTok (60-sec hook) / YouTube doc"
                  className="w-full text-xs p-2.5 border border-swiss-charcoal/10 bg-white focus:outline-none focus:border-swiss-charcoal/40 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-swiss-charcoal/50 uppercase mb-1">Full Script Text or Hook (Draft)</label>
                <textarea 
                  rows={8}
                  value={scriptInput}
                  onChange={(e) => setScriptInput(e.target.value)}
                  placeholder="Paste your video starting sentence, whole hook, or video script here. Be as authentic as your current version is..."
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
                    SIMULATING ATTENTION BEHAVIOR...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    ANALYZE RETENTION ARC
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output area (7 cols) */}
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
                <h3 className="font-serif italic text-lg text-swiss-charcoal">Triggering Dynamic Viewer Models</h3>
                <p className="font-mono text-xs text-swiss-charcoal/50 mt-2 max-w-sm mx-auto leading-relaxed">
                  Our system is prompting Gemini to map the curiosity drops, detect dry narrative segments, and rewrite dialogue for organic tension...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={result.curiosityScore}
                className="space-y-6"
              >
                {/* Score & Verdict Banner */}
                <div className="border border-swiss-charcoal/10 bg-swiss-cream p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-mono text-swiss-charcoal/40 uppercase mb-1">// Curiosity Gap Appeal</h3>
                    <div className="text-3xl font-serif font-semibold tracking-tight text-swiss-charcoal flex items-baseline gap-1.5">
                      <span className={result.curiosityScore > 65 ? 'text-emerald-700' : result.curiosityScore > 40 ? 'text-amber-600' : 'text-swiss-accent'}>
                        {result.curiosityScore}%
                      </span>
                      <span className="text-sm font-sans font-normal text-swiss-charcoal/50">Curiosity Lock</span>
                    </div>
                  </div>
                  <div className="max-w-md md:text-right">
                    <span className="text-[10px] uppercase font-mono bg-swiss-charcoal/5 px-2 py-0.5 rounded text-swiss-charcoal">Verdict status</span>
                    <p className="text-xs text-swiss-charcoal/70 leading-relaxed mt-1 font-sans">
                      {result.curiosityScore > 65 
                        ? 'Strong visual setups and hook tension. High odds of scrolling pause and timeline retention.' 
                        : result.curiosityScore > 45 
                          ? 'Moderate. Pacing is predictable, risk of viewers skipping early sections is significant.' 
                          : 'Critical Danger. Viewer understands the outcome inside 5 seconds. Pacing feels like a clinical presentation.'}
                    </p>
                  </div>
                </div>

                {/* SVG Curve Plotting block */}
                {renderRetentionCurve()}

                {/* Narrative Danger Zones */}
                <div className="border border-swiss-charcoal/10 bg-white p-5 rounded-lg space-y-4">
                  <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-widest border-b border-swiss-charcoal/5 pb-2">
                    ⚠️ Retention Danger Zones (Drop-off Risks)
                  </h4>
                  
                  {result.dangerZones.length === 0 ? (
                    <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 p-3.5 bg-emerald-50 rounded">
                      <CheckCircle2 className="w-4 h-4" /> No major drop-off zones detected. Pacing feels compact and tension-driven!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {result.dangerZones.map((zone, idx) => (
                        <div key={idx} className="border border-swiss-charcoal/10 rounded overflow-hidden text-xs">
                          {/* Top row detailing section and risk */}
                          <div className="bg-swiss-grey p-3 border-b border-swiss-charcoal/10 space-y-1">
                            <span className="text-[10px] font-mono text-swiss-accent font-semibold uppercase">TRIGGER BLOCK #{idx+1}</span>
                            <div className="font-sans font-medium text-swiss-charcoal/70 italic bg-white/50 px-2 py-1.5 border border-swiss-charcoal/5 rounded font-mono text-[11px] leading-relaxed">
                              "{zone.section}"
                            </div>
                          </div>
                          
                          {/* Inner row detailing why it fails and how to fix */}
                          <div className="p-4 space-y-3 bg-white">
                            <div>
                              <div className="text-[10px] font-mono text-swiss-charcoal/40 uppercase mb-0.5">The Retention Hazard</div>
                              <p className="text-swiss-charcoal leading-relaxed">{zone.issue}</p>
                            </div>
                            
                            <div className="border-t border-swiss-charcoal/5 pt-3">
                              <div className="text-[10px] font-mono text-emerald-700 uppercase mb-0.5 font-bold">Suggested Pacing Corrective Reword</div>
                              <p className="font-mono text-[11px] text-emerald-800 bg-emerald-500/5 px-2.5 py-2 border-l-2 border-emerald-500 leading-relaxed font-semibold">
                                {zone.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subconscious Psychology Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-swiss-charcoal/10 bg-swiss-cream/60 p-5 rounded-lg">
                    <h5 className="text-[11px] font-mono text-swiss-charcoal/40 uppercase tracking-widest mb-1.5">Curiosity Trap Strategy</h5>
                    <p className="text-xs leading-relaxed text-swiss-charcoal/80 font-sans">
                      {result.psychologyBreakdown.curiosityGap}
                    </p>
                  </div>
                  
                  <div className="border border-swiss-charcoal/10 bg-swiss-cream/60 p-5 rounded-lg">
                    <h5 className="text-[11px] font-mono text-swiss-charcoal/40 uppercase tracking-widest mb-1.5">Emotional Leverage Mechanics</h5>
                    <p className="text-xs leading-relaxed text-swiss-charcoal/80 font-sans">
                      {result.psychologyBreakdown.emotionalResonance}
                    </p>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="border border-swiss-charcoal/5 bg-swiss-grey/30 rounded-lg p-12 text-center h-[350px] flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-swiss-charcoal/15 mb-2" />
                <h4 className="font-serif italic text-base text-swiss-charcoal">Perception Simulation Standby</h4>
                <p className="text-xs text-swiss-charcoal/40 mt-1 max-w-sm">
                  Choose an inspiration preset to study pre-modeled retention curves, or draft a hook on the sandbox to run live simulation feedback.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
