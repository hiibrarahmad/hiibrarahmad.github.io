import { useCallback, useState } from 'react';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projectsData';

const STORAGE_KEY = 'ia_portfolio_projects_override_v1';

function loadStored(): Project[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => loadStored() ?? DEFAULT_PROJECTS);
  const [isCustomized, setIsCustomized] = useState<boolean>(() => loadStored() !== null);

  const persist = useCallback((next: Project[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIsCustomized(true);
  }, []);

  const upsertProject = useCallback((project: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      const next = exists ? prev.map((p) => (p.id === project.id ? project : p)) : [...prev, project];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsCustomized(true);
      return next;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsCustomized(true);
      return next;
    });
  }, []);

  const replaceAll = useCallback((next: Project[]) => {
    persist(next);
  }, [persist]);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProjects(DEFAULT_PROJECTS);
    setIsCustomized(false);
  }, []);

  return { projects, upsertProject, deleteProject, replaceAll, resetToDefaults, isCustomized, defaultProjects: DEFAULT_PROJECTS };
}
