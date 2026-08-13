export interface Project {
  id: string;
  title: string;
  category: string;
  status: 'LIVE' | 'IN DEV' | 'ARCHIVED';
  leftImage: string;
  rightImage: string;
  description: string;
  mcu: string;
  pcbLayers: number;
  dimensions: string;
  clockSpeed: string;
  interfaces: string[];
  schematicsUrl?: string;
  githubUrl?: string;
  projectId?: string;
  /** Real STEP-exported 3D model (OBJ), rendered instead of the procedural PCB view when present. */
  objModelUrl?: string;
  /** Material file paired with objModelUrl. */
  mtlModelUrl?: string;
  features: string[];
  components: {
    name: string;
    type: string;
    pkg: string;
    purpose: string;
    pos: [number, number, number];
    color: string;
  }[];
}

export interface SystemTelemetry {
  latencyMs: number;
  uptime: string;
  systemStatus: 'NOMINAL' | 'DEGRADED' | 'MAINTENANCE';
  activeProjects: number;
  liveCount: number;
  devCount: number;
  cpuLoad: number;
  memoryUsage: number;
}
