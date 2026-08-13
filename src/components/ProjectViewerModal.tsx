import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Project } from '../types';

interface ProjectViewerModalProps {
  project: Project | null;
  onClose: () => void;
}

// occt-import-js is loaded as a plain script (public/occt-import-js.js +
// public/occt-import-js.wasm) rather than bundled — it's a large (~7MB)
// Emscripten/WASM build only needed by the handful of projects with a real
// STEP model, so it's fetched lazily and cached at module scope so opening
// the modal more than once doesn't re-fetch/re-init it.
let occtInstancePromise: Promise<any> | null = null;
function loadOcct(): Promise<any> {
  if (occtInstancePromise) return occtInstancePromise;
  occtInstancePromise = new Promise((resolve, reject) => {
    const existing = (window as any).occtimportjs;
    const init = () => {
      (window as any).occtimportjs({ locateFile: () => '/occt-import-js.wasm' })
        .then(resolve)
        .catch(reject);
    };
    if (existing) {
      init();
      return;
    }
    const script = document.createElement('script');
    script.src = '/occt-import-js.js';
    script.onload = init;
    script.onerror = () => reject(new Error('Failed to load occt-import-js.js'));
    document.head.appendChild(script);
  });
  return occtInstancePromise;
}

// Shared by both the pre-converted-OBJ path and the raw-STEP path: Three.js
// applies scale to local geometry before translation, so the centering
// offset must be computed from the *scaled* bounding box, not the raw one.
function centerAndScaleObject(obj: THREE.Object3D, targetSize = 4) {
  const rawBox = new THREE.Box3().setFromObject(obj);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);
  const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z) || 1;
  obj.scale.setScalar(targetSize / maxDim);

  const scaledBox = new THREE.Box3().setFromObject(obj);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  obj.position.sub(center);
}

