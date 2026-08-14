<div align="center">

# ⚡ hiibrarahmad.github.io

### Hardware Engineering Portfolio — Ibrar Ahmad

**Interactive showcase of real PCB designs, firmware projects, and 3D-rendered hardware — not a template.**

[![Live Site](https://img.shields.io/badge/Live-hiibrarahmad.github.io-00F0FF?style=for-the-badge)](https://hiibrarahmad.github.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Rendering-000000?style=for-the-badge&logo=three.js&logoColor=white)](#)

</div>

---

## 📖 What This Is

The live portfolio at [hiibrarahmad.github.io](https://hiibrarahmad.github.io/) — every project card links to a real GitHub repository, and every "3D PCB MODEL" tab renders an actual model, not a stock render:

- **Real STEP/OBJ model loading** — client-side, in the browser, via `occt-import-js` (STEP) and Three.js `OBJLoader`/`MTLLoader` (pre-converted OBJ). No server-side conversion.
- **Procedural fallback** — for projects without an exported 3D model yet, a stylized procedural PCB view keeps the experience consistent instead of leaving a blank tab.
- **Firmware-aware UI** — projects with no physical PCB (pure firmware/test builds) get an Overview + Terminal view instead of fake layer-stackup and impedance-calculator tabs.
- **Multi-project grid picker** — a consolidated repo (several independent boards/sketches under one roof) opens as a browsable grid instead of forcing everything into one board's view.
- **Category roadmap** — tracks the full PRJ numbering scheme (PCB, Firmware, Apps, EEG/BCI, Audio, Reverse Engineering, Docs, Libraries, Misc) and what's actually been built out so far.

## 🛠️ Tech Stack

- **React 19** + **TypeScript**, built with **Vite 6**
- **Tailwind CSS 4** for styling
- **Three.js** for the 3D PCB viewer (`OBJLoader`/`MTLLoader` + `occt-import-js` for raw STEP files)
- Data-driven: every project is a plain object in `src/data/projectsData.ts` — no CMS, no backend required for the core site

## 🚀 Run Locally

**Prerequisites:** Node.js

```sh
npm install
npm run dev       # starts the dev server on http://localhost:3000
npm run build     # production build to dist/
npm run lint      # type-check (tsc --noEmit)
```

## 📁 Structure

```
src/
├── components/         # ProjectCard, ProjectViewerModal, ProjectGridModal, CategoryRoadmap, ...
├── data/projectsData.ts  # every project — the single source of truth for the site
├── hooks/useProjects.ts  # project state + admin overrides
└── types.ts             # Project shape
```

---

<div align="center">

*Every board here is real. Every render is either the actual exported model or an honest placeholder — never a stock photo standing in for hardware that doesn't exist.*

© 2024 Ibrar Ahmad

</div>
