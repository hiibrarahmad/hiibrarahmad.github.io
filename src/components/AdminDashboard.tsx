import React, { useMemo, useState } from 'react';
import { Project } from '../types';

const ADMIN_PASSCODE = 'ibrar2026';
const SESSION_KEY = 'ia_portfolio_admin_unlocked';

interface AdminDashboardProps {
  projects: Project[];
  onSave: (project: Project) => void;
  onDelete: (id: string) => void;
  onReplaceAll: (projects: Project[]) => void;
  onReset: () => void;
  isCustomized: boolean;
  onExit: () => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;

const linesToArray = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const arrayToLines = (a: string[]) => (a || []).join('\n');
const csvToArray = (s: string) => s.split(',').map((l) => l.trim()).filter(Boolean);
const arrayToCsv = (a: string[]) => (a || []).join(', ');

const COMPONENT_COLORS = ['#111111', '#cccccc', '#222222', '#333333', '#1a1a1a', '#2a2a2a'];

const blankProject = (): Project => ({
  id: '',
  title: '',
  category: '',
  status: 'IN DEV',
  leftImage: '',
  rightImage: '',
  description: '',
  mcu: '',
  pcbLayers: 4,
  dimensions: '',
  clockSpeed: '',
  interfaces: [],
  features: [],
  githubUrl: '',
  schematicsUrl: '',
  projectId: '',
  components: [],
});

type FormComponent = Project['components'][number];

const EMPTY_COMPONENT: FormComponent = { name: '', type: '', pkg: '', purpose: '', pos: [0, 0, 0.15], color: '#222222' };

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onSave,
  onDelete,
  onReplaceAll,
  onReset,
  isCustomized,
  onExit,
}) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [componentsDraft, setComponentsDraft] = useState<FormComponent[]>([]);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const selectProject = (p: Project | null) => {
    if (p) {
      setSelectedId(p.id);
      setDraft({ ...p });
      setComponentsDraft(p.components ? p.components.map((c) => ({ ...c })) : []);
    } else {
      setSelectedId(null);
      setDraft(null);
      setComponentsDraft([]);
    }
    setShowExport(false);
    setShowImport(false);
  };

  const startNew = () => {
    setSelectedId('__new__');
    setDraft(blankProject());
    setComponentsDraft([]);
    setShowExport(false);
    setShowImport(false);
  };

  const updateDraft = <K extends keyof Project>(key: K, value: Project[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveDraft = () => {
    if (!draft) return;
    const id = draft.id?.trim() || slugify(draft.title);
    const cleanedComponents = componentsDraft
      .filter((c) => c.name.trim())
      .map((c, idx) => ({
        ...c,
        pos: c.pos && c.pos.length === 3 ? c.pos : ([((idx % 3) - 1) * 1.1, (Math.floor(idx / 3) % 2 === 0 ? 0.5 : -0.5), 0.15] as [number, number, number]),
        color: c.color || COMPONENT_COLORS[idx % COMPONENT_COLORS.length],
      }));
    const finalProject: Project = { ...draft, id, components: cleanedComponents };
    onSave(finalProject);
    selectProject(finalProject);
  };

  const exportText = useMemo(() => {
    const body = projects
      .map((p) => {
        const lines: string[] = ['  {'];
        lines.push(`    id: ${JSON.stringify(p.id)},`);
        lines.push(`    title: ${JSON.stringify(p.title)},`);
        lines.push(`    category: ${JSON.stringify(p.category)},`);
        lines.push(`    status: ${JSON.stringify(p.status)},`);
        lines.push(`    leftImage: ${JSON.stringify(p.leftImage)},`);
        lines.push(`    rightImage: ${JSON.stringify(p.rightImage)},`);
        lines.push(`    description: ${JSON.stringify(p.description)},`);
        lines.push(`    mcu: ${JSON.stringify(p.mcu)},`);
        lines.push(`    pcbLayers: ${p.pcbLayers},`);
        lines.push(`    dimensions: ${JSON.stringify(p.dimensions)},`);
        lines.push(`    clockSpeed: ${JSON.stringify(p.clockSpeed)},`);
        lines.push(`    interfaces: ${JSON.stringify(p.interfaces)},`);
        if (p.schematicsUrl) lines.push(`    schematicsUrl: ${JSON.stringify(p.schematicsUrl)},`);
        if (p.githubUrl) lines.push(`    githubUrl: ${JSON.stringify(p.githubUrl)},`);
        if (p.projectId) lines.push(`    projectId: ${JSON.stringify(p.projectId)},`);
        lines.push(`    features: ${JSON.stringify(p.features)},`);
        lines.push(`    components: ${JSON.stringify(p.components)}`);
        lines.push('  }');
        return lines.join('\n');
      })
      .join(',\n');
    return `import { Project } from '../types';\n\nexport const PROJECTS: Project[] = [\n${body}\n];\n`;
  }, [projects]);

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyStatus('COPIED TO CLIPBOARD');
    } catch {
      setCopyStatus('COPY FAILED — SELECT & COPY MANUALLY');
    }
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([exportText], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projectsData.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error('Not an array');
      onReplaceAll(parsed);
      setShowImport(false);
      setImportText('');
      selectProject(null);
    } catch (e) {
      alert('Invalid JSON: ' + (e as Error).message);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center px-4">
        <div className="bg-[#1b1b1b] border border-white/15 rounded-xl p-8 w-full max-w-sm space-y-4">
          <h1 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#F0F0F0]">
            MISSION CONTROL — ADMIN ACCESS
          </h1>
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            Enter passcode to edit project data. (Set in AdminDashboard.tsx — change it before deploying.)
          </p>
          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (passInput === ADMIN_PASSCODE) {
                  sessionStorage.setItem(SESSION_KEY, '1');
                  setUnlocked(true);
                } else {
                  setPassError(true);
                }
              }
            }}
            placeholder="Passcode"
            autoFocus
            className="w-full bg-black/60 border border-white/15 focus:border-[#00F0FF] text-sm font-['JetBrains_Mono',monospace] text-white px-3 py-2 rounded focus:outline-none"
          />
          {passError && <p className="text-[#FF003C] text-xs font-['JetBrains_Mono',monospace]">Incorrect passcode.</p>}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (passInput === ADMIN_PASSCODE) {
                  sessionStorage.setItem(SESSION_KEY, '1');
                  setUnlocked(true);
                } else {
                  setPassError(true);
                }
              }}
              className="flex-1 bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-['JetBrains_Mono',monospace] text-xs font-bold py-2 rounded"
            >
              UNLOCK
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-white/5 border border-white/15 text-[#c6c6c7] font-['JetBrains_Mono',monospace] text-xs font-bold py-2 rounded"
            >
              BACK TO SITE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e2e2e2]">
      {/* Header */}
      <div className="border-b border-white/15 px-5 md:px-10 py-4 flex flex-wrap items-center justify-between gap-3 bg-[#131313]/90 sticky top-0 z-20">
        <div>
          <h1 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-[#F0F0F0]">
            PROJECT ADMIN DASHBOARD
          </h1>
          <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#c6c6c7]">
            {projects.length} projects // {isCustomized ? <span className="text-[#FF4D00]">local edits active (not yet deployed)</span> : 'showing source defaults'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={startNew} className="bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
            + NEW PROJECT
          </button>
          <button onClick={() => { setShowExport((v) => !v); setShowImport(false); }} className="bg-white/5 border border-white/15 text-[#c6c6c7] hover:text-white font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
            EXPORT
          </button>
          <button onClick={() => { setShowImport((v) => !v); setShowExport(false); }} className="bg-white/5 border border-white/15 text-[#c6c6c7] hover:text-white font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
            IMPORT JSON
          </button>
          <button
            onClick={() => { if (confirm('Reset all local edits and revert to source defaults?')) { onReset(); selectProject(null); } }}
            className="bg-white/5 border border-white/15 text-[#c6c6c7] hover:text-[#FF003C] font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded"
          >
            RESET
          </button>
          <button onClick={onExit} className="bg-white/5 border border-white/15 text-[#c6c6c7] hover:text-white font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
            ← BACK TO SITE
          </button>
        </div>
      </div>

      {showExport && (
        <div className="px-5 md:px-10 py-4 border-b border-white/15 bg-black/40 space-y-2">
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            Copy this into <strong className="text-white">src/data/projectsData.ts</strong> and commit/deploy to make changes permanent for all visitors — this dashboard only edits your browser's local copy.
          </p>
          <div className="flex gap-2">
            <button onClick={handleCopyExport} className="bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
              COPY TO CLIPBOARD
            </button>
            <button onClick={handleDownload} className="bg-white/5 border border-white/15 text-[#c6c6c7] font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
              DOWNLOAD projectsData.ts
            </button>
            {copyStatus && <span className="text-[#00F0FF] text-xs font-['JetBrains_Mono',monospace] self-center">{copyStatus}</span>}
          </div>
          <textarea readOnly value={exportText} className="w-full h-64 bg-black/60 border border-white/15 rounded p-3 text-[11px] font-['JetBrains_Mono',monospace] text-[#c6c6c7]" />
        </div>
      )}

      {showImport && (
        <div className="px-5 md:px-10 py-4 border-b border-white/15 bg-black/40 space-y-2">
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#c6c6c7]">
            Paste a full JSON array of projects (matching the Project shape) to replace everything currently loaded.
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="[ { &quot;id&quot;: &quot;my-project&quot;, ... } ]"
            className="w-full h-40 bg-black/60 border border-white/15 rounded p-3 text-[11px] font-['JetBrains_Mono',monospace] text-white"
          />
          <button onClick={handleImport} className="bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-['JetBrains_Mono',monospace] text-xs font-bold px-3 py-1.5 rounded">
            APPLY IMPORT
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Project list */}
        <div className="w-full md:w-72 border-r border-white/15 max-h-[calc(100vh-73px)] overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProject(p)}
              className={`w-full text-left px-4 py-3 border-b border-white/10 transition-colors ${
                selectedId === p.id ? 'bg-[#00F0FF]/10 border-l-2 border-l-[#00F0FF]' : 'hover:bg-white/5'
              }`}
            >
              <div className="font-['JetBrains_Mono',monospace] text-[10px] text-[#c6c6c7]">{p.projectId || p.id}</div>
              <div className="font-['Space_Grotesk',sans-serif] text-sm font-bold text-[#F0F0F0] truncate">{p.title}</div>
              <div className="font-['JetBrains_Mono',monospace] text-[10px] text-[#00F0FF]">{p.status}</div>
            </button>
          ))}
        </div>

        {/* Edit form */}
        <div className="flex-1 p-5 md:p-8 max-h-[calc(100vh-73px)] overflow-y-auto">
          {!draft ? (
            <div className="text-center py-20 font-['JetBrains_Mono',monospace] text-sm text-[#c6c6c7]">
              Select a project from the list, or click + NEW PROJECT.
            </div>
          ) : (
            <div className="max-w-3xl space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-[#F0F0F0]">
                  {selectedId === '__new__' ? 'NEW PROJECT' : `EDIT: ${draft.title || draft.id}`}
                </h2>
                {selectedId !== '__new__' && (
                  <button
                    onClick={() => { if (confirm(`Delete "${draft.title}"?`)) { onDelete(draft.id); selectProject(null); } }}
                    className="text-[#FF003C] font-['JetBrains_Mono',monospace] text-xs font-bold border border-[#FF003C]/50 px-3 py-1.5 rounded hover:bg-[#FF003C]/10"
                  >
                    DELETE PROJECT
                  </button>
                )}
              </div>

              <Field label="Title">
                <input className={inputCls} value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug / ID (auto from title if blank)">
                  <input className={inputCls} value={draft.id} onChange={(e) => updateDraft('id', e.target.value)} placeholder={slugify(draft.title || 'project')} />
                </Field>
                <Field label="Project ID badge (e.g. PRJ-2026-PCB-0001)">
                  <input className={inputCls} value={draft.projectId || ''} onChange={(e) => updateDraft('projectId', e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <input className={inputCls} value={draft.category} onChange={(e) => updateDraft('category', e.target.value)} />
                </Field>
                <Field label="Status">
                  <select className={inputCls} value={draft.status} onChange={(e) => updateDraft('status', e.target.value as Project['status'])}>
                    <option value="LIVE">LIVE</option>
                    <option value="IN DEV">IN DEV</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </Field>
              </div>

              <Field label="Description">
                <textarea className={`${inputCls} h-24`} value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Left / Top Image URL (paste GitHub raw link)">
                  <input className={inputCls} value={draft.leftImage} onChange={(e) => updateDraft('leftImage', e.target.value)} />
                </Field>
                <Field label="Right / Bottom Image URL (paste GitHub raw link)">
                  <input className={inputCls} value={draft.rightImage} onChange={(e) => updateDraft('rightImage', e.target.value)} />
                </Field>
              </div>
              {(draft.leftImage || draft.rightImage) && (
                <div className="flex gap-3">
                  {draft.leftImage && <img src={draft.leftImage} alt="left preview" className="w-32 h-20 object-cover rounded border border-white/15" />}
                  {draft.rightImage && <img src={draft.rightImage} alt="right preview" className="w-32 h-20 object-cover rounded border border-white/15" />}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="GitHub Repo URL">
                  <input className={inputCls} value={draft.githubUrl || ''} onChange={(e) => updateDraft('githubUrl', e.target.value)} />
                </Field>
                <Field label="Live / Schematics URL">
                  <input className={inputCls} value={draft.schematicsUrl || ''} onChange={(e) => updateDraft('schematicsUrl', e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="MCU / Processor">
                  <input className={inputCls} value={draft.mcu} onChange={(e) => updateDraft('mcu', e.target.value)} />
                </Field>
                <Field label="PCB Layers">
                  <input type="number" className={inputCls} value={draft.pcbLayers} onChange={(e) => updateDraft('pcbLayers', parseInt(e.target.value) || 0)} />
                </Field>
                <Field label="Clock Speed">
                  <input className={inputCls} value={draft.clockSpeed} onChange={(e) => updateDraft('clockSpeed', e.target.value)} />
                </Field>
              </div>

              <Field label="Dimensions">
                <input className={inputCls} value={draft.dimensions} onChange={(e) => updateDraft('dimensions', e.target.value)} />
              </Field>

              <Field label="Interfaces (comma-separated)">
                <input className={inputCls} value={arrayToCsv(draft.interfaces)} onChange={(e) => updateDraft('interfaces', csvToArray(e.target.value))} />
              </Field>

              <Field label="Features (one per line)">
                <textarea className={`${inputCls} h-28`} value={arrayToLines(draft.features)} onChange={(e) => updateDraft('features', linesToArray(e.target.value))} />
              </Field>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#c6c6c7] uppercase tracking-wider">
                    3D Viewer Components (optional, for the interactive PCB inspector)
                  </label>
                  <button
                    onClick={() => setComponentsDraft((prev) => [...prev, { ...EMPTY_COMPONENT }])}
                    className="text-[#00F0FF] font-['JetBrains_Mono',monospace] text-[10px] font-bold border border-[#00F0FF]/40 px-2 py-1 rounded"
                  >
                    + ADD COMPONENT
                  </button>
                </div>
                <div className="space-y-2">
                  {componentsDraft.map((c, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-center bg-white/5 p-2 rounded border border-white/10">
                      <input placeholder="Name" className={inputClsSm} value={c.name} onChange={(e) => setComponentsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))} />
                      <input placeholder="Type" className={inputClsSm} value={c.type} onChange={(e) => setComponentsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, type: e.target.value } : x)))} />
                      <input placeholder="Package" className={inputClsSm} value={c.pkg} onChange={(e) => setComponentsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, pkg: e.target.value } : x)))} />
                      <input placeholder="Purpose" className={inputClsSm} value={c.purpose} onChange={(e) => setComponentsDraft((prev) => prev.map((x, i) => (i === idx ? { ...x, purpose: e.target.value } : x)))} />
                      <button onClick={() => setComponentsDraft((prev) => prev.filter((_, i) => i !== idx))} className="text-[#FF003C] text-xs px-2">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/15">
                <button onClick={saveDraft} className="bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-['JetBrains_Mono',monospace] text-xs font-bold px-5 py-2 rounded">
                  SAVE PROJECT
                </button>
                <button onClick={() => selectProject(null)} className="bg-white/5 border border-white/15 text-[#c6c6c7] font-['JetBrains_Mono',monospace] text-xs font-bold px-5 py-2 rounded">
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const inputCls = 'w-full bg-black/60 border border-white/15 focus:border-[#00F0FF] text-sm font-[\'JetBrains_Mono\',monospace] text-white px-3 py-2 rounded focus:outline-none';
const inputClsSm = 'w-full bg-black/60 border border-white/15 focus:border-[#00F0FF] text-xs font-[\'JetBrains_Mono\',monospace] text-white px-2 py-1.5 rounded focus:outline-none';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block font-['JetBrains_Mono',monospace] text-[11px] text-[#c6c6c7] uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);
