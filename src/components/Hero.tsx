import React from 'react';
import { ScrambleText } from './ScrambleText';

interface HeroProps {
  totalProjects: number;
  liveCount: number;
  devCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalProjects, liveCount, devCount }) => {
  return (
    <section className="min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center relative px-5 md:px-16 py-16 overflow-hidden">
      {/* Background Cyan Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* System Status Pulsing Badge */}
      <div className="flex items-center gap-2 mb-8 backdrop-blur-xl bg-white/5 border border-[#00F0FF]/50 px-4 py-2 rounded-full pulse-badge shadow-[0_0_12px_rgba(0,240,255,0.2)]">
        <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"></div>
        <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#00F0FF] tracking-widest">
          SYSTEM ONLINE
        </span>
      </div>

      {/* Display Hero Title with futuristic cybernetic accents & text scramble */}
      <div className="relative z-10 text-center group cursor-pointer">
        <div className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#FF003C] tracking-[0.3em] uppercase mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-0.5 bg-[#FF003C]"></span>
          QUANTUM-LEVEL HARDWARE ARCHITECT
          <span className="w-2 h-0.5 bg-[#FF003C]"></span>
        </div>
        <h1 className="font-['Space_Grotesk',sans-serif] text-[52px] sm:text-[72px] md:text-[96px] text-[#F0F0F0] text-center leading-[0.92] tracking-tight font-bold mb-6 drop-shadow-[0_0_35px_rgba(0,240,255,0.25)] hover:text-[#00F0FF] transition-colors">
          <ScrambleText text="IBRAR AHMAD" scrambleOnHover={true} autostart={false} />
        </h1>
      </div>

      {/* Enigmatic & Innovative Subtitle */}
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#d1d1d2] max-w-3xl text-center text-base sm:text-lg md:text-xl leading-relaxed mb-8 relative z-10 font-normal">
        Architecting sub-nanosecond signal pathways and silicon-level intelligence. Where quantum-grade RF integrity, autonomous embedded firmware, and hyper-dense multi-layer schematics collide to engineer tomorrow’s physical reality.
      </p>

      {/* Interactive Enigmatic Hardware Paradigm Cipher Ticker */}
      <div className="mb-12 relative z-10 flex flex-wrap justify-center items-center gap-3 font-['JetBrains_Mono',monospace] text-xs">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-[#00F0FF]/40 rounded-full text-[#00F0FF] flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <span className="material-symbols-outlined text-sm animate-spin">cyclone</span>
          <span>SUB-NANOSECOND SIGNAL INTEGRITY</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-[#FF4D00]/40 rounded-full text-[#FF4D00] flex items-center gap-2 shadow-[0_0_15px_rgba(255,77,0,0.25)]">
          <span className="material-symbols-outlined text-sm">bolt</span>
          <span>HYPER-DENSE MULTI-LAYER PCB SYNTHESIS</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-[#FF003C]/40 rounded-full text-[#FF003C] flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,60,0.25)]">
          <span className="material-symbols-outlined text-sm">memory_alt</span>
          <span>NEURAL EDGE SILICON INFRASTRUCTURE</span>
        </div>
      </div>

      {/* Mission Control Telemetry Stats Bar */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/15 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center px-8 py-6 border-l-4 border-l-[#FF4D00] z-10 gap-6 md:gap-8 rounded-r-lg shadow-2xl">
        {/* TOTAL PROJECTS */}
        <div className="flex flex-col items-center md:items-start">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] tracking-widest mb-1">
            TOTAL
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-2xl md:text-3xl font-semibold text-[#F0F0F0] tracking-wider">
            {totalProjects} PROJECTS
          </span>
        </div>

        <div className="w-full md:w-px h-px md:h-12 bg-white/15"></div>

        {/* STATUS LIVE */}
        <div className="flex flex-col items-center md:items-start">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] tracking-widest mb-1">
            STATUS
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-2xl md:text-3xl font-semibold text-[#00F0FF] tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block animate-ping"></span>
            {liveCount} LIVE
          </span>
        </div>

        <div className="w-full md:w-px h-px md:h-12 bg-white/15"></div>

        {/* STATUS IN DEV */}
        <div className="flex flex-col items-center md:items-start">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] tracking-widest mb-1">
            STATUS
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-2xl md:text-3xl font-semibold text-[#FF4D00] tracking-wider">
            {devCount} IN DEV
          </span>
        </div>
      </div>
    </section>
  );
};
