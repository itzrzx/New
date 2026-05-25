import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Image as ImageIcon, AlertCircle, Copy, Check, EyeOff, LayoutTemplate, Zap, RefreshCw } from 'lucide-react';
import { SAMPLE_IMAGES, DEMO_IMAGE_RESULTS } from '../data';
import { ImageAnalysisResult } from '../types';

interface VisualEngineProps {
  apiKeyAvailable: boolean;
}

export default function VisualEngine({ apiKeyAvailable }: VisualEngineProps) {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customMimeType, setCustomMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Analysis Result
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Simulated professional scanning stages
  const loadingSteps = [
    'Scanning skin specular highlights and reflection catchlights...',
    'Analyzing Edge sharpness distribution and mathematical contrast lines...',
    'Deconvolving isotropic specular glows and lense refraction models...',
    'Measuring Lambertian subsurface scattering and pore geometry variance...',
    'Mapping atmospheric haze coefficient and volumetric shadow occlusion...',
    'Synthesizing structural perception verdict under attention retention logic...'
  ];

  const handleSampleClick = (id: string) => {
    setSelectedSample(id);
    setCustomImage(null);
    setCustomMimeType(null);
    setError(null);
    
    // Auto load historical high-quality mock data instantly for immediate viewing confidence,
    // or let them run/rerun to hit the server if they want!
    setResult(DEMO_IMAGE_RESULTS[id]);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const processUploadedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file format. Please upload a PNG, JPEG, or WEBP image.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedSample(null);
      setResult(null);

      // Read image
      setLoadingStep('Ingesting visual payload...');
      const base64Str = await convertToBase64(file);
      setCustomImage(base64Str);
      setCustomMimeType(file.type);

      // Trigger actual server analysis
      await runServerAnalysis(base64Str, file.type);
    } catch (err: any) {
      setError(err.message || 'Error processing uploaded image.');
      setLoading(false);
    }
  };

  const runServerAnalysis = async (base64: string, mime: string) => {
    setLoading(true);
    let stepIndex = 0;
    setLoadingStep(loadingSteps[0]);

    // Interval to cycle through cool psychological scanning stages
    const stepInterval = setInterval(() => {
      if (stepIndex < loadingSteps.length - 1) {
        stepIndex++;
        setLoadingStep(loadingSteps[stepIndex]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/analyze/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mime
        })
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze custom image.');
      }

      setResult(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'System encountered an error during image perception synthesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const copyFixToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Get currently displayed image source
  const getActiveImageSrc = () => {
    if (customImage) return customImage;
    if (selectedSample) {
      const found = SAMPLE_IMAGES.find(s => s.id === selectedSample);
      return found ? found.imageUrl : '';
    }
    return '';
  };

  return (
    <div className="space-y-8 animate-fade-in" id="visual-engine-container">
      {/* Visual Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Input Control Area (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-swiss-charcoal/10 bg-swiss-cream p-6 rounded-lg">
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase">
              // Step 01: Ingest Visual Payload
            </h3>
            
            {/* Drag & Drop Upload Zone */}
            <div
              ref={dragRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                isDragging 
                  ? 'border-swiss-accent bg-swiss-accent/5' 
                  : 'border-swiss-charcoal/20 hover:border-swiss-charcoal/50 hover:bg-swiss-grey/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <Upload className={`w-8 h-8 mb-3 transition-colors ${isDragging ? 'text-swiss-accent' : 'text-swiss-charcoal/40'}`} />
              <p className="text-xs font-medium text-swiss-charcoal">
                Drag & drop your visual here, or <span className="text-swiss-accent underline">browse</span>
              </p>
              <span className="text-[10px] text-swiss-charcoal/40 mt-1 font-mono">PNG, JPG, WEBP • Max 15MB</span>
            </div>

            {/* Presets Grid */}
            <div>
              <div className="text-[11px] font-mono text-swiss-charcoal/40 uppercase mb-2">
                Or explore standard synthetic presets
              </div>
              <div className="space-y-2">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample.id)}
                    className={`w-full text-left p-2.5 rounded border transition-all text-xs flex items-center justify-between gap-2 ${
                      selectedSample === sample.id
                        ? 'border-swiss-charcoal bg-swiss-grey font-medium'
                        : 'border-swiss-charcoal/10 bg-white/70 hover:border-swiss-charcoal/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-swiss-accent/70" />
                      <span className="truncate">{sample.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-swiss-charcoal/40 uppercase pr-1">Demos</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-swiss-charcoal/5 flex items-center gap-2">
            {!apiKeyAvailable && (
              <div className="p-2 border border-yellow-500/20 bg-yellow-400/5 text-yellow-800 rounded text-[11px] leading-snug flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Limited Preview Mode</strong>: Since <code>GEMINI_API_KEY</code> is not provided, you can study the dynamic pre-synthesized sample cases above. Configure your Secrets panel in the editor menu to analyze user-uploaded files.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Media Viewer (7 cols) */}
        <div className="lg:col-span-7 border border-swiss-charcoal/10 bg-swiss-grey p-6 rounded-lg flex flex-col justify-between relative overflow-hidden min-h-[280px]">
          <h3 className="text-xs font-mono tracking-wider text-swiss-charcoal/40 uppercase mb-4">
            // Visual Frame Monitor
          </h3>

          <div className="flex-1 flex items-center justify-center relative">
            {getActiveImageSrc() ? (
              <div className="relative max-h-[220px] rounded overflow-hidden shadow-inner border border-swiss-charcoal/10">
                <img 
                  src={getActiveImageSrc()} 
                  alt="Viewport analyze payload" 
                  className="object-contain max-h-[220px]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated scanline animation if loading */}
                {loading && (
                  <div className="absolute inset-x-0 h-1 bg-swiss-accent/80 blur-xs shadow-lg animate-[bounce_2s_infinite]" />
                )}
              </div>
            ) : (
              <div className="text-center text-swiss-charcoal/40 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-2 text-swiss-charcoal/20" />
                <p className="text-xs">No active visual frame loaded.</p>
                <p className="text-[10px] mt-1">Upload an image or select a synthetic preset to trigger evaluation.</p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-swiss-charcoal/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white"
              >
                <RefreshCw className="w-8 h-8 text-swiss-accent animate-spin mb-4" />
                <h4 className="font-serif italic text-lg mb-1">Scanning Subconscious Cues...</h4>
                <p className="font-mono text-[11px] text-swiss-grey/50 max-w-sm animate-pulse">
                  {loadingStep}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-400/5 text-red-800 rounded-lg text-xs flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-semibold">Analysis Failure:</span> {error}
            <p className="mt-1 text-red-700/80 font-mono text-[11px]">
              If you uploaded a custom file, verify that you provided a complete GEMINI_API_KEY. Otherwise, click one of the preloaded presets.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
          >
            {/* KPI Metrics Dashboard Container (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              
              {/* AI-ish Score */}
              <div className="border border-swiss-charcoal/10 bg-white p-6 rounded-lg text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 font-mono text-[10px] text-swiss-charcoal/30">// CORE_METRIC</div>
                <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-wider mb-2">Synthetic Propensity Score</h4>
                <div className="flex items-baseline justify-center gap-1.5 my-4">
                  <span className={`text-6xl font-serif font-semibold tracking-tight ${
                    result.aiScore > 75 ? 'text-swiss-accent' : result.aiScore > 45 ? 'text-amber-600' : 'text-emerald-700'
                  }`}>
                    {result.aiScore}%
                  </span>
                </div>
                
                {/* Score context */}
                <div className="text-[11px] font-mono uppercase bg-swiss-cream py-1 px-2 rounded inline-block text-swiss-charcoal/60">
                  {result.aiScore > 70 
                    ? '⚠️ CRITICAL AI SIGNATURES' 
                    : result.aiScore > 40 
                      ? '⚠️ SUBTLE OVERPOLISH WARNING' 
                      : '✓ HIGH ANALOG AUTONOMY'}
                </div>
                <p className="text-[11px] text-swiss-charcoal/40 mt-3 font-sans leading-relaxed">
                  Higher scores trigger human "AI premonitions" subconsciously, driving immediate visual blindness and bypass.
                </p>
              </div>

              {/* Subconscious Retention Potential */}
              <div className="border border-swiss-charcoal/10 bg-white p-6 rounded-lg flex flex-col justify-between h-[160px] relative">
                <div className="absolute top-2 right-2 font-mono text-[10px] text-swiss-charcoal/30">// SCROLL_RESIST</div>
                <div>
                  <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-wider">Subconscious Pause Rate</h4>
                  <div className="text-3xl font-serif tracking-tight font-semibold mt-2 text-swiss-charcoal">
                    {result.retentionPotential}%
                  </div>
                </div>
                <div>
                  {/* Visual Bar representation */}
                  <div className="w-full bg-swiss-cream h-2.5 rounded-full overflow-hidden border border-swiss-charcoal/5 mt-3">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        result.retentionPotential > 70 ? 'bg-emerald-600' : result.retentionPotential > 40 ? 'bg-amber-500' : 'bg-swiss-accent'
                      }`}
                      style={{ width: `${result.retentionPotential}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-swiss-charcoal/40 mt-1">
                    <span>SCROLL PAST</span>
                    <span>PAUSE & STUDY</span>
                  </div>
                </div>
              </div>

            </div>

            {/* In-depth Psychology Feedback & Fixes (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Verdict paragraph */}
              <div className="border border-swiss-charcoal/10 bg-swiss-cream p-6 rounded-lg">
                <h4 className="text-xs font-mono text-swiss-charcoal/40 uppercase tracking-wider mb-2">Psychological Synthesis Verdict</h4>
                <p className="font-serif text-lg leading-relaxed text-swiss-charcoal/95 italic">
                  "{result.verdict}"
                </p>
              </div>

              {/* Authenticity Breaks */}
              <div className="border border-swiss-charcoal/10 bg-white p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center border-b border-swiss-charcoal/5 pb-2">
                  <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-wide">
                    Identified Authenticity Breaks (Friction)
                  </h4>
                  <span className="font-mono text-[10px] text-swiss-charcoal/30">SCANNED ANOMALIES</span>
                </div>
                
                <div className="space-y-4 divide-y divide-swiss-charcoal/5">
                  {result.problems.map((prob, idx) => (
                    <div key={idx} className={`pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-xs font-semibold text-swiss-charcoal tracking-tight font-sans">
                          {prob.category}
                        </span>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-2.5 h-1.5 rounded-sm ${
                                i < prob.intensity 
                                  ? 'bg-swiss-accent/80' 
                                  : 'bg-swiss-grey'
                              }`} 
                            />
                          ))} 
                        </div>
                      </div>
                      <p className="text-xs text-swiss-charcoal/70 leading-relaxed max-w-2xl">
                        {prob.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cinematic Fixes */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono text-swiss-charcoal/50 uppercase tracking-wide">
                    ⚡ Recommended Cinematic Fixes
                  </h4>
                  <span className="font-mono text-[10px] text-swiss-charcoal/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-swiss-accent" /> ACTION_MATRIX
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.fixes.map((fix, idx) => (
                    <div 
                      key={idx} 
                      className="border border-swiss-charcoal/10 bg-swiss-grey p-5 rounded-lg flex flex-col justify-between gap-4 group hover:border-swiss-charcoal/30 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-semibold text-swiss-charcoal bg-white px-2.5 py-1 rounded inline-block border border-swiss-charcoal/10 font-mono">
                            {idx + 1}. {fix.title}
                          </span>
                          <button
                            onClick={() => copyFixToClipboard(`${fix.title}: ${fix.action}`, idx)}
                            className="text-swiss-charcoal/40 hover:text-swiss-charcoal transition-colors p-1"
                            title="Copy fix parameters"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-swiss-charcoal font-sans leading-relaxed pt-1 font-medium">
                          {fix.action}
                        </p>
                      </div>
                      
                      <div className="bg-white/60 p-2.5 rounded text-[11px] font-sans leading-relaxed text-swiss-charcoal/60 border-l-2 border-swiss-accent/60">
                        <span className="font-semibold text-swiss-charcoal">Psychological Hack</span>: {fix.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
