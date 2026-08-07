import React from 'react';
import { ScrambleText } from './ScrambleText';

interface NavBarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenConnectModal: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  activeSection,
  setActiveSection,
  onOpenConnectModal
}) => {
  const navItems = [
    { id: 'hardware', label: 'HARDWARE' },
    { id: 'schematics', label: 'SCHEMATICS' },
    { id: 'lab', label: 'LAB' },
    { id: 'about', label: 'ABOUT' },
  ];

  return (
    <nav className="bg-[#131313]/80 backdrop-blur-xl sticky top-0 border-b border-white/15 flex justify-between items-center px-5 md:px-16 py-4 w-full max-w-[1440px] mx-auto z-50 transition-all">
      {/* Brand logo replaced with hiibrarahmad & scramble effect */}
      <button 
        onClick={() => setActiveSection('hardware')}
        className="font-['Space_Grotesk',sans-serif] text-2xl md:text-[24px] font-bold tracking-tighter text-[#F0F0F0] hover:text-[#00F0FF] transition-colors text-left group"
      >
        <span className="text-[#FF003C] font-mono text-sm mr-1 group-hover:animate-ping inline-block">●</span>
        <ScrambleText text="hiibrarahmad" scrambleOnHover={true} autostart={false} />
      </button>

      {/* Navigation links */}
      <div className="hidden md:flex gap-8 items-center">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`font-['JetBrains_Mono',monospace] text-xs font-bold tracking-[0.15em] transition-colors relative py-1 ${
                isActive ? 'text-[#00F0FF]' : 'text-[#e2e2e2] hover:text-[#F0F0F0]'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {/* Admin dashboard entry point (project data editor) */}
        <button
          onClick={() => { window.location.hash = 'admin'; }}
          title="Project Admin Dashboard"
          className="text-[#c6c6c7] hover:text-[#00F0FF] transition-colors p-2 rounded hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-lg align-middle">settings</span>
        </button>

        {/* Thrust Connect button */}
        <button
          onClick={onOpenConnectModal}
          className="bg-[#FF003C] text-[#F0F0F0] font-['JetBrains_Mono',monospace] text-xs font-bold tracking-[0.15em] px-4 py-2 border border-[#FF003C] relative hover:shadow-[0_0_20px_rgba(255,0,60,0.5)] transition-all duration-300 transform active:scale-95 group overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            CONNECT
          </span>
          <div className="absolute inset-0 border border-white/20 translate-x-[4px] translate-y-[4px] pointer-events-none group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </nav>
  );
};
