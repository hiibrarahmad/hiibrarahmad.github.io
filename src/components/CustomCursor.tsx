import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [componentIndex, setComponentIndex] = useState(0);
  const [snippetIndex, setSnippetIndex] = useState(0);

  const snippets = [
    'probe_init()',
    'for(int i=0; i<N; i++)',
    'while(!ready)',
    'uint32_t buffer[256]',
    '0xFA21_SOC_ONLINE',
    '[MCU_INITIALIZED]',
    'SPI_TX(0x80)',
    'I2C_READ_SENSOR()',
    'CLK_FREQ: 480MHz',
    'IMPEDANCE: 50_OHM',
    'VREF: 3.30V_NOMINAL',
    'NOISE: < 8µV_RMS'
  ];

  const components = [
    {
      name: 'RESISTOR 10kΩ',
      render: () => (
        <svg width="38" height="22" viewBox="0 0 38 22" fill="none" className="drop-shadow-[0_0_10px_rgba(255,165,0,0.85)]">
          {/* Wire Leads */}
          <line x1="0" y1="11" x2="9" y2="11" stroke="#E0E0E0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="29" y1="11" x2="38" y2="11" stroke="#E0E0E0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Resistor Body */}
          <rect x="9" y="4" width="20" height="14" rx="4" fill="#EAD2AC" stroke="#CBB089" strokeWidth="1" />
          {/* Color Bands: Brown, Black, Orange, Gold */}
          <rect x="12" y="4" width="2.5" height="14" fill="#8B4513" />
          <rect x="16.5" y="4" width="2.5" height="14" fill="#000000" />
          <rect x="21" y="4" width="2.5" height="14" fill="#FF4500" />
          <rect x="25.5" y="4" width="2" height="14" fill="#FFD700" />
        </svg>
      ),
    },
    {
      name: 'CAPACITOR 10µF',
      render: () => (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none" className="drop-shadow-[0_0_10px_rgba(0,240,255,0.85)]">
          {/* Ceramic SMD Body */}
          <rect x="6" y="5" width="22" height="12" rx="2.5" fill="#C2A683" stroke="#A3835B" strokeWidth="1" />
          {/* Silver End Terminals */}
          <rect x="4" y="4" width="6" height="14" rx="1.5" fill="#E0E0E0" stroke="#FFFFFF" strokeWidth="0.5" />
          <rect x="24" y="4" width="6" height="14" rx="1.5" fill="#E0E0E0" stroke="#FFFFFF" strokeWidth="0.5" />
          {/* Polarity Line */}
          <line x1="17" y1="5" x2="17" y2="17" stroke="#80623B" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      name: 'IC CORTEX-M7',
      render: () => (
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]">
          {/* IC Body */}
          <rect x="6" y="6" width="22" height="22" rx="2" fill="#141416" stroke="#00F0FF" strokeWidth="1.2" />
          {/* Pin 1 Dot */}
          <circle cx="10" cy="10" r="1.5" fill="#FF003C" />
          {/* Top/Bottom Pins */}
          <rect x="10" y="2" width="2" height="4" fill="#E0E0E0" />
          <rect x="16" y="2" width="2" height="4" fill="#E0E0E0" />
          <rect x="22" y="2" width="2" height="4" fill="#E0E0E0" />
          <rect x="10" y="28" width="2" height="4" fill="#E0E0E0" />
          <rect x="16" y="28" width="2" height="4" fill="#E0E0E0" />
          <rect x="22" y="28" width="2" height="4" fill="#E0E0E0" />
          {/* Left/Right Pins */}
          <rect x="2" y="10" width="4" height="2" fill="#E0E0E0" />
          <rect x="2" y="16" width="4" height="2" fill="#E0E0E0" />
          <rect x="2" y="22" width="4" height="2" fill="#E0E0E0" />
          <rect x="28" y="10" width="4" height="2" fill="#E0E0E0" />
          <rect x="28" y="16" width="4" height="2" fill="#E0E0E0" />
          <rect x="28" y="22" width="4" height="2" fill="#E0E0E0" />
        </svg>
      ),
    },
    {
      name: 'ELECTROLYTIC 47µF',
      render: () => (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="drop-shadow-[0_0_10px_rgba(0,191,255,0.85)]">
          {/* Aluminum Can Top */}
          <circle cx="15" cy="15" r="11" fill="#1E293B" stroke="#00F0FF" strokeWidth="1.5" />
          {/* Vent Cross */}
          <line x1="8" y1="15" x2="22" y2="15" stroke="#475569" strokeWidth="1.5" />
          <line x1="15" y1="8" x2="15" y2="22" stroke="#475569" strokeWidth="1.5" />
          {/* Negative Stripe Band */}
          <path d="M 8 8 A 11 11 0 0 0 8 22 L 13 22 A 11 11 0 0 1 13 8 Z" fill="#00F0FF" opacity="0.85" />
        </svg>
      ),
    },
    {
      name: 'INDUCTOR 2.2µH',
      render: () => (
        <svg width="34" height="24" viewBox="0 0 34 24" fill="none" className="drop-shadow-[0_0_10px_rgba(255,77,0,0.85)]">
          {/* Ferrite Core */}
          <rect x="4" y="3" width="26" height="18" rx="2.5" fill="#1C1C1E" stroke="#FF4D00" strokeWidth="1" />
          {/* Copper Winding Coils */}
          <path d="M 8 6 Q 12 18 15 6 Q 18 18 21 6 Q 24 18 27 6" stroke="#B87333" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'CRYSTAL 16MHz',
      render: () => (
        <svg width="36" height="22" viewBox="0 0 36 22" fill="none" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]">
          {/* Metallic Can */}
          <rect x="7" y="3" width="22" height="16" rx="8" fill="#D1D5DB" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Base Rim */}
          <rect x="5" y="2" width="2" height="18" fill="#6B7280" />
          {/* Lead Pins */}
          <line x1="0" y1="11" x2="5" y2="11" stroke="#9CA3AF" strokeWidth="2.5" />
          <line x1="29" y1="11" x2="36" y2="11" stroke="#9CA3AF" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      name: 'LED DIODE 3.3V',
      render: () => (
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" className="drop-shadow-[0_0_15px_rgba(0,240,255,1)]">
          {/* Epoxy Dome */}
          <path d="M 6 16 C 6 6, 22 6, 22 16 L 22 20 L 6 20 Z" fill="#00F0FF" opacity="0.85" stroke="#00F0FF" strokeWidth="1" />
          {/* Anode/Cathode Leads */}
          <line x1="10" y1="20" x2="10" y2="30" stroke="#E0E0E0" strokeWidth="2" />
          <line x1="18" y1="20" x2="18" y2="28" stroke="#E0E0E0" strokeWidth="2" />
          {/* Internal Anvil / Post */}
          <path d="M 9 18 L 12 13 L 15 18 Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: 'MOSFET SOT-23',
      render: () => (
        <svg width="32" height="26" viewBox="0 0 32 26" fill="none" className="drop-shadow-[0_0_10px_rgba(255,0,60,0.85)]">
          {/* Black Epoxy Molding */}
          <rect x="6" y="7" width="20" height="12" rx="1.5" fill="#18181B" stroke="#FF003C" strokeWidth="1" />
          {/* Gate/Source Pins Left */}
          <rect x="1" y="9" width="5" height="2.5" rx="0.5" fill="#E0E0E0" />
          <rect x="1" y="14.5" width="5" height="2.5" rx="0.5" fill="#E0E0E0" />
          {/* Drain Pin Right */}
          <rect x="26" y="11.5" width="5" height="3" rx="0.5" fill="#E0E0E0" />
        </svg>
      ),
    },
    {
      name: 'SCHOTTKY DIODE',
      render: () => (
        <svg width="34" height="20" viewBox="0 0 34 20" fill="none" className="drop-shadow-[0_0_10px_rgba(0,255,128,0.85)]">
          {/* SOD-123 Package */}
          <rect x="6" y="4" width="22" height="12" rx="2" fill="#18181A" stroke="#00FF80" strokeWidth="1" />
          {/* Silver Cathode Band */}
          <rect x="8" y="4" width="4" height="12" fill="#00FF80" />
          {/* End Contacts */}
          <rect x="2" y="6" width="4" height="8" fill="#E0E0E0" />
          <rect x="28" y="6" width="4" height="8" fill="#E0E0E0" />
        </svg>
      ),
    },
    {
      name: 'TACTILE SWITCH',
      render: () => (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="drop-shadow-[0_0_10px_rgba(255,165,0,0.85)]">
          {/* Switch Base */}
          <rect x="4" y="4" width="20" height="20" rx="3" fill="#27272A" stroke="#FFA500" strokeWidth="1" />
          {/* Circular Button Actuator */}
          <circle cx="14" cy="14" r="6" fill="#FF003C" />
          {/* Corner Solder Pins */}
          <rect x="1" y="5" width="3" height="4" fill="#E0E0E0" />
          <rect x="1" y="19" width="3" height="4" fill="#E0E0E0" />
          <rect x="24" y="5" width="3" height="4" fill="#E0E0E0" />
          <rect x="24" y="19" width="3" height="4" fill="#E0E0E0" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Random component change interval (every 2.5 seconds)
    const componentTimer = setInterval(() => {
      setComponentIndex((prev) => (prev + 1) % components.length);
    }, 2500);

    // Code snippet text change interval (every 1.8 seconds)
    const snippetTimer = setInterval(() => {
      setSnippetIndex((prev) => (prev + 1) % snippets.length);
    }, 1800);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(componentTimer);
      clearInterval(snippetTimer);
    };
  }, [components.length, snippets.length]);

  const currentComponent = components[componentIndex];

  return (
    <div
      className="hidden md:block fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        top: 0,
        left: 0,
      }}
    >
      {/* Component Icon replacing old circular cursor */}
      <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center scale-110 transform transition-all duration-300">
        {currentComponent.render()}
      </div>

      {/* Hardware component label & Code telemetry snippet tag */}
      <div className="absolute top-4 left-5 flex flex-col gap-0.5">
        <div className="text-[9px] font-['JetBrains_Mono',monospace] font-bold text-[#FF4D00] bg-black/80 px-1.5 py-0.5 border border-[#FF4D00]/40 rounded backdrop-blur-md shadow-md tracking-wider uppercase whitespace-nowrap">
          {currentComponent.name}
        </div>
        <div className="text-[10px] font-['JetBrains_Mono',monospace] text-[#00F0FF] tracking-wider whitespace-nowrap opacity-90 bg-black/80 px-1.5 py-0.5 border border-[#00F0FF]/40 rounded backdrop-blur-md shadow-md">
          {snippets[snippetIndex]}
        </div>
      </div>
    </div>
  );
};
