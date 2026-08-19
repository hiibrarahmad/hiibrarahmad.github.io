import React, { useState } from 'react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Custom PCB Layout & Schematics',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto reset after 3 seconds if needed
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl bg-[#2a2a2a] border border-[#FF003C] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,0,60,0.3)]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/15 bg-black/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF003C] animate-ping" />
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#F0F0F0] tracking-widest">
              MISSION CONTROL // DIRECT TRANSMISSION
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#c6c6c7] hover:text-[#FF003C] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 font-['JetBrains_Mono',monospace]">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] rounded-full flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_#00F0FF]">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white">TRANSMISSION RECEIVED</h3>
              <p className="text-xs text-[#c6c6c7] max-w-md mx-auto leading-relaxed">
                Your message has been logged in Ibrar Ahmad's hardware telemetry console. Expect a direct technical response within 12 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 bg-[#00F0FF] text-black font-bold text-xs px-6 py-2 rounded hover:bg-white transition-colors"
              >
                RETURN TO MISSION CONTROL
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#c6c6c7] block mb-1">CALLSIGN / NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Vance / Principal Systems Engineer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#131313] border border-white/15 focus:border-[#FF003C] text-xs text-white p-2.5 rounded focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#c6c6c7] block mb-1">COMMUNICATION ENDPOINT (EMAIL)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. engineer@techlab.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#131313] border border-white/15 focus:border-[#FF003C] text-xs text-white p-2.5 rounded focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-[#c6c6c7] block mb-1">INQUIRY CLASSIFICATION</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-[#131313] border border-white/15 focus:border-[#FF003C] text-xs text-white p-2.5 rounded focus:outline-none transition-colors"
                >
                  <option>Custom PCB Layout & Schematics</option>
                  <option>High-Speed Signal Integrity Audit</option>
                  <option>Embedded Firmware (C/C++ / FreeRTOS)</option>
                  <option>Full Hardware Product R&D Contract</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#c6c6c7] block mb-1">PROJECT PARAMETERS & MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe hardware requirements, target layer count, signal bandwidth, MCU architecture, or timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#131313] border border-white/15 focus:border-[#FF003C] text-xs text-white p-2.5 rounded focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* PGP & Direct Contact Info */}
              <div className="bg-black/50 p-3 rounded border border-white/10 text-[11px] text-[#c6c6c7] flex justify-between items-center">
                <div>
                  <span className="block text-white font-bold">DIRECT EMAIL</span>
                  <span>hiibrarahmad@gmail.com</span>
                </div>
                <div className="text-right">
                  <span className="block text-[#00F0FF] font-bold">PGP FINGERPRINT</span>
                  <span className="text-[9px]">4A91 82B3 F109 71C2</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF003C] hover:bg-[#FF4D00] text-white font-bold text-xs tracking-widest py-3 rounded border border-[#FF003C] hover:shadow-[0_0_20px_rgba(255,0,60,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                TRANSMIT HARDWARE INQUIRY
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
