import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onOpen3DViewer: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen3DViewer }) => {
  return (
    <div
      onClick={() => onOpen3DViewer(project)}
      className="group relative w-full aspect-[2/1] md:aspect-[3/1] bg-[#2a2a2a] overflow-hidden border border-white/15 split-hover transition-all duration-500 flex flex-col md:flex-row cursor-pointer project-card rounded-sm shadow-xl"
    >
      {/* Top Right Status Badge */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 rounded">
        <div
          className={`w-2 h-2 rounded-full ${
            project.status === 'LIVE'
              ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
              : 'bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]'
          }`}
        />
        <span
          className={`font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-widest ${
            project.status === 'LIVE' ? 'text-[#00F0FF]' : 'text-[#FF4D00]'
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Top Left Category */}
      <div className="absolute top-4 left-4 z-30 bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 rounded">
        <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#c6c6c7] font-semibold tracking-wider">
          {project.category}
        </span>
      </div>

      {/* Project ID Watermark (transparent, only when sourced from a real repo) */}
      {project.projectId && (
        <div className="absolute top-14 right-4 z-30 pointer-events-none">
          <span className="font-['JetBrains_Mono',monospace] text-[10px] text-white/40 tracking-widest">
            {project.projectId}
          </span>
        </div>
      )}

      {/* Text Overlay (Absolute Center) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-20 pointer-events-none bg-black/40 group-hover:bg-black/20 transition-colors duration-500 px-4">
        <h3 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl md:text-5xl font-bold text-[#F0F0F0] tracking-widest text-center group-hover:scale-105 transition-transform duration-500 drop-shadow-md">
          {project.title}
        </h3>

        {/* Hover CTA Access 3D Data */}
        <div className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#FF003C] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 flex items-center gap-3">
          <span className="w-8 h-px bg-[#FF003C]" />
          ACCESS 3D DATA
          <span className="w-8 h-px bg-[#FF003C]" />
        </div>
      </div>

      {/* Left Image Split */}
      <div className="w-full md:w-1/2 h-full relative split-left bg-black">
        <img
          src={project.leftImage}
          alt={`${project.title} Render Left`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Right Image Split */}
      <div className="w-full md:w-1/2 h-full relative split-right bg-black hidden md:block">
        <img
          src={project.rightImage}
          alt={`${project.title} Render Right`}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Bottom specs preview bar */}
      <div className="absolute bottom-2 left-4 right-4 z-30 hidden group-hover:flex justify-between items-center text-[11px] font-['JetBrains_Mono',monospace] text-[#c6c6c7] bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded">
        <span>MCU: <strong className="text-[#00F0FF]">{project.mcu}</strong></span>
        <span>LAYERS: <strong className="text-[#FF4D00]">{project.pcbLayers}L PCB</strong></span>
        <span>CLOCK: <strong className="text-white">{project.clockSpeed}</strong></span>
      </div>
    </div>
  );
};
