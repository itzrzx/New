import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VisualEngine from './components/VisualEngine';
import NarrativeEngine from './components/NarrativeEngine';
import LandingEngine from './components/LandingEngine';
import { AnalysisType } from './types';
import { Sparkles, Eye, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AnalysisType>('image');
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Read backend status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          setApiKeyAvailable(data.apiKeyAvailable);
        }
      } catch (err) {
        console.warn('System status check skipped/offline.');
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-swiss-cream selection:bg-swiss-accent selection:text-white px-4 py-8 md:px-12 md:py-16 max-w-7xl mx-auto flex flex-col justify-between">
      
      {/* Prime Header Block */}
      <div className="space-y-6">
        <Header userEmail="maheshjha8650143117@gmail.com" />

        {/* Dynamic Mode Switcher (Tab Menu) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-swiss-charcoal/10 pb-4">
          <button
            onClick={() => setActiveTab('image')}
            className={`text-left p-4 rounded-lg transition-all border flex flex-col justify-between h-[110px] cursor-pointer group ${
              activeTab === 'image'
                ? 'border-swiss-charcoal bg-swiss-charcoal text-swiss-cream'
                : 'border-swiss-charcoal/10 bg-white hover:border-swiss-charcoal/30 text-swiss-charcoal'
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">System Module 01</span>
            <div>
              <h4 className="font-serif italic text-base">Visual Authenticity</h4>
              <p className="text-[11px] opacity-70 mt-0.5 max-w-xs truncate font-sans">
                "Why does my image look AI-generated?"
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('narrative')}
            className={`text-left p-4 rounded-lg transition-all border flex flex-col justify-between h-[110px] cursor-pointer group ${
              activeTab === 'narrative'
                ? 'border-swiss-charcoal bg-swiss-charcoal text-swiss-cream'
                : 'border-swiss-charcoal/10 bg-white hover:border-swiss-charcoal/30 text-swiss-charcoal'
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">System Module 02</span>
            <div>
              <h4 className="font-serif italic text-base">Narrative & Pacing</h4>
              <p className="text-[11px] opacity-70 mt-0.5 max-w-xs truncate font-sans">
                "Why are viewers leaving my hook?"
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className={`text-left p-4 rounded-lg transition-all border flex flex-col justify-between h-[110px] cursor-pointer group ${
              activeTab === 'landing'
                ? 'border-swiss-charcoal bg-swiss-charcoal text-swiss-cream'
                : 'border-swiss-charcoal/10 bg-white hover:border-swiss-charcoal/30 text-swiss-charcoal'
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">System Module 03</span>
            <div>
              <h4 className="font-serif italic text-base">Cognitive Conversion</h4>
              <p className="text-[11px] opacity-70 mt-0.5 max-w-xs truncate font-sans">
                "Why is this landing page ignored?"
              </p>
            </div>
          </button>
        </div>

        {/* Core Workspace Output Viewport */}
        <main className="py-2">
          {activeTab === 'image' && <VisualEngine apiKeyAvailable={apiKeyAvailable} />}
          {activeTab === 'narrative' && <NarrativeEngine apiKeyAvailable={apiKeyAvailable} />}
          {activeTab === 'landing' && <LandingEngine apiKeyAvailable={apiKeyAvailable} />}
        </main>
      </div>

      {/* Philosophy Callout & System Specs Footer */}
      <footer className="mt-16 pt-8 border-t border-swiss-charcoal/10 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-swiss-charcoal/50 leading-relaxed font-sans pb-4">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-swiss-charcoal/70 tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-swiss-accent" />
            <span>The Attention Infrastructure Thesis</span>
          </div>
          <p className="max-w-2xl text-[11px]">
            In the era of infinite production speed, raw content generation has become cheap. The core bottleneck has shifted upward: when creation is free, <span className="font-semibold text-swiss-charcoal">human attention</span> becomes the scarcest resource in the market. The next generation of legendary brands will succeed not on coding volume or synthetic speed, but on deep perception, visual psychology, and relentless authenticity.
          </p>
        </div>
        
        <div className="md:col-span-4 flex flex-col md:items-end justify-between font-mono text-[10px]">
          <div className="text-right">
            <span>ENGINES: </span>
            <span className="bg-swiss-charcoal text-swiss-cream px-1.5 py-0.5 rounded text-[9px] font-bold">GEMINI-3.5-FLASH</span>
          </div>
          <div className="text-right mt-2 text-[9px] text-swiss-charcoal/40 uppercase">
            Designed for perception • AI Studio Build Space
          </div>
        </div>
      </footer>

    </div>
  );
}