export const ProjectViewerModal: React.FC<ProjectViewerModalProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<'3d' | 'stackup' | 'signal' | 'logs'>('3d');
  const [selectedComponent, setSelectedComponent] = useState<typeof project.components[0] | null>(null);
  const [autorotate, setAutorotate] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Simulation parameters for Signal Integrity tab
  const [traceWidth, setTraceWidth] = useState(6.0); // mils
  const [dielectricH, setDielectricH] = useState(4.2); // mils
  const [dielectricEr, setDielectricEr] = useState(4.3); // FR-4

  useEffect(() => {
    if (!project) return;
    // Initialize firmware terminal logs
    const initialLogs = [
      `[00:00.001] BOOT_LOADER_V2.4 initialized on ${project.mcu}`,
      `[00:00.015] Power rails stable: VDD_3V3 = 3.302V, VDD_1V8 = 1.801V, CORE = 1.050V`,
      `[00:00.032] Clock source PLL locked at ${project.clockSpeed}`,
      `[00:00.055] SPI Flash initialized. Bitstream size: 4,194,304 bytes`,
      `[00:00.102] Testing PCB Stackup (${project.pcbLayers} Layers)... Ground planes verified.`,
      `[00:00.180] ${project.title} Mission Control Telemetry ready.`
    ];
    setTerminalLogs(initialLogs);

    // Periodic live logs log generator
    const logInterval = setInterval(() => {
      const timestamp = (Date.now() / 1000).toFixed(3).slice(-7);
      const events = [
        `[${timestamp}] DMA Burst TX completed on SPI_1 (1024 words)`,
        `[${timestamp}] Temperature sensor reading: 36.4°C (Nominal)`,
        `[${timestamp}] ADC Channel 0 sampled: 2.048V (Offset: <0.2mV)`,
        `[${timestamp}] USB-C Power Delivery contract maintained (20V @ 2.2A)`,
        `[${timestamp}] Signal integrity check: Eye diagram width 98.2%`,
        `[${timestamp}] Heartbeat pip sent to Mission Control.`
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setTerminalLogs(prev => [...prev.slice(-15), randomEvent]);
    }, 2500);

    return () => clearInterval(logInterval);
  }, [project]);

  // Three.js Render Scene
  useEffect(() => {
    if (!project || activeTab !== '3d' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -4, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Group for PCB assembly
    const pcbGroup = new THREE.Group();
    scene.add(pcbGroup);

    // Component Meshes (populated below only for the procedural path — real
    // loaded models don't have per-part meshes to click/inspect)
    const componentMeshes: { mesh: THREE.Mesh; data: typeof project.components[0] }[] = [];

    const stepUrl = project.stepModelUrl;
    const objUrl = project.objModelUrl;
    const mtlUrl = project.mtlModelUrl;
    let cancelled = false;

    if (stepUrl) {
      // Real raw STEP (.step/.stp) model — parsed client-side via
      // occt-import-js (WASM build of OpenCascade) since Three.js has no
      // built-in STEP support. Mesh data comes back already in a
      // three.js-compatible position/normal/index layout.
      (async () => {
        try {
          const [occt, response] = await Promise.all([loadOcct(), fetch(stepUrl)]);
          const buffer = await response.arrayBuffer();
          const result = occt.ReadStepFile(new Uint8Array(buffer), null);
          if (cancelled || !result.success) return;

          const group = new THREE.Group();
          for (const meshData of result.meshes) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3));
            if (meshData.attributes.normal) {
              geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3));
            } else {
              geometry.computeVertexNormals();
            }
            geometry.setIndex(new THREE.Uint32BufferAttribute(meshData.index.array, 1));

            const color = meshData.color
              ? new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2])
              : new THREE.Color(0x888888);
            const material = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.4 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
          }

          centerAndScaleObject(group);
          if (!cancelled) pcbGroup.add(group);
        } catch (err) {
          console.error('Failed to load STEP model:', err);
        }
      })();
    } else if (objUrl) {
      // Real 3D model pre-converted to OBJ+MTL — load it instead of the procedural PCB
      const onModelLoaded = (obj: THREE.Group) => {
        centerAndScaleObject(obj);
        obj.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        pcbGroup.add(obj);
      };

      if (mtlUrl) {
        new MTLLoader().load(mtlUrl, (materials) => {
          materials.preload();
          new OBJLoader().setMaterials(materials).load(objUrl, onModelLoaded);
        });
      } else {
        new OBJLoader().load(objUrl, onModelLoaded);
      }
    } else {
      // PCB Board Substrate
      const boardGeo = new THREE.BoxGeometry(4.2, 3.0, 0.12);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0x122214, // Dark Green PCB Solder Mask
        roughness: 0.3,
        metalness: 0.2,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.castShadow = true;
      board.receiveShadow = true;
      pcbGroup.add(board);

      // PCB Silk screen border lines
      const silkLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      const silkGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.0, -1.4, 0.07),
        new THREE.Vector3(2.0, -1.4, 0.07),
        new THREE.Vector3(2.0, 1.4, 0.07),
        new THREE.Vector3(-2.0, 1.4, 0.07),
        new THREE.Vector3(-2.0, -1.4, 0.07),
      ]);
      const silkBox = new THREE.Line(silkGeo, silkLineMat);
      pcbGroup.add(silkBox);

      // Gold Plated Copper Traces
      const traceMat = new THREE.LineBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.7,
      });
      const tracePointsCount = 35;
      for (let i = 0; i < tracePointsCount; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 3.8;
        const startY = (Math.random() - 0.5) * 2.6;
        points.push(new THREE.Vector3(startX, startY, 0.07));
        const midX = startX + (Math.random() - 0.5) * 0.8;
        const midY = startY + (Math.random() - 0.5) * 0.8;
        points.push(new THREE.Vector3(midX, midY, 0.07));
        points.push(new THREE.Vector3(midX + (Math.random() - 0.5) * 0.5, midY, 0.07));
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geo, traceMat);
        pcbGroup.add(line);
      }

      // Add Component Meshes
      project.components.forEach((comp) => {
        let width = 0.5, depth = 0.5, height = 0.15;
        if (comp.pkg.includes('LQFP') || comp.pkg.includes('TQFP') || comp.pkg.includes('BGA')) {
          width = 0.9; depth = 0.9; height = 0.12;
        } else if (comp.pkg.includes('Type-C') || comp.pkg.includes('Connector') || comp.pkg.includes('Cage')) {
          width = 0.5; depth = 0.8; height = 0.3;
        } else if (comp.pkg.includes('QFN')) {
          width = 0.6; depth = 0.6; height = 0.1;
        }

        const compGeo = new THREE.BoxGeometry(width, depth, height);
        const compMat = new THREE.MeshStandardMaterial({
          color: comp.color || 0x222222,
          roughness: 0.4,
          metalness: 0.5,
        });

        const mesh = new THREE.Mesh(compGeo, compMat);
        mesh.position.set(comp.pos[0], comp.pos[1], 0.06 + height / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        pcbGroup.add(mesh);
        componentMeshes.push({ mesh, data: comp });

        // Add pins or leads around the IC
        const pinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
        for (let p = -width / 2 + 0.1; p <= width / 2 - 0.1; p += 0.15) {
          const pinGeo = new THREE.BoxGeometry(0.04, 0.08, 0.05);
          const pinLeft = new THREE.Mesh(pinGeo, pinMat);
          pinLeft.position.set(comp.pos[0] + p, comp.pos[1] - depth / 2 - 0.04, 0.08);
          pcbGroup.add(pinLeft);

          const pinRight = new THREE.Mesh(pinGeo, pinMat);
          pinRight.position.set(comp.pos[0] + p, comp.pos[1] + depth / 2 + 0.04, 0.08);
          pcbGroup.add(pinRight);
        }
      });

      // Add SMD Capacitors / Resistors array
      const smdMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
      for (let c = 0; c < 20; c++) {
        const smdGeo = new THREE.BoxGeometry(0.1, 0.18, 0.08);
        const smdMesh = new THREE.Mesh(smdGeo, smdMat);
        smdMesh.position.set((Math.random() - 0.5) * 3.6, (Math.random() - 0.5) * 2.4, 0.09);
        pcbGroup.add(smdMesh);
      }
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00F0FF, 1.2);
    dirLight1.position.set(5, 5, 8);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFF4D00, 1.0);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // Interactive Drag / Rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;

      pcbGroup.rotation.z += deltaX * 0.01;
      pcbGroup.rotation.x += deltaY * 0.01;

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onWheel = (e: WheelEvent) => {
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.005, 2.5, 12);
    };

    // Raycaster for selecting PCB components
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(componentMeshes.map(c => c.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const found = componentMeshes.find(c => c.mesh === hitMesh);
        if (found) {
          setSelectedComponent(found.data);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('wheel', onWheel);
    dom.addEventListener('click', onClick);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autorotate && !isDragging) {
        pcbGroup.rotation.z += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousemove', onMouseMove);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [project, activeTab, autorotate]);

  if (!project) return null;

  // Calculate microstrip impedance formula approximation
  const calculateImpedance = () => {
    // Z0 = (87 / sqrt(Er + 1.41)) * ln(5.98 * H / (0.8 * W + T))
    const H = dielectricH;
    const W = traceWidth;
    const Er = dielectricEr;
    const T = 1.4; // 1oz copper thickness in mils
    const z0 = (87 / Math.sqrt(Er + 1.41)) * Math.log((5.98 * H) / (0.8 * W + T));
    return isNaN(z0) || z0 < 0 ? 50 : z0.toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/90 backdrop-blur-md p-3 md:p-6">
      <div className="relative w-full h-[90vh] max-w-6xl bg-[#2a2a2a] border border-[#00F0FF] rounded-xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b border-white/15 bg-black/70 gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00F0FF]">3d_rotation</span>
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F0F0F0] tracking-wider">
                {project.title}
              </h2>
              <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#00F0FF]">
                {project.category} // {project.pcbLayers} LAYERS // {project.mcu}
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

          {/* Modal Tab Controls */}
          <div className="flex gap-2">
            {[
              { id: '3d', label: '3D PCB MODEL', icon: 'view_in_ar' },
              { id: 'stackup', label: 'LAYER STACKUP', icon: 'layers' },
              { id: 'signal', label: 'SIGNAL INTEGRITY', icon: 'query_stats' },
              { id: 'logs', label: 'SWD TERMINAL', icon: 'terminal' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 border ${
                  activeTab === tab.id
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-[#c6c6c7] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
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
        <div className="flex-grow w-full h-full relative overflow-hidden bg-[#131313]">
          {/* TAB 1: 3D MODEL VIEW */}
          {activeTab === '3d' && (
            <div className="w-full h-full flex flex-col md:flex-row relative">
              {/* Three.js canvas container */}
              <div ref={containerRef} className="w-full md:w-3/4 h-[55vh] md:h-full cursor-grab active:cursor-grabbing" />

              {/* 3D View Controls Overlay */}
              <div className="absolute top-4 left-4 z-10 flex gap-2 bg-black/70 backdrop-blur-md p-2 rounded border border-white/10">
                <button
                  onClick={() => setAutorotate(!autorotate)}
                  className={`font-['JetBrains_Mono',monospace] text-xs px-2.5 py-1 rounded flex items-center gap-1.5 border ${
                    autorotate ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]' : 'text-[#c6c6c7] border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">rotate_right</span>
                  {autorotate ? 'AUTO ROTATE ON' : 'PAUSED'}
                </button>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#c6c6c7] flex items-center px-2">
                  Drag to rotate / Scroll to zoom
                </span>
              </div>

              {/* Component Info Sidebar */}
              <div className="w-full md:w-1/4 bg-[#1b1b1b] border-t md:border-t-0 md:border-l border-white/15 p-4 overflow-y-auto flex flex-col justify-between">
                <div>
                  <h3 className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#FF4D00] tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">memory</span>
                    HARDWARE SPECIFICATIONS
                  </h3>

                  <div className="space-y-3 font-['JetBrains_Mono',monospace] text-xs">
                    <div className="bg-white/5 p-2.5 rounded border border-white/10">
                      <span className="text-[#c6c6c7] block text-[10px]">MICROCONTROLLER / DSP</span>
                      <strong className="text-[#00F0FF] text-sm">{project.mcu}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 p-2 rounded border border-white/10">
                        <span className="text-[#c6c6c7] block text-[10px]">STACKUP</span>
                        <strong className="text-white">{project.pcbLayers} Layers PCB</strong>
                      </div>
                      <div className="bg-white/5 p-2 rounded border border-white/10">
                        <span className="text-[#c6c6c7] block text-[10px]">CLOCK SPEED</span>
                        <strong className="text-white">{project.clockSpeed}</strong>
                      </div>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded border border-white/10">
                      <span className="text-[#c6c6c7] block text-[10px]">DIMENSIONS</span>
                      <span className="text-white font-semibold">{project.dimensions}</span>
                    </div>

                    {/* Selected component inspector — only meaningful for the procedural view */}
                    {!project.objModelUrl && !project.stepModelUrl && (
                    <div className="mt-4 border-t border-white/15 pt-3">
                      <span className="text-[#00F0FF] text-[11px] font-bold block mb-2">
                        INSPECT COMPONENT (CLICK 3D BOARD)
                      </span>
                      {selectedComponent ? (
                        <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/40 p-3 rounded space-y-1.5">
                          <div className="flex justify-between items-center">
                            <strong className="text-[#00F0FF]">{selectedComponent.name}</strong>
                            <span className="text-[10px] bg-[#00F0FF]/20 px-1.5 py-0.5 rounded text-[#00F0FF]">
                              {selectedComponent.pkg}
                            </span>
                          </div>
                          <p className="text-[#e2e2e2] text-[11px]">{selectedComponent.type}</p>
                          <p className="text-[#c6c6c7] text-[10px] leading-relaxed">{selectedComponent.purpose}</p>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-3 rounded border border-dashed border-white/20 text-center text-[11px] text-[#c6c6c7]">
                          Click any IC chip on the 3D PCB render to inspect pinout & signal circuit.
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                </div>

                {/* Key Features List */}
                <div className="mt-4 pt-3 border-t border-white/15">
                  <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#FF003C] font-bold tracking-widest block mb-2">
                    CIRCUIT HIGHLIGHTS
                  </span>
                  <ul className="space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#c6c6c7]">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#00F0FF] font-bold">›</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAYER STACKUP */}
          {activeTab === 'stackup' && (
            <div className="p-6 h-full overflow-y-auto font-['JetBrains_Mono',monospace] space-y-6">
              <div className="flex justify-between items-center border-b border-white/15 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#00F0FF]">
                    {project.pcbLayers}-LAYER CONTROLLED IMPEDANCE STACKUP
                  </h3>
                  <p className="text-xs text-[#c6c6c7]">
                    Standard IPC-4101/24 FR-4 High-Tg Substrate // Total Board Thickness: 1.6mm ± 10%
                  </p>
                </div>
                <div className="bg-[#FF4D00]/20 border border-[#FF4D00] text-[#FF4D00] px-3 py-1.5 rounded text-xs">
                  50Ω Single-Ended / 90Ω Differential
                </div>
              </div>

              {/* Stackup Visualizer */}
              <div className="space-y-2 max-w-4xl mx-auto">
                <div className="bg-[#00F0FF]/20 border border-[#00F0FF] p-3 rounded flex justify-between items-center text-xs">
                  <span className="font-bold text-[#00F0FF]">L1 TOP COPPER (SIGNAL / HIGH SPEED)</span>
                  <span>1.0 oz (35 µm) // Trace Width: 6.0 mil // 50Ω</span>
                </div>
                <div className="bg-[#2a2a2a] border border-white/10 p-2 rounded text-center text-[11px] text-[#c6c6c7]">
                  DIELECTRIC PREPREG (FR-4 High-Tg // Er = 4.3 // 4.2 mil)
                </div>
                <div className="bg-[#FF003C]/20 border border-[#FF003C] p-3 rounded flex justify-between items-center text-xs">
                  <span className="font-bold text-[#FF003C]">L2 INTERNAL GROUND PLANE (GND 1)</span>
                  <span>1.0 oz (35 µm) Solid Copper Shield</span>
                </div>
                <div className="bg-[#2a2a2a] border border-white/10 p-2 rounded text-center text-[11px] text-[#c6c6c7]">
                  CORE SUBSTRATE (FR-4 // 40 mil)
                </div>
                <div className="bg-[#FF4D00]/20 border border-[#FF4D00] p-3 rounded flex justify-between items-center text-xs">
                  <span className="font-bold text-[#FF4D00]">L3 POWER PLANE (3V3 / 1V8 / VDD_CORE)</span>
                  <span>2.0 oz (70 µm) Heavy Copper</span>
                </div>
                <div className="bg-[#2a2a2a] border border-white/10 p-2 rounded text-center text-[11px] text-[#c6c6c7]">
                  DIELECTRIC PREPREG (4.2 mil)
                </div>
                <div className="bg-[#00F0FF]/20 border border-[#00F0FF] p-3 rounded flex justify-between items-center text-xs">
                  <span className="font-bold text-[#00F0FF]">L4 BOTTOM COPPER (SIGNAL / POWER)</span>
                  <span>1.0 oz (35 µm) // Soldermask Matte Black</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIGNAL INTEGRITY ANALYZER */}
          {activeTab === 'signal' && (
            <div className="p-6 h-full overflow-y-auto font-['JetBrains_Mono',monospace] space-y-6">
              <div className="flex justify-between items-center border-b border-white/15 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#FF4D00]">MICROSTRIP TRACE IMPEDANCE CALCULATOR</h3>
                  <p className="text-xs text-[#c6c6c7]">
                    Real-time transmission line solver based on IPC-2141 microstrip equations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-white/5 p-4 rounded border border-white/15 space-y-4">
                  <h4 className="text-sm font-bold text-[#00F0FF]">PARAMETRIC INPUTS</h4>

                  <div>
                    <label className="text-xs text-[#c6c6c7] block mb-1">
                      Trace Width (W): <strong className="text-white">{traceWidth} mils</strong>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="0.5"
                      value={traceWidth}
                      onChange={(e) => setTraceWidth(parseFloat(e.target.value))}
                      className="w-full accent-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#c6c6c7] block mb-1">
                      Dielectric Height (H): <strong className="text-white">{dielectricH} mils</strong>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.2"
                      value={dielectricH}
                      onChange={(e) => setDielectricH(parseFloat(e.target.value))}
                      className="w-full accent-[#FF4D00]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#c6c6c7] block mb-1">
                      Dielectric Constant (Er): <strong className="text-white">{dielectricEr}</strong>
                    </label>
                    <input
                      type="range"
                      min="3.0"
                      max="5.0"
                      step="0.1"
                      value={dielectricEr}
                      onChange={(e) => setDielectricEr(parseFloat(e.target.value))}
                      className="w-full accent-[#FF003C]"
                    />
                  </div>
                </div>

                {/* Calculated Impedance Output */}
                <div className="bg-[#00F0FF]/10 p-6 rounded border border-[#00F0FF]/40 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#c6c6c7] block">CALCULATED CHARACTERISTIC IMPEDANCE</span>
                    <div className="text-5xl font-bold text-[#00F0FF] my-2">
                      {calculateImpedance()} <span className="text-2xl text-white">Ω</span>
                    </div>
                    <p className="text-xs text-[#c6c6c7]">
                      {Math.abs(parseFloat(calculateImpedance().toString()) - 50) < 3
                        ? '✓ EXCELLENT MATCH FOR 50Ω HIGH SPEED SIGNAL TRACES'
                        : '⚠ ADJUST TRACE WIDTH OR DIELECTRIC HEIGHT TO APPROACH TARGET 50Ω'}
                    </p>
                  </div>

                  {/* Eye Diagram simulation */}
                  <div className="mt-4 pt-4 border-t border-white/15">
                    <span className="text-xs text-white block mb-2">SIMULATED EYE DIAGRAM (10 Gbps)</span>
                    <div className="w-full h-24 bg-black rounded border border-[#00F0FF]/30 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 via-[#FF003C]/20 to-[#00F0FF]/10" />
                      <div className="text-[#00F0FF] text-xs z-10 animate-pulse">
                        EYE HEIGHT: 310mV // EYE WIDTH: 92.4ps // JITTER: 1.2ps
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SWD/UART FIRMWARE TERMINAL */}
          {activeTab === 'logs' && (
            <div className="p-4 h-full bg-black font-['JetBrains_Mono',monospace] flex flex-col justify-between overflow-hidden">
              <div className="overflow-y-auto flex-grow space-y-1 pr-2">
                <div className="text-[#00F0FF] text-xs font-bold border-b border-white/20 pb-2 mb-2 flex justify-between">
                  <span>SWD/JTAG DEBUGGER LOG STREAM // {project.mcu}</span>
                  <span className="text-[#FF4D00] animate-pulse">● LOGGING ACTIVE</span>
                </div>
                {terminalLogs.map((log, index) => (
                  <div key={index} className="text-xs text-[#e2e2e2] hover:bg-white/5 px-1 rounded">
                    <span className="text-[#00F0FF] mr-2">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/20 mt-2 flex items-center gap-2">
                <span className="text-[#00F0FF] font-bold text-xs">SWD&gt;</span>
                <input
                  type="text"
                  placeholder="Enter firmware command (e.g. status, read_reg 0x4000, ping)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value;
                      if (!val) return;
                      setTerminalLogs(prev => [...prev, `[CMD] ${val}`, `[RESP] Command executed successfully on ${project.mcu}.`]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="flex-grow bg-white/5 border border-white/20 text-xs px-3 py-1.5 rounded text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
