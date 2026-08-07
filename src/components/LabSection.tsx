import React, { useState, useEffect, useRef } from 'react';

export const LabSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signalType, setSignalType] = useState<'sine' | 'square' | 'spi' | 'noise'>('sine');
  const [frequency, setFrequency] = useState(5.0);
  const [amplitude, setAmplitude] = useState(1.5);
  const [labMode, setLabMode] = useState<'scope' | 'thermal' | 'logic'>('scope');

  useEffect(() => {
    if (labMode !== 'scope') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const renderScope = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Dark oscilloscope background grid
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;

      // Horizontal grid
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // Vertical grid
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Waveform trace
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F0FF';
      ctx.beginPath();

      const midY = h / 2;
      const scaleY = amplitude * 35;

      for (let x = 0; x < w; x++) {
        let val = 0;
        const phase = x * 0.02 * frequency + time;

        if (signalType === 'sine') {
          val = Math.sin(phase);
        } else if (signalType === 'square') {
          val = Math.sin(phase) >= 0 ? 1 : -1;
        } else if (signalType === 'spi') {
          val = (Math.sin(phase) + 0.5 * Math.sin(phase * 3) + 0.25 * Math.sin(phase * 7)) > 0 ? 1 : -1;
        } else if (signalType === 'noise') {
          val = Math.sin(phase) + (Math.random() - 0.5) * 0.4;
        }

        const y = midY - val * scaleY;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      animId = requestAnimationFrame(renderScope);
    };

    renderScope();

    return () => cancelAnimationFrame(animId);
  }, [signalType, frequency, amplitude, labMode]);

  return (
    <section className="px-5 md:px-16 py-12 max-w-[1440px] mx-auto z-10 relative">
      <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#FF4D00] text-3xl">biotech</span>
          <div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl font-bold text-[#F0F0F0]">
              HARDWARE TESTING LAB & TELEMETRY
            </h2>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
              Real-time Signal Analysis, Oscilloscope Simulation & Logic Protocol Decoders
            </p>
          </div>
        </div>

        {/* Lab Mode Toggle */}
        <div className="flex gap-2">
          {[
            { id: 'scope', label: '100MHz OSCILLOSCOPE', icon: 'graphic_eq' },
            { id: 'thermal', label: 'THERMAL CAMERA', icon: 'thermostat' },
            { id: 'logic', label: 'LOGIC ANALYZER', icon: 'data_thresholding' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLabMode(mode.id as any)}
              className={`font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 border ${
                labMode === mode.id
                  ? 'bg-[#FF4D00]/20 border-[#FF4D00] text-[#FF4D00] shadow-[0_0_12px_rgba(255,77,0,0.3)]'
                  : 'bg-white/5 border-white/10 text-[#c6c6c7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {labMode === 'scope' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/15 space-y-6 font-['JetBrains_Mono',monospace]">
            <h3 className="text-xs font-bold text-[#00F0FF] tracking-widest uppercase">
              SIGNAL GENERATOR CONTROLS
            </h3>

            {/* Signal Type Selector */}
            <div>
              <label className="text-xs text-[#c6c6c7] block mb-2">SIGNAL WAVEFORM</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sine', label: 'SINE WAVE' },
                  { id: 'square', label: 'SQUARE PULSE' },
                  { id: 'spi', label: 'SPI CLOCK/DATA' },
                  { id: 'noise', label: 'ANALOG NOISE' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSignalType(s.id as any)}
                    className={`text-xs py-2 px-3 rounded border font-semibold transition-all ${
                      signalType === s.id
                        ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-white/5 border-white/10 text-[#c6c6c7] hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c6c6c7]">FREQUENCY (TIMEBASE):</span>
                <strong className="text-[#00F0FF]">{frequency.toFixed(1)} MHz</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-[#00F0FF]"
              />
            </div>

            {/* Amplitude Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c6c6c7]">AMPLITUDE (VOLTS/DIV):</span>
                <strong className="text-[#FF4D00]">{amplitude.toFixed(2)} Vpp</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D00]"
              />
            </div>

            {/* Measured Channel Telemetry */}
            <div className="bg-black/60 p-3 rounded border border-white/10 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#c6c6c7]">CH1 VMAX:</span>
                <span className="text-white">{(amplitude * 1.65).toFixed(2)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c6c6c7]">CH1 FREQ:</span>
                <span className="text-[#00F0FF]">{(frequency * 10).toFixed(1)} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c6c6c7]">DUTY CYCLE:</span>
                <span className="text-white">50.0%</span>
              </div>
            </div>
          </div>

          {/* Oscilloscope Canvas Screen */}
          <div className="lg:col-span-2 bg-black border-2 border-[#00F0FF]/50 rounded-xl p-4 relative shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="flex justify-between items-center text-xs font-['JetBrains_Mono',monospace] text-[#00F0FF] mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
                <span>RIGOL DS1054Z SIMULATOR // CHANNEL 1 ACTIVE</span>
              </div>
              <span>TRIG: AUTO // 500 MSa/s</span>
            </div>

            <canvas
              ref={canvasRef}
              width={700}
              height={380}
              className="w-full h-[360px] rounded bg-[#08080a]"
            />
          </div>
        </div>
      )}

      {labMode === 'thermal' && (
        <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/15 space-y-4 font-['JetBrains_Mono',monospace]">
          <h3 className="text-sm font-bold text-[#FF4D00] flex items-center gap-2">
            <span className="material-symbols-outlined">thermostat</span>
            FLIR THERMAL IMAGING PCB DISSIPATION MAP
          </h3>
          <p className="text-xs text-[#c6c6c7]">
            Full thermal steady-state load inspection at 20A power delivery. Peak junction temperature remains well below 65°C limits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-4 bg-gradient-to-r from-blue-900 via-purple-800 to-red-600 rounded text-center text-white font-bold text-sm">
              MOSFET DRAIN: 62.4°C (WARM)
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-600 rounded text-center text-white font-bold text-sm">
              MCU DIE: 38.1°C (NOMINAL)
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-800 rounded text-center text-white font-bold text-sm">
              PCB COPPER PLANE: 28.5°C (COOL)
            </div>
          </div>
        </div>
      )}

      {labMode === 'logic' && (
        <div className="bg-[#1b1b1b] p-6 rounded-xl border border-white/15 space-y-4 font-['JetBrains_Mono',monospace]">
          <h3 className="text-sm font-bold text-[#00F0FF] flex items-center gap-2">
            <span className="material-symbols-outlined">data_thresholding</span>
            24MHz LOGIC ANALYZER PROTOCOL DECODER
          </h3>
          <div className="bg-black p-4 rounded border border-white/10 space-y-2 text-xs text-[#00F0FF]">
            <div>[0.000s] I2C START CONDITION DETECTED</div>
            <div>[0.002s] ADDR: 0x68 [WRITE] ACK</div>
            <div>[0.004s] REG: 0x3B (ACCEL_XOUT_H) ACK</div>
            <div>[0.006s] I2C REPEATED START -&gt; ADDR: 0x68 [READ] ACK</div>
            <div>[0.008s] DATA READ: 0x3A 0xF2 (AccX = +1.02g) NACK</div>
            <div>[0.010s] I2C STOP CONDITION</div>
          </div>
        </div>
      )}
    </section>
  );
};
