# ApprovalPulse — AICTE Approval & Compliance Tracking System

> **Smart India Hackathon (SIH) Solution**  
> A transparent, role-based, SLA-driven digital governance platform transforming the AICTE technical institution approval process.

[![Vercel Compatible](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🏛️ Executive Overview

ApprovalPulse re-engineers the traditional multi-tiered AICTE approval lifecycle into an agile, accountable, and transparent digital workflow. Designed specifically to resolve bottlenecks identified in AICTE Approval Process Handbooks (APH), ApprovalPulse eliminates opaque delays, tracks SLA adherence in real-time, automates conflict-free expert committee visits, and maintains an unalterable audit trail.

---

## 🚀 Key Modules & Personas

ApprovalPulse provides tailored, role-specific portals accessible through quick one-click role switching or direct login:

| Role | Demo Persona | Primary Responsibilities |
|---|---|---|
| **Institution Nodal Officer** | Dr. Meera Iyer | Application tracking (parcel-style timeline), deficiency resolution, fee receipts, digital approval letter download |
| **Scrutiny Officer** | Rajiv Menon | Split-screen document verification, checklist auditing, structured deficiency returns with reason codes |
| **EVC Expert Member** | Col. Suresh Nair | Visit calendar with clash/conflict detection, institutional infrastructure evaluation, geo-tagged report filing |
| **Approval Committee** | Prof. S. Ramachandran | Quorum consensus, human-only decision recording, AI-watermarked case summarization |
| **Regional Officer / HQ** | Dr. K. Balasubramanian | Regional pendency matrices, SLA breach escalation monitors, ageing analysis, bottleneck identification |
| **System Administrator** | Ananya Rao | Policy configuration, SLA threshold management, immutable audit logs, **Live Time Simulator** |

---

## ✨ Standout Features

### 1. Parcel-Style Milestone Tracker
- Visual step-by-step progress tracking for technical institutions.
- Color-coded stage indicators: `Submitted` → `Scrutiny` → `EVC Visit` → `SAC Hearing` → `Executive Approval`.
- Instant access to deficiency letters and downloadable digital approval orders.

### 2. Split-Screen Scrutiny Workbench
- Side-by-side document inspection and compliance checklists.
- 10-point standard compliance verification (land title, built-up area, FSI, faculty ratio, lab equipment).
- Standardized return reason codes with strict turnaround SLA clocks.

### 3. EVC Visit Scheduling & Conflict Engine
- Expert visit allocation with automated schedule conflict detection.
- Proximity and institution-expert clash prevention to guarantee integrity.

### 4. AI-Watermarked Committee Summaries & Human-in-the-Loop Decisions
- Machine-synthesized case briefs explicitly watermarked with AI disclaimer tags.
- Strict human-exclusive final decision recording ensuring legal and procedural compliance.

### 5. Regional Pendency & SLA Monitoring Matrix
- Stacked bar charts and cross-tabulated heatmaps of applications across regional offices.
- Granular ageing distribution (<7 days, 8-15 days, 16-30 days, >30 days).

### 6. Demo Time Simulator
- Fast-forward time (1 day, 7 days, 15 days) to observe real-time SLA state transitions and automated breach alerts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, custom design tokens, modern glassmorphism & typography
- **Visualizations**: Recharts (Stacked bar charts, Area trends, Responsive containers)
- **Icons**: Lucide React
- **Deployment**: Configured for instant single-page application (SPA) deployment on **Vercel** (`vercel.json`)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/aryanRN2/ApprovalPulse.git
cd ApprovalPulse

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser.

---

## 🚢 Deploying to Vercel

The project includes an optimized `vercel.json` rewrite configuration and Vite code-splitting settings:

1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset will auto-detect as **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

---

## 👥 Authors & Acknowledgments

Built for the **Smart India Hackathon (SIH)**.  
*Team ApprovalPulse*
