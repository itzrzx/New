import React, { useEffect, useState } from 'react';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const [time, setTime] = useState(new Date().toISOString().substring(11, 19));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-swiss-charcoal/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-swiss-accent font-mono text-xs tracking-wider uppercase mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-swiss-accent animate-pulse" />
          System Active // Perception Engine
        </div>
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-swiss-charcoal md:text-4xl">
          Attention & Authenticity <span className="italic font-normal">Intelligence</span>
        </h1>
        <p className="text-sm text-swiss-charcoal/60 mt-2 font-sans max-w-xl leading-relaxed">
          While traditional analytics tell you <span className="font-semibold text-swiss-charcoal">what</span> physical traffic did, this engine decodes the subconscious psychology explaining <span className="font-semibold text-swiss-charcoal">why</span> they left or trusted.
        </p>
      </div>

      <div className="flex flex-col items-start md:items-end gap-1 font-mono text-xs text-swiss-charcoal/50">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-swiss-charcoal/40" />
          <span>UTC TIME: <span className="font-medium text-swiss-charcoal">{time}</span></span>
        </div>
        {userEmail && (
          <div className="text-[10px] tracking-tight bg-swiss-grey px-2 py-0.5 rounded text-swiss-charcoal/70 border border-swiss-charcoal/5 font-sans mt-1">
            {userEmail}
          </div>
        )}
      </div>
    </header>
  );
}
