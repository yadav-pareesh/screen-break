# 🧘 ErgoBreak — Ergonomic Workstation & Screen-Break Pacer

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Workbox%20Offline-5a0fc8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Bundle Size](https://img.shields.io/badge/Initial%20Gzip-~85%20kB-success)](#-performance--bundle-optimization)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%20AA%20Compliant-blueviolet)](#-accessibility--keyboard-first-ux)

> A modern, drift-resilient ergonomics and productivity web application engineered to combat digital eye strain, prolonged sitting, and poor posture for desk professionals. Combines the **20-20-20 visual rest cycle**, **customizable posture movement breaks**, **guided interactive desk stretches**, and an **always-on-top Picture-in-Picture mini timer**.

---

## 🎯 Why I Built This (Problem & Vision)

Desk workers spend 8–12+ hours daily in front of screens, leading to computer vision syndrome (CVS), postural fatigue, and reduced circulation. While standard Pomodoro timers exist:
1. They ignore **frequent micro-intervals** specifically required for optical health (the 20-20-20 rule).
2. Standard web timers suffer from **timer drift** caused by browser background tab throttling.
3. Most wellness tools require heavy native desktop apps or invasive subscription trackers.

**ErgoBreak** is a lightweight, zero-backend, client-first Progressive Web App built with modern Web APIs, strict type safety, zero UI library bloat, and sub-millisecond timer accuracy.

---

## ✨ Key Features

### ⏱️ Drift-Resilient Multi-Phase Timer Engine
- **Timestamp Delta Architecture**: Replaces naive `setInterval(countdown--, 1000)` with absolute timestamps (`performance.now()` & `Date.now()`), eliminating timer drift when tabs are backgrounded or OS threads are suspended.
- **20-20-20 Eye-Rest Rhythm**: Every 20 minutes, prompts a 20-second break to look 20 feet away.
- **Configurable Posture & Movement Pacer**: Independent or coordinated movement intervals (10–180 min) with guided physical exercises.
- **Phase State Machine**: Non-blocking orchestration between **Focus**, **Eye Break**, and **Movement Break** states without race conditions or overlapping alerts.
- **Smart Tab Visibility Handling**: Automatically detects tab switches (`visibilitychange`) and syncs accurate elapsed time or pauses according to user preferences.

### 🖼️ Document Picture-in-Picture (PiP) Mini Timer
- Implements the cutting-edge **Document Picture-in-Picture API** to render an always-on-top, floating mini-timer window over code editors, IDEs, and spreadsheets.
- Live bi-directional DOM synchronization: Controls (pause, resume, skip) triggered from the PiP window instantly update the primary app state and vice versa.
- Graceful degradation: Seamlessly detects browser support and hides or degrades controls if unsupported.

### 🧘 Interactive Desk Stretch Player & Library
- **16 Guided Ergonomic Exercises** categorized across 5 body zones: *Neck*, *Shoulders*, *Wrists & Hands*, *Back & Spine*, and *Legs & Posture*.
- **14 Bespoke Animated SVGs**: Hand-crafted, zero-external-asset vector graphics with lightweight CSS keyframe animations demonstrating correct ergonomics.
- **Step-by-Step Exercise Player**: Real-time interval countdown per stretch, rep counters, anatomical instructions, and safety disclaimers.
- Filterable and searchable exercise catalog.

### 🔔 Native Web Notifications & Web Audio Synthesis
- **Web Audio API Sound Engine**: Procedurally synthesizes harmonic acoustic chimes (sine oscillators + custom ADSR gain envelopes) in memory without external audio assets. Tolerant of browser autoplay policies.
- **Web Notifications API**: Non-intrusive system notifications for background break alerts, requesting permissions strictly on user intent.

### 📊 Local Analytics & Streak Tracking
- Daily break completion counters (Eye Breaks, Movement Breaks, Focus Minutes).
- 7-day visual interactive bar chart with zero charting library dependencies.
- Persistent milestone and daily streak tracking stored in versioned `localStorage`.

### 🎨 Design System & Customization
- Built with a custom Vanilla CSS design system (Tailwind tokens + CSS Custom Properties).
- Fluid light, dark, and system-adaptive color schemes with zero flash of unstyled theme (FOUT).
- Segmented settings drawer for interval configurations, audio volume, reduced motion, and high contrast.

---

## 🏗️ Architecture & Engineering Highlights

```
src/
├── types/                      # Comprehensive TypeScript Domain Models
│   └── index.ts                # Timers, settings, statistics, and exercise definitions
├── utils/                      # Pure Business Logic & Browser Adapters
│   ├── timerEngine.ts          # Drift-free timestamp delta calculations
│   ├── storage.ts              # Versioned localStorage with schema migration
│   ├── browserCapabilities.ts  # Progressive enhancement feature detection
│   └── audio.ts                # Web Audio API tone synthesis (ADSR envelopes)
├── hooks/                      # Decoupled React State & Lifecycle Hooks
│   ├── useTimer.ts             # Primary timer state machine & phase coordinator
│   ├── useSettings.ts          # User preferences & theme synchronization
│   ├── useStatistics.ts        # Streak computation & daily metrics aggregation
│   └── useKeyboardShortcuts.ts # Global accessible hotkey manager
├── data/                       # Ergonomic exercise dataset & recommendation heuristics
│   └── exercises.ts
├── components/                 # Component Architecture
│   ├── CircularTimer.tsx       # SVG progress circle with smooth stroke dashoffset
│   ├── TimerControls.tsx       # State-driven playback actions
│   ├── SessionStats.tsx        # Dashboard metrics bar
│   ├── ExerciseSVG.tsx         # 14 custom vector ergonomic illustrations
│   ├── ExercisePlayer.tsx      # Modal stretch stepper (Lazy-loaded)
│   ├── ExerciseLibrary.tsx     # Filterable exercise drawer (Lazy-loaded)
│   ├── SettingsPanel.tsx       # Configuration panel (Lazy-loaded)
│   ├── StatisticsPanel.tsx     # Visual metrics & 7-day bar chart (Lazy-loaded)
│   ├── PiP.tsx                 # Document Picture-in-Picture bridge
│   └── Onboarding.tsx          # 4-step progressive onboarding walkthrough
└── App.tsx                     # Top-level orchestrator & layout root
```

---

## 💡 Key Technical Decisions & Interview Talking Points

### 1. Drift-Free Timers vs. `setInterval`
* **Problem**: Standard `setInterval` or `setTimeout` degrades severely when a user switches tabs. Browsers throttle timers to 1 execution per second or even 1 per minute to conserve battery and CPU. Over a 20-minute cycle, a naive timer can accumulate minutes of error.
* **Solution**: ErgoBreak uses an absolute timestamp delta strategy. When the timer begins, target end timestamps are recorded (`Date.now() + durationMs`). Each frame or tick computes `remaining = Math.max(0, targetTime - Date.now())`. A `visibilitychange` listener recalculates elapsed time instantaneously upon tab reactivation.

### 2. Algorithmic Web Audio vs. MP3/WAV Assets
* **Problem**: Bundling audio files adds network payload, requires caching strategies, and often stumbles on mobile browser decode latency or 404 caching bugs.
* **Solution**: Implemented an in-memory tone generator utilizing the browser's native `AudioContext`. Frequencies are tuned to pleasant musical intervals (e.g., dual-frequency chime at 523.25 Hz & 659.25 Hz) with linear ramp ADSR gain envelopes. It guarantees instant playback, zero network overhead, and zero asset dependencies.

### 3. Document Picture-in-Picture Integration
* **Problem**: Traditional Canvas PiP (`video.captureStream()`) allows rendering video or canvas in PiP, but does not allow interactive HTML buttons (pause, skip, reset) inside the native floating window.
* **Solution**: Leveraged the modern **Document Picture-in-Picture API** (`window.documentPictureInPicture.requestWindow`), cloning active styles into the window and mounting React controls directly into the external DOM tree with real-time bi-directional synchronization.

### 4. Zero-Bloat Bundle & Code Splitting
* **Problem**: Modern wellness and timer apps often ship with 300 kB–1 MB+ of dependencies for UI components, animations, and icons.
* **Solution**: ErgoBreak has **zero external UI framework dependencies** (no Radix, no MUI, no Chakra). Heavy feature drawers (`SettingsPanel`, `StatisticsPanel`, `ExerciseLibrary`, `ExercisePlayer`) are dynamically imported via `React.lazy` and `Suspense`, keeping the critical-path vendor bundle lean:
  - **Initial Core Load**: `~85 kB` gzipped
  - **CSS Footprint**: `< 9 kB` gzipped

---

## ⚡ Performance & Bundle Optimization

Production bundle analysis (via Rolldown / Vite):

| Chunk | Size (raw) | Size (gzip) | Role |
| :--- | :--- | :--- | :--- |
| `vendor-DFRqyHnC.js` | 211.11 kB | **65.85 kB** | React 19 Core Runtime |
| `index-iDvHtwph.js` | 36.22 kB | **11.00 kB** | Application Engine & Hooks |
| `index-D_bZVs8J.css` | 40.81 kB | **8.02 kB** | Complete Design System & Dark Mode |
| `icons-BR4YHeU_.js` | 17.27 kB | **6.78 kB** | Tree-shaken Lucide Icons |
| `SettingsPanel.js` | 9.55 kB | **2.75 kB** | Lazy chunk |
| `ExerciseSVG.js` | 14.43 kB | **1.98 kB** | Lazy chunk (Vector graphics) |
| `ExerciseLibrary.js` | 4.03 kB | **1.47 kB** | Lazy chunk |
| `ExercisePlayer.js` | 3.40 kB | **1.31 kB** | Lazy chunk |
| `StatisticsPanel.js` | 3.74 kB | **1.23 kB** | Lazy chunk |

---

## ♿ Accessibility & Keyboard-First UX

- **Full Keyboard Navigation**:
  - `Space` — Toggle Play / Pause
  - `R` — Reset Timer
  - `S` — Skip Current Phase
  - `E` — Open Exercise Library
  - `P` — Toggle Picture-in-Picture Mini Timer
  - `Esc` — Dismiss active modals or slide-over panels
- **Screen Reader Support**: ARIA live regions (`aria-live="polite"`), explicit progress labels (`aria-valuenow`), accessible toggle switches (`role="switch"`, `aria-checked`), and descriptive form control bindings.
- **Adaptive Ergonomics**: Native support for `prefers-reduced-motion` and an explicit in-app **High Contrast Mode**.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript (Strict Mode)
- **Tooling & Build**: Vite, Rolldown / ESBuild, TypeScript Compiler (`tsc`)
- **PWA / Service Worker**: `vite-plugin-pwa`, Workbox
- **Icons**: `lucide-react` (strictly tree-shaken)
- **Styling**: Vanilla CSS with modern custom properties (Tokens, Glassmorphism, CSS Grid & Flexbox)
- **Storage**: Versioned browser `localStorage` with automated migration fallbacks

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `18.x` or higher
- npm `9.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yadav-pareesh/screen-break.git
   cd screen-break
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Type check & build for production**:
   ```bash
   # Run strict TypeScript validation
   npx tsc --noEmit

   # Generate optimized production bundle
   npm run build

   # Preview production build locally
   npm run preview
   ```

---

## 📈 Future Roadmap

- [ ] Web Worker fallback timer for older browsers without Document PiP.
- [ ] Customizable sound profiles (white noise, ambient rain, singing bowls).
- [ ] Exportable session analytics (CSV / JSON data export).
- [ ] Integration with WebHID / smart standing desks for automated sit-stand reminders.

---

## 👨‍💻 Author

### **Pareesh Yadav**
*Software Engineer / Frontend Developer*

- 🌐 **Portfolio**: [pareeshyadav.xyz](https://pareeshyadav.xyz)
- 💼 **LinkedIn**: [linkedin.com/in/pareeshyadav](https://linkedin.com/in/pareeshyadav)
- 🐙 **GitHub**: [@yadav-pareesh](https://github.com/yadav-pareesh)

---

*Crafted with precision, empathy for developer ergonomics, and clean code principles.*
