import React from 'react';

interface FeaturesBadgesProps {
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  /** Real project counts per filter id, shown on the badge so it's clear what clicking it actually does. */
  counts?: Record<string, number>;
}

export const FeaturesBadges: React.FC<FeaturesBadgesProps> = ({ selectedTag, onSelectTag, counts }) => {
  const features = [
    {
      id: 'pcb',
      label: 'PCB Design',
      icon: 'layers',
      color: 'border-b-[#FF003C] text-[#FF003C]',
      glow: 'hover:shadow-[0_0_20px_rgba(255,0,60,0.4)]'
    },
    {
      id: 'firmware',
      label: 'Firmware',
      icon: 'developer_board',
      color: 'border-b-[#FF4D00] text-[#FF4D00]',
      glow: 'hover:shadow-[0_0_20px_rgba(255,77,0,0.4)]'
    },
    {
      id: 'high-speed',
      label: '4+ Layer PCBs',
      icon: 'memory',
      color: 'border-b-[#00F0FF] text-[#00F0FF]',
      glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
    }
  ];

  return (
    <section className="px-5 md:px-16 py-8 flex flex-wrap justify-center gap-6 z-10 relative">
      {features.map((feat) => {
        const isSelected = selectedTag === feat.id;
        return (
          <button
            key={feat.id}
            onClick={() => onSelectTag(isSelected ? null : feat.id)}
            className={`backdrop-blur-xl bg-white/5 px-6 py-3.5 flex items-center gap-3 transition-all duration-300 border border-white/15 border-b-2 ${
              feat.color
            } ${feat.glow} cursor-pointer group rounded-sm ${
              isSelected ? 'bg-white/15 ring-1 ring-white/30 scale-105' : 'hover:scale-[1.02]'
            }`}
          >
            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
              {feat.icon}
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold tracking-[0.15em] text-[#F0F0F0]">
              {feat.label}
            </span>
            {counts && (
              <span className="font-['JetBrains_Mono',monospace] text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                {counts[feat.id] ?? 0}
              </span>
            )}
            {isSelected && (
              <span className="font-['JetBrains_Mono',monospace] text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white ml-2">
                FILTERED
              </span>
            )}
          </button>
        );
      })}
    </section>
  );
};
