import React from 'react';

interface RoadmapCategory {
  code: string;
  label: string;
  icon: string;
  status: 'IN PROGRESS' | 'QUEUED';
}

const ROADMAP: RoadmapCategory[] = [
  { code: 'PCB', label: 'PCB Hardware', icon: 'developer_board', status: 'IN PROGRESS' },
  { code: 'FW', label: 'Firmware & Embedded', icon: 'memory', status: 'IN PROGRESS' },
  { code: 'APP', label: 'Apps & Software', icon: 'apps', status: 'QUEUED' },
  { code: 'EEG', label: 'EEG & BCI', icon: 'psychology', status: 'QUEUED' },
  { code: 'AUD', label: 'Audio & TWS', icon: 'graphic_eq', status: 'QUEUED' },
  { code: 'REV', label: 'Reverse Engineering', icon: 'search', status: 'QUEUED' },
  { code: 'DOC', label: 'Docs & Showcase', icon: 'description', status: 'QUEUED' },
  { code: 'LIB', label: 'Libraries & Tools', icon: 'construction', status: 'QUEUED' },
  { code: 'MISC', label: 'Other / Utilities', icon: 'widgets', status: 'QUEUED' },
];

export const CategoryRoadmap: React.FC = () => {
  return (
    <section className="px-5 md:px-16 py-16 relative z-10">
      <div className="flex items-center gap-4 mb-8 border-b border-white/15 pb-4">
        <span className="material-symbols-outlined text-[#FF4D00] text-3xl">route</span>
        <div>
          <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl font-bold text-[#F0F0F0] tracking-wider">
            CATEGORY ROADMAP
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            THE FULL PRJ NUMBERING SCHEME — WHAT'S LIVE AND WHAT'S NEXT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {ROADMAP.map((cat) => (
          <div
            key={cat.code}
            className={`flex flex-col gap-2 p-4 rounded border transition-all ${
              cat.status === 'IN PROGRESS'
                ? 'bg-[#00F0FF]/5 border-[#00F0FF]/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`material-symbols-outlined text-xl ${cat.status === 'IN PROGRESS' ? 'text-[#00F0FF]' : 'text-[#c6c6c7]'}`}>
                {cat.icon}
              </span>
              <span
                className={`font-['JetBrains_Mono',monospace] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                  cat.status === 'IN PROGRESS'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                    : 'bg-white/10 text-[#c6c6c7]'
                }`}
              >
                {cat.status}
              </span>
            </div>
            <div>
              <span className="font-['JetBrains_Mono',monospace] text-[10px] text-white/40 block">{cat.code}</span>
              <span className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-[#F0F0F0]">{cat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
