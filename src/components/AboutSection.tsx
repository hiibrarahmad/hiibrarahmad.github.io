import React from 'react';

export const AboutSection: React.FC = () => {
  const competencies = [
    { title: 'Controlled Impedance PCB Design', desc: '4 to 12-layer stackups with microstrips, striplines, differential pairs, and length-matching down to 0.1mm tolerances.' },
    { title: 'High-Speed Signal Integrity & EMC', desc: 'Ansys HFSS and Altium S-parameter extraction, eye-diagram optimization, crosstalk mitigation, and EMI compliance shielding.' },
    { title: 'Embedded System Firmware', desc: 'Low-level C/C++, FreeRTOS kernel tasks, DMA drivers, STM32/i.MX Cortex-M7 BSPs, and Xilinx FPGA Verilog synthesis.' },
    { title: 'Precision Analog & Power Electronics', desc: 'Sub-microvolt low-noise instrumentation amplifiers, 24-bit delta-sigma ADCs, high-efficiency GaN FET buck converters, and thermal vias dissipation.' },
  ];

  const tools = [
    'Altium Designer 24',
    'KiCad EDA 8',
    'Ansys HFSS 3D EM',
    'Xilinx Vivado ML',
    'STM32CubeIDE',
    'FreeRTOS Kernel',
    'Keysight Oscilloscopes',
    'FLIR Thermal Imager',
    'Rigol Spectrum Analyzer',
    'Git / GitHub LFS'
  ];

  return (
    <section className="px-5 md:px-16 py-12 max-w-[1440px] mx-auto z-10 relative">
      <div className="flex items-center gap-4 mb-8 border-b border-white/15 pb-4">
        <span className="material-symbols-outlined text-[#FF003C] text-3xl">developer_board</span>
        <div>
          <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl font-bold text-[#F0F0F0]">
            ABOUT IBRAR AHMAD
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            Hardware Engineering Philosophy & Technical Stack
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bio Card */}
        <div className="lg:col-span-2 bg-[#1b1b1b] p-8 rounded-xl border border-white/15 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00F0FF]/20 border-2 border-[#00F0FF] flex items-center justify-center text-[#00F0FF] font-['Space_Grotesk',sans-serif] text-2xl font-bold">
              IA
            </div>
            <div>
              <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white">
                IBRAR AHMAD
              </h3>
              <p className="font-['JetBrains_Mono',monospace] text-xs text-[#00F0FF]">
                LEAD HARDWARE ENGINEER // EMBEDDED & PCB ARCHITECT
              </p>
            </div>
          </div>

          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[#d1d1d2] text-base leading-relaxed">
            I pioneer quantum-grade hardware architectures that push physical silicon to its theoretical bounds. From sub-nanosecond controlled-impedance transmission lines and bio-potential optical telemetry to real-time FPGA logic synthesis and autonomous Cortex-M7 firmware engines, my designs transform raw physics into high-throughput computing realities.
          </p>

          {/* Competencies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/15">
            {competencies.map((c, i) => (
              <div key={i} className="bg-white/5 p-4 rounded border border-white/10 space-y-1.5">
                <h4 className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#FF4D00]">
                  {c.title}
                </h4>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#c6c6c7] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CAD Toolchain & Contact Specs */}
        <div className="space-y-6">
          <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/15 space-y-4">
            <h3 className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#00F0FF] tracking-widest uppercase">
              HARDWARE TOOLCHAIN
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <span
                  key={i}
                  className="font-['JetBrains_Mono',monospace] text-xs bg-white/5 border border-white/15 text-[#e2e2e2] px-3 py-1.5 rounded hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/15 space-y-3 font-['JetBrains_Mono',monospace] text-xs">
            <h3 className="font-bold text-[#FF003C] tracking-widest uppercase">
              MISSION CONTROL SPECS
            </h3>
            <div className="flex justify-between border-b border-white/10 pb-1.5 text-[#c6c6c7]">
              <span>LOCATION:</span>
              <span className="text-white">GLOBAL REMOTE / LAB</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5 text-[#c6c6c7]">
              <span>AVAILABILITY:</span>
              <span className="text-[#00F0FF] font-bold">CONTRACT & R&D CONSULTING</span>
            </div>
            <div className="flex justify-between text-[#c6c6c7]">
              <span>EMAIL:</span>
              <span className="text-white font-semibold">ibrar.ahmad@mindtuneinnovations.tech</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
