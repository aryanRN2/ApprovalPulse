import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { MOCK_USERS } from '../lib/data';
import type { Role } from '../lib/data';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  ChevronDown,
  Scale,
  Sparkles,
  Lock,
  Layers,
  Check,
  Play,
  X,
  Menu,
  FileCheck2,
  ChevronRight,
  LogOut,
  Sliders
} from 'lucide-react';

const ROLE_INFO: Record<Role, { title: string; desc: string; route: string }> = {
  institution: {
    title: 'Institution Nodal Officer',
    desc: 'Real-time parcel milestone tracking, deficiency rectification, fee receipts, and digital approval orders.',
    route: '/institution',
  },
  scrutiny_officer: {
    title: 'Scrutiny Officer',
    desc: 'Split-screen regulatory audit, 10-point checklist verification, and structured deficiency notices.',
    route: '/officer',
  },
  regional_officer: {
    title: 'Regional Bureau Head',
    desc: 'Regional pendency heatmaps, SLA breach escalation monitors, and ageing distribution analysis.',
    route: '/dashboard',
  },
  bureau_head: {
    title: 'National Bureau Head',
    desc: 'National oversight across all 33 regions, systemic bottleneck resolution, and policy adjustments.',
    route: '/dashboard',
  },
  evc_member: {
    title: 'EVC Expert Member',
    desc: 'Proximity-aware visit scheduling with clash detection, geo-tagged infrastructure verification.',
    route: '/evc',
  },
  committee_member: {
    title: 'Approval Committee',
    desc: 'AI-synthesized case briefs with human-exclusive voting, quorum recording, and final order issuance.',
    route: '/committee',
  },
  admin: {
    title: 'System Administrator',
    desc: 'SLA threshold configuration, unalterable audit trails, and interactive demo time-simulator.',
    route: '/admin',
  },
};

