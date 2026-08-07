import React from 'react';
import { SystemTelemetry } from '../types';

interface FooterProps {
  telemetry: SystemTelemetry;
}

export const Footer: React.FC<FooterProps> = ({ telemetry }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/15 flex flex-col md:flex-row justify-between items-center px-5 md:px-16 py-6 w-full max-w-[1440px] mx-auto relative z-50 transition-colors">
      <div className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] mb-4 md:mb-0 tracking-wider">
        © 2024 IBRAR AHMAD // MISSION CONTROL
      </div>

      <div className="flex flex-wrap gap-6 items-center justify-center">
        <span className="font-['JetBrains_Mono',monospace] text-sm md:text-base font-semibold text-[#FF4D00] hover:text-[#00F0FF] transition-colors duration-500 hover:shadow-[0_0_15px_#00F0FF] cursor-default flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
          SYSTEM {telemetry.systemStatus}
        </span>
        <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] hover:text-[#00F0FF] transition-colors">
          LATENCY: {telemetry.latencyMs}MS
        </span>
        <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c6c6c7] hover:text-[#00F0FF] transition-colors">
          UPTIME: {telemetry.uptime}
        </span>
      </div>
    </footer>
  );
};
