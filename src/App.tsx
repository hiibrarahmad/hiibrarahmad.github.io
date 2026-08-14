import React, { useEffect, useState } from 'react';
import { ShaderBackground } from './components/ShaderBackground';
import { CustomCursor } from './components/CustomCursor';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { FeaturesBadges } from './components/FeaturesBadges';
import { ProjectCard } from './components/ProjectCard';
import { CategoryRoadmap } from './components/CategoryRoadmap';
import { ProjectViewerModal } from './components/ProjectViewerModal';
import { ProjectGridModal } from './components/ProjectGridModal';
import { ConnectModal } from './components/ConnectModal';
import { SchematicsSection } from './components/SchematicsSection';
import { LabSection } from './components/LabSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

import { useProjects } from './hooks/useProjects';
import { Project, SystemTelemetry } from './types';

export default function App() {
  const [route, setRoute] = useState<string>(() => (window.location.hash === '#admin' ? 'admin' : 'site'));
  const [activeSection, setActiveSection] = useState<string>('hardware');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [active3DProject, setActive3DProject] = useState<Project | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { projects: PROJECTS, upsertProject, deleteProject, replaceAll, resetToDefaults, isCustomized } = useProjects();

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash === '#admin' ? 'admin' : 'site');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === 'admin') {
    return (
      <AdminDashboard
        projects={PROJECTS}
        onSave={upsertProject}
        onDelete={deleteProject}
        onReplaceAll={replaceAll}
        onReset={resetToDefaults}
        isCustomized={isCustomized}
        onExit={() => { window.location.hash = ''; }}
      />
    );
  }

  const telemetry: SystemTelemetry = {
    latencyMs: 24,
    uptime: '99.9%',
    systemStatus: 'NOMINAL',
    activeProjects: PROJECTS.length,
    liveCount: PROJECTS.filter(p => p.status === 'LIVE').length,
    devCount: PROJECTS.filter(p => p.status === 'IN DEV').length,
    cpuLoad: 18.4,
    memoryUsage: 42.1,
  };

  // Filter projects by tag or search query
  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.mcu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (!selectedTag) return true;
    if (selectedTag === 'high-speed') return project.pcbLayers >= 6 || project.title.includes('TRANSCEIVER') || project.title.includes('DERMSCOPE');
    if (selectedTag === 'firmware') return project.mcu.length > 0;
    if (selectedTag === 'pcb') return project.pcbLayers >= 4;

    return true;
  });

  return (
    <div className="hw-cursor-zone bg-[#131313] text-[#e2e2e2] font-['Plus_Jakarta_Sans',sans-serif] min-h-screen relative overflow-x-hidden selection:bg-[#00F0FF] selection:text-[#050505]">
      {/* WebGL Animated Background Shader */}
      <ShaderBackground />

      {/* Hardware Probe Custom Cursor */}
      <CustomCursor />

      {/* Top Docked Navigation Bar */}
      <NavBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenConnectModal={() => setIsConnectOpen(true)}
      />

      <main className="w-full max-w-[1440px] mx-auto relative z-10 min-h-[85vh]">
        {/* HARDWARE VIEW */}
        {activeSection === 'hardware' && (
          <>
            {/* Hero Banner */}
            <Hero
              totalProjects={telemetry.activeProjects}
              liveCount={telemetry.liveCount}
              devCount={telemetry.devCount}
            />

            {/* Feature Capability Badges */}
            <FeaturesBadges
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />

            {/* Hardware Repositories Section */}
            <section className="px-5 md:px-16 py-16 relative z-10">
              {/* Repositories Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-white/15 pb-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#FF003C] text-3xl">
                    storage
                  </span>
                  <div>
                    <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-4xl font-bold text-[#F0F0F0] tracking-wider">
                      HARDWARE REPOSITORIES
                    </h2>
                    <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
                      CLICK ANY BOARD CARD TO LOAD 3D SCHEMATIC DATA & INSPECT COMPONENTS
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#00F0FF]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search MCU, layers, PCB..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-white/15 focus:border-[#00F0FF] text-xs font-['JetBrains_Mono',monospace] text-white pl-9 pr-3 py-2 rounded focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Project Cards Stack */}
              <div className="flex flex-col gap-16 md:gap-20">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="flex flex-col gap-4 md:gap-5">
                      <ProjectCard
                        project={project}
                        onOpen3DViewer={(p) => setActive3DProject(p)}
                      />
                      {project.secondaryBanner && (
                        <ProjectCard
                          project={project}
                          onOpen3DViewer={(p) => setActive3DProject(p)}
                          banner={project.secondaryBanner}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 border border-dashed border-white/20 rounded font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
                    NO HARDWARE REPOSITORIES MATCH CURRENT QUERY OR FILTER.
                    <button
                      onClick={() => {
                        setSelectedTag(null);
                        setSearchQuery('');
                      }}
                      className="block mx-auto mt-3 text-[#00F0FF] underline cursor-pointer"
                    >
                      RESET FILTERS
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Category Roadmap */}
            <CategoryRoadmap />
          </>
        )}

        {/* SCHEMATICS VIEW */}
        {activeSection === 'schematics' && <SchematicsSection />}

        {/* LAB VIEW */}
        {activeSection === 'lab' && <LabSection />}

        {/* ABOUT VIEW */}
        {activeSection === 'about' && <AboutSection />}
      </main>

      {/* Footer Mission Control */}
      <Footer telemetry={telemetry} />

      {/* 3D PCB Interactive Viewer Modal, or a grid picker for multi-project repos */}
      {active3DProject && (
        active3DProject.subProjects ? (
          <ProjectGridModal
            project={active3DProject}
            onClose={() => setActive3DProject(null)}
          />
        ) : (
          <ProjectViewerModal
            project={active3DProject}
            onClose={() => setActive3DProject(null)}
          />
        )
      )}

      {/* Direct Transmission Connect Modal */}
      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
      />
    </div>
  );
}