export default function LandingPage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'timeline' | 'scrutiny' | 'regional'>('timeline');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Interactive Checklist in Scrutiny Preview
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: 'Clear Land Title & Non-Encumbrance (5.2 Acres)', compliant: true },
    { id: 2, label: 'Approved Building Plan (12,400 sq.m Built-up Area)', compliant: true },
    { id: 3, label: 'Cadre & Faculty-Student Ratio (1:15 compliance)', compliant: true },
    { id: 4, label: 'Laboratories & Workshop Equipment Ingestion', compliant: false },
    { id: 5, label: 'Fire & Life Safety NOC (Valid till 2026)', compliant: true },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklistItems(prev =>
      prev.map(item => (item.id === id ? { ...item, compliant: !item.compliant } : item))
    );
  };

  const handleLaunchRole = (userId: string, targetRoute: string) => {
    login(userId);
    setRoleModalOpen(false);
    setMobileMenuOpen(false);
    navigate(targetRoute);
  };

  const handlePrimaryCta = () => {
    if (user) {
      navigate(ROLE_INFO[user.role]?.route ?? '/institution');
    } else {
      setRoleModalOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-ink font-sans overflow-x-hidden">
      {/* ── Navigation Bar ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
        <div className="content-width h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-[28px] h-[28px] bg-accent rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold leading-none">AP</span>
            </div>
            <span className="font-semibold text-ink text-sm leading-none whitespace-nowrap">ApprovalPulse</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2.5 text-sm text-muted">
            <a href="#workflow" className="hover:text-ink transition-colors whitespace-nowrap">Workflow</a>
            <a href="#features" className="hover:text-ink transition-colors whitespace-nowrap">Features</a>
            <a href="#personas" className="hover:text-ink transition-colors whitespace-nowrap">Role Personas</a>
            <a href="#architecture" className="hover:text-ink transition-colors whitespace-nowrap">Architecture</a>
            <a href="#faq" className="hover:text-ink transition-colors whitespace-nowrap">FAQ</a>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(ROLE_INFO[user.role]?.route ?? '/institution')}
                  className="btn-primary text-xs whitespace-nowrap"
                >
                  <span>Workspace</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="btn-ghost text-xs p-1.5"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-ghost text-xs whitespace-nowrap hidden sm:inline-flex"
                >
                  Portal Sign In
                </button>
                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="btn-primary text-xs whitespace-nowrap"
                >
                  <span>Demo Roles</span>
                  <ChevronRight size={13} />
                </button>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="landing-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden btn-ghost p-1.5 text-ink flex items-center justify-center -mr-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1 text-sm font-medium">
              <button
                onClick={() => scrollToSection('workflow')}
                className="text-left py-2 px-2 rounded hover:bg-surface text-ink transition-colors"
              >
                Workflow Pipeline
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-left py-2 px-2 rounded hover:bg-surface text-ink transition-colors"
              >
                Architectural Features
              </button>
              <button
                onClick={() => scrollToSection('personas')}
                className="text-left py-2 px-2 rounded hover:bg-surface text-ink transition-colors"
              >
                Role Personas &amp; Logins
              </button>
              <button
                onClick={() => scrollToSection('architecture')}
                className="text-left py-2 px-2 rounded hover:bg-surface text-ink transition-colors"
              >
                Time Simulator
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left py-2 px-2 rounded hover:bg-surface text-ink transition-colors"
              >
                FAQ
              </button>
            </nav>

            <div className="pt-2 border-t border-border flex flex-col gap-1.5">
              {!user ? (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="btn-secondary w-full justify-center text-xs py-2"
                  >
                    Portal Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setRoleModalOpen(true); }}
                    className="btn-primary w-full justify-center text-xs py-2"
                  >
                    Select Demo Role
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate(ROLE_INFO[user.role]?.route ?? '/institution'); }}
                  className="btn-primary w-full justify-center text-xs py-2"
                >
                  Enter Workspace
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content Container ────────────────────────────── */}
      <main>
        {/* ── Hero Section ────────────────────────────────────── */}
        <section className="py-6 sm:py-10 text-center content-width">
          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-ink leading-tight max-w-3xl mx-auto px-1">
            Transparent Approvals. <br className="hidden sm:inline" />
            <span className="text-accent">Zero Administrative Opacity.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2.5 text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed px-2">
            ApprovalPulse re-engineers the AICTE accreditation lifecycle into an SLA-guaranteed,
            conflict-free digital pipeline. Real-time parcel tracking, split-screen scrutiny, and human-in-the-loop governance.
          </p>

          {/* CTAs */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 max-w-xs sm:max-w-none mx-auto">
            <button
              id="hero-launch-demo"
              onClick={handlePrimaryCta}
              className="btn-primary text-sm px-4 py-2 whitespace-nowrap w-full sm:w-auto"
            >
              <span>Launch Live System Demo</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('interactive-preview');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary text-sm px-4 py-2 whitespace-nowrap w-full sm:w-auto"
            >
              <Play size={13} className="text-muted" />
              <span>Explore Interactive Mockup</span>
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted px-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-success flex-shrink-0" />
              <span>APH 2024-25 SLA Standard</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-accent flex-shrink-0" />
              <span>Proximity Clash Prevention</span>
            </span>
            <span className="flex items-center gap-1">
              <Scale size={13} className="text-muted flex-shrink-0" />
              <span>Legal Quorum Human Voting</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock size={13} className="text-muted flex-shrink-0" />
              <span>Tamper-Proof Audit Trail</span>
            </span>
          </div>
        </section>

        {/* ── Interactive Live Preview Section ───────────────── */}
        <section id="interactive-preview" className="content-width pb-6">
          <div className="card overflow-hidden p-0">
            {/* Top Toolbar / Tab Switcher */}
            <div className="px-3 py-2 bg-surface border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  <div className="w-[8px] h-[8px] rounded-full bg-border" />
                  <div className="w-[8px] h-[8px] rounded-full bg-border" />
                  <div className="w-[8px] h-[8px] rounded-full bg-border" />
                </div>
                <span className="text-xs font-mono text-muted ml-1.5 truncate">approvalpulse.aicte.gov.in</span>
              </div>

              {/* View Switcher Tabs (Scrollable on small mobile) */}
              <div className="inline-flex rounded border border-border bg-white text-xs overflow-x-auto max-w-full touch-scroll no-scrollbar p-0.5">
                <button
                  onClick={() => setActivePreviewTab('timeline')}
                  className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors rounded-sm ${
                    activePreviewTab === 'timeline'
                      ? 'bg-accent text-white'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="hidden sm:inline">Parcel Milestone Tracker</span>
                  <span className="sm:hidden">Milestones</span>
                </button>
                <button
                  onClick={() => setActivePreviewTab('scrutiny')}
                  className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap border-l border-border transition-colors rounded-sm ${
                    activePreviewTab === 'scrutiny'
                      ? 'bg-accent text-white'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="hidden sm:inline">Split-Screen Scrutiny</span>
                  <span className="sm:hidden">Scrutiny</span>
                </button>
                <button
                  onClick={() => setActivePreviewTab('regional')}
                  className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap border-l border-border transition-colors rounded-sm ${
                    activePreviewTab === 'regional'
                      ? 'bg-accent text-white'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="hidden sm:inline">Regional Pendency Matrix</span>
                  <span className="sm:hidden">Regional</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Parcel-Style Timeline Preview */}
            {activePreviewTab === 'timeline' && (
              <div className="p-3 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-ink text-sm">Sunrise Institute of Technology, Pune</h3>
                      <span className="text-xs text-success font-semibold">On-Track (72% SLA)</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">Application Ref: AICTE/MH/2024/NI/0042 · Region: Western (Maharashtra)</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-muted">Target Decision SLA:</span>
                    <span className="font-semibold text-accent font-mono">11 Days Remaining</span>
                  </div>
                </div>

                {/* Stepper Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {[
                    { title: '1. Ingestion', desc: 'Fee & Digital Sign Validated', status: 'done', date: 'Sep 01, 2024' },
                    { title: '2. Scrutiny', desc: 'Desk Verification (Rajiv M.)', status: 'current', date: 'In Progress (Day 4/7)' },
                    { title: '3. EVC Visit', desc: 'Conflict-Free Peer Inspection', status: 'queued', date: 'Queued for Sep 18' },
                    { title: '4. Hearing', desc: 'Standing Hearing Committee', status: 'pending', date: 'Estimated Sep 24' },
                    { title: '5. Order', desc: 'Executive Digital Letter', status: 'pending', date: 'Final Issuance' },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`card-sm text-left ${
                        step.status === 'done'
                          ? 'bg-surface border-border'
                          : step.status === 'current'
                          ? 'bg-accent-light border-blue-200'
                          : 'bg-white border-border opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-muted uppercase">Stage 0{idx + 1}</span>
                        {step.status === 'done' && <CheckCircle2 size={13} className="text-success" />}
                        {step.status === 'current' && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                      </div>
                      <p className="text-xs font-semibold text-ink">{step.title}</p>
                      <p className="text-[11px] text-muted mt-0.5 leading-tight">{step.desc}</p>
                      <p className="text-[10px] text-muted mt-1.5 pt-1 border-t border-border font-mono">{step.date}</p>
                    </div>
                  ))}
                </div>

                {/* Sub-card details */}
                <div className="card-sm bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5 text-xs">
                    <p className="font-semibold text-ink">Assigned Scrutiny Desk: Rajiv Menon (Senior Technical Officer)</p>
                    <p className="text-muted">Deficiency status: 0 critical defects flagged · 1 minor undertaking pending (due in 5 days).</p>
                  </div>
                  <button
                    onClick={() => handleLaunchRole('u1', '/institution')}
                    className="btn-secondary text-xs flex-shrink-0"
                  >
                    <span>Inspect College Portal</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Split-Screen Scrutiny Preview */}
            {activePreviewTab === 'scrutiny' && (
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <h3 className="font-semibold text-ink text-sm">Regulatory Audit Desk — Side-by-Side Verification</h3>
                    <p className="text-xs text-muted">Scrutiny Officer: Rajiv Menon · Click items below to toggle compliance state.</p>
                  </div>
                  <span className="text-xs text-muted font-mono">SLA Window: 7 Days</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Left: Document extract */}
                  <div className="card-sm bg-surface space-y-2">
                    <div className="flex items-center justify-between font-semibold text-ink pb-1 border-b border-border">
                      <span className="flex items-center gap-1 text-xs">
                        <FileText size={13} className="text-accent" />
                        <span>Submitted Affidavit Extract</span>
                      </span>
                      <span className="text-[11px] text-muted">Verified e-Sign</span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono bg-white p-2 rounded border border-border text-ink">
                      <p><span className="text-muted">INSTITUTE:</span> Sunrise Institute of Technology</p>
                      <p><span className="text-muted">LAND PARCEL:</span> 5.20 Acres (Survey #142/2A, Pune)</p>
                      <p><span className="text-muted">TOTAL BUILT-UP:</span> 12,400 sq. meters approved area</p>
                      <p><span className="text-muted">PROGRAMS:</span> Computer Science, Electronics, Mech</p>
                      <p><span className="text-muted">FIRE NOC:</span> CFO/MH/2024/778 (Valid to Oct 2026)</p>
                    </div>

                    <p className="text-[11px] text-muted">
                      All land coordinates verified against municipal master plan records and GIS survey.
                    </p>
                  </div>

                  {/* Right: Interactive Checklist */}
                  <div className="card-sm space-y-2">
                    <div className="flex items-center justify-between font-semibold pb-1 border-b border-border">
                      <span className="flex items-center gap-1 text-xs text-ink">
                        <CheckCircle2 size={13} className="text-success" />
                        <span>10-Point Regulatory Checklist</span>
                      </span>
                      <span className="text-[11px] text-accent font-semibold">
                        {checklistItems.filter(i => i.compliant).length} of {checklistItems.length} Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      {checklistItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklist(item.id)}
                          className={`flex items-start gap-1.5 p-1.5 rounded cursor-pointer transition-colors border ${
                            item.compliant
                              ? 'bg-green-50/50 border-green-200 text-ink'
                              : 'bg-amber-50/50 border-amber-200 text-ink'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center flex-shrink-0 text-white ${
                              item.compliant ? 'bg-success' : 'bg-muted'
                            }`}
                          >
                            {item.compliant && <Check size={10} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold leading-tight">{item.label}</p>
                            <p className="text-[10px] text-muted">
                              {item.compliant ? 'Compliant with AICTE Chapter I' : 'Pending physical invoice confirmation'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleLaunchRole('u2', '/officer')}
                        className="btn-primary text-xs"
                      >
                        <span>Open Officer Workbench</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Regional Pendency Matrix Preview */}
            {activePreviewTab === 'regional' && (
              <div className="p-3 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-1">
                  <div>
                    <h3 className="font-semibold text-ink text-sm">National Pendency &amp; SLA Compliance Heatmap</h3>
                    <p className="text-xs text-muted">Live operational data aggregated across 33 regional jurisdictions.</p>
                  </div>
                  <span className="text-xs text-success font-semibold font-mono">National SLA: 91.4%</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { region: 'Western (Mumbai)', apps: '614 Cases', sla: '94.2%', breach: '2 Warnings' },
                    { region: 'Southern (Bangalore)', apps: '728 Cases', sla: '92.8%', breach: '3 Warnings' },
                    { region: 'Northern (Kanpur)', apps: '512 Cases', sla: '89.1%', breach: '6 Warnings' },
                    { region: 'Central (Bhopal)', apps: '390 Cases', sla: '93.5%', breach: '1 Warning' },
                  ].map((r, i) => (
                    <div key={i} className="card-sm bg-surface">
                      <p className="text-xs font-semibold text-ink truncate">{r.region}</p>
                      <p className="text-base font-semibold text-ink mt-0.5">{r.sla}</p>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-border text-[10px] text-muted">
                        <span>{r.apps}</span>
                        <span className="text-warning font-semibold">{r.breach}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-sm bg-surface flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-ink">Regional Director Escalation Alerts Active</p>
                    <p className="text-muted text-[11px]">Automated alerts triggered whenever scrutiny exceeds 75% of statutory deadline.</p>
                  </div>
                  <button
                    onClick={() => handleLaunchRole('u3', '/dashboard')}
                    className="btn-primary text-xs flex-shrink-0"
                  >
                    View Executive Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Metric Highlights ────────────────────────────────── */}
        <section className="border-y border-border bg-surface py-4">
          <div className="content-width grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="stat-card bg-white">
              <p className="stat-value text-ink">14 Days</p>
              <p className="stat-label">Average Turnaround Cycle</p>
              <p className="text-[11px] text-success font-semibold mt-0.5">Down from 90+ days</p>
            </div>
            <div className="stat-card bg-white">
              <p className="stat-value text-accent">91.4%</p>
              <p className="stat-label">SLA Adherence Rate</p>
              <p className="text-[11px] text-muted mt-0.5">Across 33 Regional Offices</p>
            </div>
            <div className="stat-card bg-white">
              <p className="stat-value text-ink">2,847+</p>
              <p className="stat-label">Institutions Tracked</p>
              <p className="text-[11px] text-muted mt-0.5">Zero File Stagnation</p>
            </div>
            <div className="stat-card bg-white">
              <p className="stat-value text-ink">0%</p>
              <p className="stat-label">Undetected EVC Clashes</p>
              <p className="text-[11px] text-success font-semibold mt-0.5">Algorithmic Impartiality</p>
            </div>
          </div>
        </section>

        {/* ── Key Architectural Pillars (Bento Grid) ─────────── */}
        <section id="features" className="content-width py-6">
          <div className="text-center max-w-xl mx-auto mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Architectural Pillars</p>
            <h2 className="text-2xl">Built to Solve AICTE's Toughest Bottlenecks</h2>
            <p className="text-sm text-muted mt-0.5">
              Every feature directly addresses pain points documented in the AICTE Approval Process Handbook (APH).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">Real-Time SLA Enforcement</h3>
              <p className="text-xs text-muted leading-relaxed">
                Stage-wise countdown timers enforce statutory limits. Automatic escalation alerts to Bureau Heads prevent intentional or bureaucratic delays.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                7-Day Scrutiny Clock · Automated Escalation
              </p>
            </div>

            {/* Card 2 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">Parcel-Style Transparency</h3>
              <p className="text-xs text-muted leading-relaxed">
                Colleges track their application exactly like a modern courier: current desk, responsible officer, pending undertakings, and target decision date.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                Zero Backchannel Inquiries · Public Milestones
              </p>
            </div>

            {/* Card 3 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">Split-Screen Scrutiny Desk</h3>
              <p className="text-xs text-muted leading-relaxed">
                Side-by-side verification of land records, building plans, and faculty lists with standardized deficiency codes and a structured 7-day cure window.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                Standard Defect Codes · Fair Cure Periods
              </p>
            </div>

            {/* Card 4 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">Conflict-Free EVC Engine</h3>
              <p className="text-xs text-muted leading-relaxed">
                Proximity-aware assignment algorithm automatically detects and prevents pairing experts with alma maters, previous employers, or rival colleges.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                Geo-Fenced Conflict Checks · Impartial Panels
              </p>
            </div>

            {/* Card 5 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">AI Summaries + Human Quorum</h3>
              <p className="text-xs text-muted leading-relaxed">
                Machine intelligence synthesizes 500-page institutional submissions into concise 1-page briefs. Legal decisions remain strictly human-in-the-loop.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                Clear AI Watermark Tags · Committee Vote
              </p>
            </div>

            {/* Card 6 */}
            <div className="card space-y-1">
              <h3 className="text-base font-semibold">Tamper-Proof Audit &amp; Orders</h3>
              <p className="text-xs text-muted leading-relaxed">
                Immutable event logs record every note, document upload, and quorum sign-off. Instant generation of cryptographically verifiable approval orders.
              </p>
              <p className="text-[11px] text-muted font-mono pt-1 border-t border-border">
                Non-Repudiation Security · Instant Digital Order
              </p>
            </div>
          </div>
        </section>

        {/* ── Workflow Pipeline (How It Works) ─────────────────── */}
        <section id="workflow" className="border-y border-border bg-surface py-6">
          <div className="content-width">
            <div className="text-center max-w-xl mx-auto mb-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Standardized Process</p>
              <h2 className="text-2xl">The 4-Stage Approval Pipeline</h2>
              <p className="text-sm text-muted mt-0.5">
                From initial application ingestion to final Council executive authorization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {[
                {
                  step: '01',
                  title: 'Digital Ingestion',
                  desc: 'Colleges upload certified land deeds, structural drawings, and affidavits with instant automated format validation.',
                  tag: 'Day 1–3',
                },
                {
                  step: '02',
                  title: 'Split-Screen Scrutiny',
                  desc: 'Scrutiny Officer audits 10 core compliances. Deficiencies trigger a standardized 7-day cure window with no file termination.',
                  tag: 'Day 4–10',
                },
                {
                  step: '03',
                  title: 'EVC Peer Inspection',
                  desc: 'Conflict-screened committee visits campus, uploads geo-tagged lab and classroom evidence directly to the portal.',
                  tag: 'Day 11–18',
                },
                {
                  step: '04',
                  title: 'Executive Order',
                  desc: 'Standing Hearing Committee reviews AI-summarized brief, records quorum consensus, and issues digitally signed order.',
                  tag: 'Day 19–25',
                },
              ].map((item, idx) => (
                <div key={idx} className="card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-accent font-mono">{item.step}</span>
                    <span className="text-xs text-muted font-mono">{item.tag}</span>
                  </div>
                  <h3 className="text-sm pt-0.5">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Role Persona Launchpad ───────────────────────────── */}
        <section id="personas" className="content-width py-6">
          <div className="text-center max-w-xl mx-auto mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Interactive Test Drive</p>
            <h2 className="text-2xl">Experience the Platform as Any Persona</h2>
            <p className="text-sm text-muted mt-0.5">
              Click any role below to instantly authenticate and explore their dedicated interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {MOCK_USERS.filter(u => u.role !== 'bureau_head').map(userItem => {
              const info = ROLE_INFO[userItem.role];
              return (
                <div key={userItem.id} className="card flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted font-mono">{userItem.id}</p>

                    <div>
                      <h3 className="text-sm font-semibold">{userItem.name}</h3>
                      <p className="text-xs text-muted">{info.title}</p>
                    </div>

                    <p className="text-xs text-muted leading-relaxed">
                      {info.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLaunchRole(userItem.id, info.route)}
                    className="btn-secondary w-full justify-between text-xs mt-1"
                  >
                    <span>Launch as {userItem.name.split(' ')[0]}</span>
                    <ArrowRight size={13} className="text-muted" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Demo Simulator Spotlight ────────────────────────── */}
        <section id="architecture" className="border-y border-border bg-surface py-5">
          <div className="content-width flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-0.5">Feature Highlight</p>
              <h2 className="text-xl">Live Time-Simulator for Evaluation</h2>
              <p className="text-xs text-muted leading-relaxed">
                Evaluate regulatory edge cases in seconds instead of waiting months. Administrators can fast-forward system time by 1, 7, or 15 days to observe real-time SLA degradation, automated breach warnings, and bureau escalations.
              </p>
              <p className="text-xs text-muted font-mono pt-1">
                Simulate: +1 Day Increment · +7 Days (Warning) · +15 Days (Breach)
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => handleLaunchRole('u7', '/admin')}
                className="btn-primary text-xs whitespace-nowrap"
              >
                <span>Launch Time Simulator (Admin)</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* ── Frequently Asked Questions ──────────────────────── */}
        <section id="faq" className="content-width py-6 max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Clarifications</p>
            <h2 className="text-2xl">Frequently Asked Questions</h2>
            <p className="text-sm text-muted mt-0.5">
              Key governance, compliance, and procedural inquiries.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {[
              {
                q: 'How does ApprovalPulse enforce the AICTE Approval Process Handbook (APH) SLA?',
                a: 'The platform integrates parameterized countdown clocks for every statutory milestone (Scrutiny, EVC, SHC, SAC). When an application spends 75% of its allocated window at a particular desk, yellow alerts are generated. Crossing 100% triggers high-priority escalation notices to the Regional Bureau Head and Member Secretary.',
              },
              {
                q: 'How are Expert Visit Committee (EVC) conflicts of interest prevented?',
                a: 'ApprovalPulse runs an automated screening algorithm against expert profiles before allocating inspection panels. It blocks experts from inspecting institutions located within their home district, institutions where they were alumni or faculty, or institutions affiliated with close family members.',
              },
              {
                q: 'What happens when a Scrutiny Officer finds missing or deficient documents?',
                a: 'Instead of arbitrary rejections or endless backchannel delays, the officer must select standardized deficiency codes. This automatically opens a 7-day cure window for the institution, with an unalterable timestamped notification sent via SMS and portal inbox.',
              },
              {
                q: 'Is AI allowed to make final accreditation decisions?',
                a: 'No. In strict compliance with regulatory legal norms, AI is restricted to summarization, OCR extraction, and checklist cross-referencing. Final approvals and rejections require human quorum voting and digital signatures by authorized committee members.',
              },
              {
                q: 'How do I test this during hackathon evaluations?',
                a: 'You can test all 7 roles using the "Try Demo Roles" button or the Persona cards on this landing page. You can also log into the Admin Console to use the Time Simulator and fast-forward time to watch SLAs transition live.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="py-2.5">
                <button
                  onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-2 font-semibold text-ink text-sm hover:text-accent transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={14}
                    className={`text-muted transition-transform duration-150 flex-shrink-0 ${
                      faqOpenIndex === idx ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                {faqOpenIndex === idx && (
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Minimal Bottom Call-To-Action ────────────────────── */}
        <section className="content-width py-5">
          <div className="card text-center p-4">
            <h2 className="text-2xl font-semibold text-ink">
              Ready to Experience Zero-Delay Governance?
            </h2>
            <p className="text-sm text-muted mt-1 max-w-lg mx-auto">
              Launch into the live demo portals with pre-loaded mock applications across Maharashtra, Karnataka, and Delhi.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <button
                onClick={() => setRoleModalOpen(true)}
                className="btn-primary text-xs whitespace-nowrap"
              >
                Select Role &amp; Enter Portal
              </button>
              <button
                onClick={() => handleLaunchRole('u1', '/institution')}
                className="btn-secondary text-xs whitespace-nowrap"
              >
                Test Institution Portal
              </button>
              <button
                onClick={() => handleLaunchRole('u2', '/officer')}
                className="btn-secondary text-xs whitespace-nowrap"
              >
                Test Scrutiny Workbench
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-border py-4 bg-white text-xs text-muted">
        <div className="content-width flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-[20px] h-[20px] rounded bg-accent text-white flex items-center justify-center font-bold text-[10px]">
              AP
            </div>
            <span className="font-semibold text-ink">ApprovalPulse</span>
            <span>·</span>
            <span>Smart India Hackathon (SIH) Solution</span>
          </div>

          <div className="flex items-center gap-3 text-muted">
            <span>STQC Benchmark Compliant</span>
            <span>·</span>
            <span>WCAG 2.1 AA</span>
            <span>·</span>
            <span>© 2024 Team ApprovalPulse</span>
          </div>
        </div>
      </footer>

      {/* ── Role Selector Modal ───────────────────────────────── */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-sm">
          <div className="card w-full max-w-md p-3 sm:p-4 space-y-3 shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-border flex-shrink-0">
              <div>
                <h3 className="font-semibold text-ink text-sm sm:text-base">Select Persona for Live Evaluation</h3>
                <p className="text-xs text-muted mt-0.5">Choose a user role to authenticate instantly with pre-populated case files.</p>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="btn-ghost p-1.5 text-muted hover:text-ink -mr-1"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 touch-scroll">
              {MOCK_USERS.map(userItem => {
                const info = ROLE_INFO[userItem.role];
                return (
                  <div
                    key={userItem.id}
                    onClick={() => handleLaunchRole(userItem.id, info.route)}
                    className="card-sm hover:border-accent hover:bg-surface cursor-pointer transition-colors flex items-center justify-between group min-h-[44px]"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-xs sm:text-sm text-ink group-hover:text-accent transition-colors block truncate">
                        {userItem.name}
                      </span>
                      <p className="text-[11px] text-muted mt-0.5 truncate">{info.title}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted border-t border-border flex-shrink-0">
              <span>Demo OTP: <strong className="text-ink">123456</strong></span>
              <button
                onClick={() => {
                  setRoleModalOpen(false);
                  navigate('/login');
                }}
                className="text-accent hover:underline font-semibold"
              >
                Standard sign in page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
