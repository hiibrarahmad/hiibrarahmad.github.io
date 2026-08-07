import React, { useState } from 'react';

export const SchematicsSection: React.FC = () => {
  const [selectedSheet, setSelectedSheet] = useState('power');
  const [highlightNet, setHighlightNet] = useState<string | null>(null);

  const sheets = [
    { id: 'power', name: '01_POWER_DISTRIBUTION.SCH', desc: 'Isolated DC-DC Buck Regulators & LDO Rails' },
    { id: 'mcu', name: '02_MCU_CORTEX_H7_CORE.SCH', desc: 'STM32H743 High-Speed Pin Mapping & Decoupling' },
    { id: 'afe', name: '03_ANALOG_FRONT_END.SCH', desc: 'Low-Noise Precision OpAmp Bandpass Filtering' },
    { id: 'diff', name: '04_HIGH_SPEED_SERDES.SCH', desc: '10Gbps Controlled Impedance Differential Pairs' },
  ];

  const nets = [
    { name: 'VDD_3V3', voltage: '3.3V', current: '1.2A', noise: '< 12µV RMS' },
    { name: 'VDD_1V8', voltage: '1.8V', current: '450mA', noise: '< 8µV RMS' },
    { name: 'MIPI_CSI_CLK_P', impedance: '90Ω Diff', speed: '1.5 Gbps', skew: '< 0.5ps' },
    { name: 'SPI1_MOSI', impedance: '50Ω Single', speed: '50 MHz', skew: '< 2.0ps' },
    { name: 'GND_ANALOG', plane: 'Dedicated L2', isolation: 'Galvanic Opto', snr: '118 dB' },
  ];

  return (
    <section className="px-5 md:px-16 py-12 max-w-[1440px] mx-auto z-10 relative">
      <div className="flex items-center gap-4 mb-8 border-b border-white/15 pb-4">
        <span className="material-symbols-outlined text-[#00F0FF] text-3xl">schema</span>
        <div>
          <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl font-bold text-[#F0F0F0]">
            PRECISION SCHEMATICS ARCHIVE
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            Interactive CAD Schematic Sheets & Controlled Netlist Inspector
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sheet Selector */}
        <div className="space-y-3">
          <h3 className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#FF4D00] tracking-widest uppercase">
            SCHEMATIC SHEETS
          </h3>
          {sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setSelectedSheet(sheet.id)}
              className={`w-full text-left p-4 rounded border transition-all font-['JetBrains_Mono',monospace] cursor-pointer ${
                selectedSheet === sheet.id
                  ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold text-[#F0F0F0] flex items-center justify-between">
                <span>{sheet.name}</span>
                {selectedSheet === sheet.id && <span className="text-[#00F0FF] text-xs">● ACTIVE</span>}
              </div>
              <p className="text-[11px] text-[#c6c6c7] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                {sheet.desc}
              </p>
            </button>
          ))}

          {/* Netlist Inspector */}
          <div className="bg-[#1b1b1b] p-4 rounded border border-white/15 mt-6 font-['JetBrains_Mono',monospace]">
            <h4 className="text-xs font-bold text-[#00F0FF] mb-3 uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">hub</span>
              CRITICAL NETLIST HIGHLIGHTS
            </h4>
            <div className="space-y-2">
              {nets.map((net, i) => (
                <div
                  key={i}
                  onClick={() => setHighlightNet(highlightNet === net.name ? null : net.name)}
                  className={`p-2 rounded border cursor-pointer text-xs transition-colors ${
                    highlightNet === net.name
                      ? 'bg-[#FF003C]/20 border-[#FF003C] text-white'
                      : 'bg-white/5 border-white/10 text-[#c6c6c7] hover:text-white'
                  }`}
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-[#00F0FF]">{net.name}</span>
                    <span>{net.voltage || net.impedance}</span>
                  </div>
                  <div className="text-[10px] text-[#c6c6c7] mt-0.5">
                    {net.current ? `Current: ${net.current} // Noise: ${net.noise}` : `Speed: ${net.speed} // Skew: ${net.skew}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schematic CAD Viewport Simulator */}
        <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/15 rounded-xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/15 pb-3 font-['JetBrains_Mono',monospace] text-xs">
            <span className="text-[#00F0FF] font-bold">CAD VIEWER // ALTIUM DESIGNER INTERCONNECT MATRIX</span>
            <span className="text-[#c6c6c7]">GRID: 100 mil // SCALE: 1:1</span>
          </div>

          {/* Schematic Diagram Vector Simulation */}
          <div className="my-8 h-[360px] bg-black/80 rounded border border-dashed border-white/20 p-6 relative flex items-center justify-center font-['JetBrains_Mono',monospace]">
            <div className="absolute top-3 left-3 text-[10px] text-[#00F0FF]">
              [SHEET: {selectedSheet.toUpperCase()}]
            </div>

            {/* Block Schematic Graphic */}
            <div className="w-full max-w-lg space-y-6">
              <div className="flex justify-between items-center">
                {/* Block 1 */}
                <div className={`p-4 border-2 rounded text-center transition-all ${
                  highlightNet ? 'border-[#FF003C] bg-[#FF003C]/10' : 'border-[#00F0FF] bg-[#00F0FF]/10'
                }`}>
                  <span className="text-xs font-bold text-[#00F0FF] block">DC-DC BUCK</span>
                  <span className="text-[10px] text-[#c6c6c7]">TPS62840 // 1.2MHz</span>
                </div>

                {/* Connection Line */}
                <div className="flex-grow h-0.5 bg-gradient-to-r from-[#00F0FF] via-[#FF003C] to-[#00F0FF] relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-[#00F0FF] bg-black px-1.5 border border-[#00F0FF]/30 rounded">
                    {highlightNet || 'NET: VDD_3V3'}
                  </div>
                </div>

                {/* Block 2 */}
                <div className="p-4 border-2 border-[#FF4D00] bg-[#FF4D00]/10 rounded text-center">
                  <span className="text-xs font-bold text-[#FF4D00] block">MCU DSP CORE</span>
                  <span className="text-[10px] text-[#c6c6c7]">STM32H743 // Cortex-M7</span>
                </div>
              </div>

              {/* Lower Decoupling Capacitor Array */}
              <div className="p-3 bg-white/5 border border-white/10 rounded flex justify-around text-[10px] text-[#c6c6c7]">
                <div className="text-center">
                  <span className="block text-white font-bold">C101</span>
                  <span>10µF 0603 X7R</span>
                </div>
                <div className="text-center">
                  <span className="block text-white font-bold">C102</span>
                  <span>100nH 0402 X7R</span>
                </div>
                <div className="text-center">
                  <span className="block text-white font-bold">L101</span>
                  <span>2.2µH Shielded</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] text-[#c6c6c7]">
              DESIGNED BY IBRAR AHMAD // ESD & EMI COMPLIANT
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-['JetBrains_Mono',monospace] text-[#c6c6c7] pt-2 border-t border-white/10">
            <span>RULE CHECK: <strong className="text-[#00F0FF]">0 DRC ERRORS</strong></span>
            <span>DIFFERENTIAL SKEW: <strong className="text-[#FF4D00]">0.12 ps</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
