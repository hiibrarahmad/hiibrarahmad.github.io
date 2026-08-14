import React from 'react';
import { Project } from '../types';

interface ProjectGridModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectGridModal: React.FC<ProjectGridModalProps> = ({ project, onClose }) => {
  if (!project || !project.subProjects) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/90 backdrop-blur-md p-3 md:p-6">
      <div className="relative w-full h-[90vh] max-w-6xl bg-[#2a2a2a] border border-[#00F0FF] rounded-xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b border-white/15 bg-black/70 gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00F0FF]">grid_view</span>
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F0F0F0] tracking-wider">
                {project.title}
              </h2>
              <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#00F0FF]">
                {project.category} // {project.subProjects.length} PROJECTS // {project.mcu}
                {project.projectId && <span className="text-white/40"> // {project.projectId}</span>}
              </p>
            </div>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 border bg-white/5 border-white/10 text-[#c6c6c7] hover:text-white hover:border-white/30"
              >
                <span className="material-symbols-outlined text-sm">code</span>
                <span className="hidden sm:inline">GITHUB REPO</span>
              </a>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-[#c6c6c7] hover:text-[#FF003C] transition-colors p-1 rounded hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow w-full h-full relative overflow-y-auto bg-[#131313] p-5 md:p-8">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#c6c6c7] max-w-3xl mb-6">
            {project.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {project.subProjects.map((sub) => (
              <a
                key={sub.id}
                href={sub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-[#1b1b1b] border border-white/15 hover:border-[#00F0FF] rounded-lg overflow-hidden transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
              >
                <div className="w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-white/15">memory</span>
                  )}
                </div>
                <div className="p-3.5 flex flex-col gap-1.5 flex-grow">
                  <h3 className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-[#F0F0F0] group-hover:text-[#00F0FF] transition-colors">
                    {sub.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#c6c6c7] leading-relaxed flex-grow">
                    {sub.description}
                  </p>
                  <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#00F0FF] font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                    VIEW ON GITHUB
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
