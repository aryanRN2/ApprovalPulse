import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { MOCK_USERS, PENDENCY_DATA } from '../lib/data';
import type { Role } from '../lib/data';
import SculptureHero from '../components/ui/liquid-sculpture-hero';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Scale,
  Sparkles,
  Lock,
  Layers,
  Check,
  X,
  ChevronRight,
  Building2,
  Users2,
  Calendar,
  AlertTriangle,
  Eye,
  Send,
  Zap,
  Sliders,
  ExternalLink,
  MapPin,
  FileCheck2,
} from 'lucide-react';

const ROLE_INFO: Record<Role, { title: string; badge: string; desc: string; route: string; persona: string }> = {
  institution: {
    title: 'Institution Nodal Officer',
    badge: 'Institute',
    persona: 'Dr. Meera Iyer (Sunrise Inst. of Tech)',
    desc: 'Real-time parcel milestone tracking, deficiency rectification, fee receipts, and digital approval orders.',
    route: '/institution',
  },
  scrutiny_officer: {
    title: 'Scrutiny Officer',
    badge: 'Scrutiny',
    persona: 'Rajiv Menon (Senior Scrutinizer)',
    desc: 'Split-screen regulatory audit, 10-point checklist verification, and structured deficiency notices.',
    route: '/officer',
  },
  regional_officer: {
    title: 'Regional Bureau Head',
    badge: 'Regional',
    persona: 'Priya Sharma (Western Region)',
    desc: 'Regional pendency heatmaps, SLA breach escalation monitors, and ageing distribution analysis.',
    route: '/dashboard',
  },
  bureau_head: {
    title: 'National Bureau Head',
    badge: 'HQ',
    persona: 'Anand Kulkarni (New Delhi HQ)',
    desc: 'National oversight across all 33 regions, systemic bottleneck resolution, and policy adjustments.',
    route: '/dashboard',
  },
  evc_member: {
    title: 'EVC Expert Member',
    badge: 'Inspection',
    persona: 'Col. Suresh Nair (Expert Assessor)',
    desc: 'Proximity-aware visit scheduling with clash detection, geo-tagged infrastructure verification.',
    route: '/evc',
  },
  committee_member: {
    title: 'Approval Committee',
    badge: 'Consensus',
    persona: 'Dr. Fatima Sheikh (SAC Chair)',
    desc: 'AI-synthesized case briefs with human-exclusive voting, quorum recording, and final order issuance.',
    route: '/committee',
  },
  admin: {
    title: 'System Administrator',
    badge: 'SysOps',
    persona: 'Admin Console (SecOps)',
    desc: 'SLA threshold configuration, unalterable audit trails, and interactive demo time-simulator.',
    route: '/admin',
  },
};

export default function LandingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Modals & Active States
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'timeline' | 'scrutiny' | 'regional'>('timeline');

  // Live IST Clock
  const [istTime, setIstTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setIstTime(
        d.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Interactive 10-Point Checklist in Scrutiny Preview (AICTE APH 2024-25)
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: 'Clear Land Title & Non-Encumbrance Certificate (5.2 Acres)', compliant: true, category: 'Land & Legal' },
    { id: 2, label: 'Approved Building Plan (12,400 sq.m Built-up Area with FSI Compliance)', compliant: true, category: 'Infrastructure' },
    { id: 3, label: 'Cadre Ratio & Faculty-to-Student Ratio (1:15 Statutory Ratio)', compliant: true, category: 'Academics' },
    { id: 4, label: 'Laboratories & Workshop Heavy Machinery Ingestion Verification', compliant: false, category: 'Equipment' },
    { id: 5, label: 'Fire & Life Safety NOC (Valid through Academic Session 2026)', compliant: true, category: 'Statutory Safety' },
    { id: 6, label: 'Barrier-Free Disabled Access (Lifts, Ramps & Tactile Pathways)', compliant: true, category: 'Inclusivity' },
    { id: 7, label: 'Digital Library & E-Journal Subscription Consortium Access', compliant: true, category: 'Library' },
    { id: 8, label: 'Sewage Treatment Plant (STP) & Green Campus Certification', compliant: false, category: 'Environment' },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklistItems(prev =>
      prev.map(item => (item.id === id ? { ...item, compliant: !item.compliant } : item))
    );
  };

  const compliantCount = checklistItems.filter(c => c.compliant).length;
  const complianceScore = Math.round((compliantCount / checklistItems.length) * 100);

  const handleLaunchRole = (userId: string, targetRoute: string) => {
    login(userId);
    setRoleModalOpen(false);
    navigate(targetRoute);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBE9E5] text-[#151514] font-sans selection:bg-[#151514] selection:text-[#EBE9E5] overflow-x-hidden antialiased">
      
      {/* ── HERO SECTION: 100svh WebGL2 Liquid Particle Sculpture ────────── */}
      <section className="relative w-full h-[100svh] overflow-hidden">
        <SculptureHero
          brand={
            <span className="inline-flex items-center gap-2">
              <span className="w-5.5 h-5.5 rounded-md bg-[#151514] text-white text-[10px] font-bold tracking-tight inline-flex items-center justify-center flex-shrink-0 shadow-xs">
                AP
              </span>
              <span>ApprovalPulse®</span>
            </span>
          }
          brandHref="#top"
          onBrandClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          backdropText="pulse"
          eyebrow="AICTE Accreditation — Est. 2024"
          headline={'Approvals that\nanswers back.'}
          headlineAccent="answers back."
          body="We shape the national accreditation lifecycle with the precision of engineering and the patience of craft — work that holds up under scrutiny."
          background="#EBE9E5"
          darkBackground="#111110"
          textColor="#151514"
          accentColor="#151514"
          theme="light"
          themeToggle={true}
          showCredit={false}
          interactive={true}
          sculptureScale={1.06}
          strength={1.05}
          liquid={1.1}
          turbulence={1.0}
          navLinks={[
            { label: 'Workflow', href: '#workflow', onClick: (e) => { e.preventDefault(); scrollTo('workflow'); } },
            { label: 'Scrutiny', href: '#features', onClick: (e) => { e.preventDefault(); scrollTo('features'); } },
            { label: 'Sandbox', href: '#sandbox', onClick: (e) => { e.preventDefault(); scrollTo('sandbox'); } },
            { label: 'Standards', href: '#standards', onClick: (e) => { e.preventDefault(); scrollTo('standards'); } },
          ]}
          navCta={{
            label: user ? 'Enter Workspace' : 'Demo Roles',
            href: user ? (ROLE_INFO[user.role]?.route ?? '/institution') : '#roles',
            onClick: (e) => {
              e.preventDefault();
              if (user) {
                navigate(ROLE_INFO[user.role]?.route ?? '/institution');
              } else {
                setRoleModalOpen(true);
              }
            },
          }}
          primaryCta={{
            label: 'Launch demo',
            href: '#roles',
            onClick: (e) => {
              e.preventDefault();
              setRoleModalOpen(true);
            },
          }}
          secondaryCta={{
            label: 'Selected work',
            href: '#features',
            onClick: (e) => {
              e.preventDefault();
              scrollTo('features');
            },
          }}
        />
      </section>

      {/* ── TRUST & STATUTORY INDICATORS STRIP ──────────────────────────── */}
      <aside aria-label="Statutory Trust Indicators" className="w-full bg-[#E2DFD8]/60 border-y border-[#151514]/10 py-3.5 px-4 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-3 gap-x-4 text-xs text-[#6F6E69] font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="text-[#151514] font-medium truncate">AICTE APH 2024–25</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="truncate">0% Affiliation Bias</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="truncate">Human Quorum Voting</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="truncate">Immutable Audit Log</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
            <Clock size={14} className="text-emerald-700 flex-shrink-0" />
            <span className="truncate">Level 1 &amp; 2 SLA Escapes</span>
          </div>
        </div>
      </aside>

      {/* ── SECTION 1: SIH CORE ARCHITECTURE PILLARS ────────────────────── */}
      <section id="features" className="py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-14 border-b border-[#151514]/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6F6E69] mb-2 sm:mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-[#151514]/40" />
              SIH Problem Statement Solution Architecture
            </p>
            <h2 className="text-2xl sm:text-5xl font-medium tracking-tight leading-[1.08]">
              Six pillars of <span className="font-editorial italic font-normal text-3xl sm:text-6xl text-[#151514]">zero-opacity governance.</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-base text-[#6F6E69] leading-relaxed">
            Engineered specifically to solve historical administrative bottlenecks across technical campuses, regional bureaus, and approval committees.
          </p>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-14">
          
          {/* Pillar 01: Parcel Milestone Tracker */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>01 / TRACKING PIPELINE</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">INSTITUTIONS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                Parcel Milestone Tracker
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                Visual docket tracking modelled after logistics parcel delivery. Technical institutes track every application milestone in real time: Submitted $\rightarrow$ Scrutiny $\rightarrow$ EVC $\rightarrow$ Hearing $\rightarrow$ Final Gazette Decree.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u1', '/institution')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>Institution View</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">Real-Time State</span>
            </div>
          </article>

          {/* Pillar 02: Split-Screen Scrutiny */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>02 / DOCUMENT AUDIT</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">SCRUTINY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                Split-Screen Scrutiny Workbench
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                Synchronized side-by-side document inspection and compliance audit. Scrutinizers audit 10 statutory conditions (land title, built-up area, FSI, faculty ratio) with standardized return codes and strict SLA clocks.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u2', '/officer')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>Scrutiny Workbench</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">10-Point Audit</span>
            </div>
          </article>

          {/* Pillar 03: EVC Conflict Engine */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>03 / SPATIAL ALLOCATION</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">EVC EXPERTS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                EVC Conflict &amp; Proximity Engine
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                Automated expert visit committee assignment with zero affiliation bias. Algorithmically checks historical employment, alma mater ties, and travel itineraries with mandatory geo-tagged report verification.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u5', '/evc')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>EVC Scheduler</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">Clash Detection</span>
            </div>
          </article>

          {/* Pillar 04: Human-in-the-Loop Consensus */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>04 / STATUTORY CONSENSUS</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">COMMITTEE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                Human-Only Quorum Voting
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                AI synthesizes case dossiers with watermarked disclaimers; statutory human members vote blindly and independently. Once quorum is validated, the digital approval or rejection decree is issued with tamper-proof signatures.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u6', '/committee')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>Hearing Portal</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">Blind Balloting</span>
            </div>
          </article>

          {/* Pillar 05: Pan-India Telemetry */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>05 / REGIONAL OVERSIGHT</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">HQ LEADERSHIP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                Pan-India Pendency &amp; SLA Matrix
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                Cross-tabulated pendency heatmaps and ageing analysis across 33 regions. Tracks SLA velocity, identifies regional bottlenecks, and triggers automatic escalations for cases approaching statutory thresholds.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u3', '/dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>Regional Matrix</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">33 Regions</span>
            </div>
          </article>

          {/* Pillar 06: Demo Time Simulator */}
          <article className="group bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#151514]/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#6F6E69] mb-4 sm:mb-6">
                <span>06 / TIME SIMULATOR</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE9E5] text-[#151514]">SYSTEM ADMIN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 sm:mb-3">
                Interactive Time-Warp Engine
              </h3>
              <p className="text-[#6F6E69] text-xs sm:text-sm leading-relaxed mb-6">
                Built-in demonstration simulator for hackathon evaluators. Fast-forward virtual time by 1 day, 7 days, or 15 days to witness dynamic SLA transitions, automated breach flags, and escalation notification dispatches.
              </p>
            </div>
            <div className="pt-4 sm:pt-6 border-t border-[#151514]/10 flex items-center justify-between">
              <button
                onClick={() => handleLaunchRole('u7', '/admin')}
                className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all cursor-pointer text-[#151514]"
              >
                <span>Launch Time Simulator</span>
                <ArrowRight size={13} />
              </button>
              <span className="text-[11px] font-mono text-[#6F6E69]">Live Sandbox</span>
            </div>
          </article>

        </div>
      </section>

      {/* ── SECTION 2: STATUTORY 4-STAGE PIPELINE WORKFLOW ──────────────── */}
      <section id="workflow" className="py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#151514]/10">
        <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6F6E69] mb-2 sm:mb-3">
            AICTE Regulatory Lifecycle
          </p>
          <h2 className="text-2xl sm:text-5xl font-medium tracking-tight leading-tight">
            The 4-stage unbreachable <span className="font-editorial italic font-normal text-3xl sm:text-6xl text-[#151514]">pipeline.</span>
          </h2>
          <p className="text-[#6F6E69] text-xs sm:text-base mt-3 sm:mt-4">
            How an application moves through statutory milestones with strict countdowns and zero paperwork bottlenecks.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-5 sm:p-6 bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-[#151514] text-[#EBE9E5] text-xs font-mono flex items-center justify-center mb-4 sm:mb-6 font-semibold">
              01
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">Ingestion &amp; Land Audit</h3>
            <p className="text-xs sm:text-sm text-[#6F6E69] leading-relaxed">
              Geometric title verification against state land registries. Validates 30-year lease minimums, municipal NOCs, and non-encumbrance status.
            </p>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#151514]/10 text-[11px] font-mono text-[#6F6E69]">
              Turnaround SLA: 7 Days
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-[#151514] text-[#EBE9E5] text-xs font-mono flex items-center justify-center mb-4 sm:mb-6 font-semibold">
              02
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">Conflict-Free Panel</h3>
            <p className="text-xs sm:text-sm text-[#6F6E69] leading-relaxed">
              Bipartite graph matching algorithm allocates EVC experts outside 100km radius, excluding alumni and former employers automatically.
            </p>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#151514]/10 text-[11px] font-mono text-[#6F6E69]">
              Conflict Check: 100% Automated
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-[#151514] text-[#EBE9E5] text-xs font-mono flex items-center justify-center mb-4 sm:mb-6 font-semibold">
              03
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">Geo-Fenced EVC Audit</h3>
            <p className="text-xs sm:text-sm text-[#6F6E69] leading-relaxed">
              Inspectors conduct on-site appraisal with tamper-evident, GPS-watermarked laboratory videos and safety equipment inventories.
            </p>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#151514]/10 text-[11px] font-mono text-[#6F6E69]">
              Turnaround SLA: 5 Days
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-[#F4F2EE] border border-[#151514]/10 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-[#151514] text-[#EBE9E5] text-xs font-mono flex items-center justify-center mb-4 sm:mb-6 font-semibold">
              04
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">Quorum Human Decree</h3>
            <p className="text-xs sm:text-sm text-[#6F6E69] leading-relaxed">
              Standing Hearing Committee validates quorum, executes blind vote on deficiencies, and issues cryptographic digital approval orders.
            </p>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#151514]/10 text-[11px] font-mono text-[#6F6E69]">
              Decree Output: Digital Gazette
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: LIVE INTERACTIVE SYSTEM SANDBOX ──────────────────── */}
      <section id="sandbox" className="py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#151514]/10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6F6E69] mb-2 sm:mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-[#151514]/40" />
              Interactive Prototype Sandbox
            </p>
            <h2 className="text-2xl sm:text-5xl font-medium tracking-tight leading-[1.05]">
              Experience the engine <span className="font-editorial italic font-normal text-3xl sm:text-6xl text-[#151514]">live.</span>
            </h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-full bg-[#151514] text-[#EBE9E5] text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap size={13} className="text-emerald-400" />
              <span>Select Persona to Enter Portal</span>
            </button>
          </div>
        </header>

        {/* Sandbox Container */}
        <div className="bg-[#F4F2EE] border border-[#151514]/15 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Top Bar with Tab Switchers */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#EBE9E5] border-b border-[#151514]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#151514]/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#151514]/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#151514]/20" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-[#6F6E69] ml-1.5 truncate">approvalpulse.aicte.gov.in · live-prototype</span>
            </div>

            {/* View Switcher Tabs (Scrollable on small mobile) */}
            <div className="inline-flex max-w-full overflow-x-auto no-scrollbar rounded-full border border-[#151514]/15 bg-[#F4F2EE] p-0.5 text-xs touch-pan-x">
              <button
                onClick={() => setActivePreviewTab('timeline')}
                className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activePreviewTab === 'timeline'
                    ? 'bg-[#151514] text-[#EBE9E5]'
                    : 'text-[#6F6E69] hover:text-[#151514]'
                }`}
              >
                <span className="hidden sm:inline">Parcel Milestone Tracker</span>
                <span className="sm:hidden">Milestones</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('scrutiny')}
                className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activePreviewTab === 'scrutiny'
                    ? 'bg-[#151514] text-[#EBE9E5]'
                    : 'text-[#6F6E69] hover:text-[#151514]'
                }`}
              >
                <span className="hidden sm:inline">Split-Screen Scrutiny</span>
                <span className="sm:hidden">Scrutiny</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('regional')}
                className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activePreviewTab === 'regional'
                    ? 'bg-[#151514] text-[#EBE9E5]'
                    : 'text-[#6F6E69] hover:text-[#151514]'
                }`}
              >
                <span className="hidden sm:inline">Regional Pendency Matrix</span>
                <span className="sm:hidden">Regional</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PARCEL MILESTONE TRACKER */}
          {activePreviewTab === 'timeline' && (
            <div className="p-4 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-[#151514]/10 mb-6 sm:mb-8">
                <div>
                  <div className="text-[11px] font-mono text-[#6F6E69]">ACTIVE DOCKET · REF NO: AICTE/MH/2024/NI/0042</div>
                  <h3 className="text-lg sm:text-2xl font-medium mt-1">Sunrise Institute of Technology, Pune</h3>
                  <p className="text-xs text-[#6F6E69] mt-0.5">Application: New Technical Campus (B.Tech Computer Engineering &amp; AI)</p>
                </div>
                <div className="sm:text-right text-left flex sm:block items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>SLA: 72% Elapsed</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#6F6E69] sm:mt-1">Scrutinizer: Rajiv Menon</div>
                </div>
              </div>

              {/* Step Progress Line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3.5 sm:p-4 bg-[#EBE9E5] rounded-xl border border-[#151514]/10">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-emerald-700 font-semibold">STAGE 01</span>
                    <Check size={14} className="text-emerald-700" />
                  </div>
                  <div className="font-medium text-sm">Preliminary Scrutiny</div>
                  <div className="text-[11px] text-[#6F6E69] mt-1">Verified: 05 Sep 2024</div>
                </div>

                <div className="p-3.5 sm:p-4 bg-white rounded-xl border-2 border-[#151514] shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#151514] font-semibold">STAGE 02</span>
                    <span className="w-2 h-2 rounded-full bg-[#151514] animate-ping" />
                  </div>
                  <div className="font-medium text-sm">EVC Expert Visit</div>
                  <div className="text-[11px] text-[#6F6E69] mt-1">Scheduled: 18 Oct 2024</div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#EBE9E5]/60 rounded-xl border border-[#151514]/5 opacity-60">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#6F6E69]">STAGE 03</span>
                    <Clock size={14} className="text-[#6F6E69]" />
                  </div>
                  <div className="font-medium text-sm">Standing Hearing (SHC)</div>
                  <div className="text-[11px] text-[#6F6E69] mt-1">Awaiting Inspection Report</div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#EBE9E5]/60 rounded-xl border border-[#151514]/5 opacity-60">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#6F6E69]">STAGE 04</span>
                    <Lock size={14} className="text-[#6F6E69]" />
                  </div>
                  <div className="font-medium text-sm">Council Order Seal</div>
                  <div className="text-[11px] text-[#6F6E69] mt-1">Final Approval Letter</div>
                </div>
              </div>

              {/* Active Undertakings Warning */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Action Required by Nodal Officer:</span> State Government Land Use NOC evidence must be submitted within 8 working days prior to EVC inspection lock.
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchRole('u1', '/institution')}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1 bg-amber-800 text-white rounded font-medium text-xs whitespace-nowrap hover:bg-amber-900 transition-colors cursor-pointer text-center"
                >
                  Upload Evidence
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SPLIT-SCREEN SCRUTINY CHECKLIST */}
          {activePreviewTab === 'scrutiny' && (
            <div className="p-4 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-[#151514]/10 mb-6 sm:mb-8">
                <div>
                  <div className="text-[11px] font-mono text-[#6F6E69]">SCRUTINY OFFICER AUDIT WORKBENCH</div>
                  <h3 className="text-lg sm:text-2xl font-medium mt-1">Interactive 10-Point Regulatory Checklist</h3>
                  <p className="text-xs text-[#6F6E69] mt-0.5">Toggle statutory conditions below to test dynamic scoring and deficiency notice generation.</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-[11px] font-mono text-[#6F6E69]">COMPLIANCE SCORE</div>
                  <div className={`text-xl sm:text-2xl font-bold ${complianceScore >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {complianceScore}%
                  </div>
                </div>
              </div>

              {/* Checklist Table */}
              <div className="divide-y divide-[#151514]/10 bg-white rounded-xl border border-[#151514]/10 overflow-hidden mb-6">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3 hover:bg-[#F4F2EE] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 sm:mt-0 ${
                        item.compliant
                          ? 'bg-[#151514] border-[#151514] text-white'
                          : 'border-[#151514]/30 text-transparent'
                      }`}>
                        <Check size={13} />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium leading-snug">{item.label}</div>
                        <div className="text-[10px] sm:text-[11px] font-mono text-[#6F6E69] mt-0.5">{item.category}</div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className={`px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        item.compliant
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.compliant ? 'Verified' : 'Deficiency'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs text-[#6F6E69]">
                  {compliantCount} of {checklistItems.length} statutory conditions verified.
                </span>
                <button
                  onClick={() => handleLaunchRole('u2', '/officer')}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#151514] text-[#EBE9E5] text-xs font-medium rounded-lg hover:bg-black transition-colors cursor-pointer text-center"
                >
                  Open Full Scrutiny Workbench →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGIONAL PENDENCY MATRIX */}
          {activePreviewTab === 'regional' && (
            <div className="p-4 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-[#151514]/10 mb-6 sm:mb-8">
                <div>
                  <div className="text-[11px] font-mono text-[#6F6E69]">PAN-INDIA TELEMETRY</div>
                  <h3 className="text-lg sm:text-2xl font-medium mt-1">Regional Bureau Pendency Overview</h3>
                  <p className="text-xs text-[#6F6E69] mt-0.5">Live distribution of active applications across regional headquarters.</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-[11px] font-mono text-[#6F6E69]">ACTIVE APPLICATIONS</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#151514]">1,428 Cases</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {PENDENCY_DATA.map((row) => {
                  const total = row.preliminary_scrutiny + row.evc_queue + row.shc_committee + row.ca_decision;
                  return (
                    <div key={row.region} className="p-4 bg-white rounded-xl border border-[#151514]/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-sm">{row.region}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EBE9E5]">{total} Active</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-[#6F6E69]">
                        <div className="flex justify-between">
                          <span>Scrutiny Stage:</span>
                          <span className="font-mono text-[#151514]">{row.preliminary_scrutiny}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>EVC Expert Queue:</span>
                          <span className="font-mono text-[#151514]">{row.evc_queue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SHC Committee:</span>
                          <span className="font-mono text-[#151514]">{row.shc_committee}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-right">
                <button
                  onClick={() => handleLaunchRole('u4', '/dashboard')}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#151514] text-[#EBE9E5] text-xs font-medium rounded-lg hover:bg-black transition-colors cursor-pointer text-center"
                >
                  Enter National Head Dashboard →
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── SECTION 4: STATUTORY STANDARDS & PHILOSOPHY ─────────────────── */}
      <section id="standards" className="py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#151514]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6F6E69] mb-2 sm:mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-[#151514]/40" />
              The AICTE Standard
            </p>
            <h2 className="text-2xl sm:text-5xl font-medium tracking-tight leading-[1.08] mb-4 sm:mb-6">
              Precision of engineering. <br />
              <span className="font-editorial italic font-normal text-3xl sm:text-6xl text-[#151514]">Patience of governance.</span>
            </h2>
            <p className="text-[#6F6E69] text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
              We reject the premise that institutional or statutory software must be slow, convoluted, or opaque. Unambiguous status feedback and deterministic workflows are fundamental to public accountability.
            </p>
            <div className="p-5 sm:p-6 bg-[#F4F2EE] rounded-xl border border-[#151514]/10">
              <div className="text-xs font-mono text-[#6F6E69] mb-1">NATIONAL SCALE</div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight">14,200+</div>
              <p className="text-xs text-[#6F6E69] mt-1">Technical campuses monitored under unified SLA timeline with zero paper bottlenecks.</p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col divide-y divide-[#151514]/10">
            
            <div className="py-6 sm:py-8 first:pt-0">
              <span className="text-xs font-mono text-[#6F6E69]">01 / PRINCIPLE</span>
              <h3 className="text-lg sm:text-2xl font-medium mt-1 mb-1.5 sm:mb-2">Deterministic over Probabilistic</h3>
              <p className="text-xs sm:text-base text-[#6F6E69] leading-relaxed">
                Administrative governance cannot be governed by black-box algorithms. Every land non-encumbrance check, faculty ratio, and safety certificate follows strict statutory rules that any judge, officer, or citizen can audit.
              </p>
            </div>

            <div className="py-6 sm:py-8">
              <span className="text-xs font-mono text-[#6F6E69]">02 / PRINCIPLE</span>
              <h3 className="text-lg sm:text-2xl font-medium mt-1 mb-1.5 sm:mb-2">Radical Structural Transparency</h3>
              <p className="text-xs sm:text-base text-[#6F6E69] leading-relaxed">
                Borrowing from logistics parcel tracking: An application is never 'in process'. It is at a specific desk, with an assigned officer, against an active SLA countdown timer. If a desk stalls, the system auto-escalates.
              </p>
            </div>

            <div className="py-6 sm:py-8">
              <span className="text-xs font-mono text-[#6F6E69]">03 / PRINCIPLE</span>
              <h3 className="text-lg sm:text-2xl font-medium mt-1 mb-1.5 sm:mb-2">Human-Exclusive Sovereignty</h3>
              <p className="text-xs sm:text-base text-[#6F6E69] leading-relaxed">
                AI and automation ingest documents, flag expired NOCs, and compute architectural ratios. However, sovereign authority to approve, deny, or place on hold belongs exclusively to appointed human committee members.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5: REGULATORY FOOTER ────────────────────────────────── */}
      <footer id="contact" className="py-12 sm:py-24 px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto border-t border-[#151514]/10 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 sm:pb-16 border-b border-[#151514]/10">
          
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 text-lg font-medium tracking-tight mb-2">
              <span className="w-6 h-6 rounded-md bg-[#151514] text-white text-[10px] font-bold tracking-tight inline-flex items-center justify-center flex-shrink-0 shadow-xs">
                AP
              </span>
              <span>ApprovalPulse™</span>
            </div>
            <p className="text-[#6F6E69] leading-relaxed max-w-xs">
              AICTE Technical Institution Approval &amp; Compliance Management System. Designed for the Smart India Hackathon (SIH).
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[11px] font-mono text-[#6F6E69]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
              <span className="truncate">All 33 Regional Portals Operational · {istTime}</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="font-medium text-[#151514] mb-2 sm:mb-3">Architecture</div>
            <div><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }} className="text-[#6F6E69] hover:text-[#151514] transition-colors">Core Features</a></div>
            <div><a href="#workflow" onClick={(e) => { e.preventDefault(); scrollTo('workflow'); }} className="text-[#6F6E69] hover:text-[#151514] transition-colors">4-Stage Pipeline</a></div>
            <div><a href="#standards" onClick={(e) => { e.preventDefault(); scrollTo('standards'); }} className="text-[#6F6E69] hover:text-[#151514] transition-colors">SLA Standards</a></div>
            <div><a href="#sandbox" onClick={(e) => { e.preventDefault(); scrollTo('sandbox'); }} className="text-[#6F6E69] hover:text-[#151514] transition-colors">Live Sandbox</a></div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="font-medium text-[#151514] mb-2 sm:mb-3">Live Role Portals</div>
            <div><button onClick={() => handleLaunchRole('u1', '/institution')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">Institution Nodal Portal</button></div>
            <div><button onClick={() => handleLaunchRole('u2', '/officer')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">Scrutiny Workbench</button></div>
            <div><button onClick={() => handleLaunchRole('u5', '/evc')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">EVC Expert Scheduler</button></div>
            <div><button onClick={() => handleLaunchRole('u6', '/committee')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">Standing Hearing Committee</button></div>
            <div><button onClick={() => handleLaunchRole('u3', '/dashboard')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">Regional &amp; National Head</button></div>
            <div><button onClick={() => handleLaunchRole('u7', '/admin')} className="text-[#6F6E69] hover:text-[#151514] text-left transition-colors">Admin Time Simulator</button></div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="font-medium text-[#151514] mb-2 sm:mb-3">Evaluator Access</div>
            <p className="text-[#6F6E69] leading-relaxed">
              Launch directly into any of the 7 pre-configured evaluator personas or inspect architectural documentation.
            </p>
            <button
              onClick={() => setRoleModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#151514] text-[#EBE9E5] font-medium text-xs hover:bg-black transition-colors"
            >
              <Zap size={12} className="text-emerald-400" />
              <span>Open Role Launcher</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#6F6E69] text-[11px] font-mono">
          <div>
            © 2024–2026 ApprovalPulse. Ministry of Education · All India Council for Technical Education (AICTE).
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-6">
            <span>New Delhi HQ · 33 Regions</span>
            <span className="text-[#6F6E69]/80">APH 2024-25 Compliance Architecture</span>
          </div>
        </div>
      </footer>

      {/* ── MODAL: 7 DEMO ROLE LAUNCHER ─────────────────────────────────── */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#151514]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F4F2EE] border border-[#151514]/20 rounded-2xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto p-4 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#151514]/10 mb-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#6F6E69]">SIH Evaluator Access</p>
                <h3 className="text-xl font-medium">Select a Live Persona</h3>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#151514]/15 flex items-center justify-center text-[#6F6E69] hover:text-[#151514] hover:bg-[#EBE9E5] transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#6F6E69] mb-6 leading-relaxed">
              Select any role below to instantly authenticate into their live workbench with pre-configured dockets, pending checklists, and SLA timers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {MOCK_USERS.map((u) => {
                const info = ROLE_INFO[u.role];
                return (
                  <button
                    key={u.id}
                    onClick={() => handleLaunchRole(u.id, info.route)}
                    className="group p-4 bg-white hover:bg-[#EBE9E5] border border-[#151514]/10 hover:border-[#151514]/30 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4F2EE] text-[#6F6E69]">
                          {info.badge}
                        </span>
                        <ArrowRight size={13} className="text-[#6F6E69] group-hover:translate-x-1 group-hover:text-[#151514] transition-all" />
                      </div>
                      <div className="font-medium text-sm text-[#151514]">{info.title}</div>
                      <div className="text-xs text-[#6F6E69] mt-0.5">{u.name}</div>
                    </div>
                    <div className="text-[11px] text-[#6F6E69] mt-3 line-clamp-2">
                      {info.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#151514]/10 flex items-center justify-between text-xs text-[#6F6E69]">
              <span>Or sign in with custom credentials:</span>
              <button
                onClick={() => { setRoleModalOpen(false); navigate('/login'); }}
                className="font-medium text-[#151514] hover:underline"
              >
                Go to Portal Sign-In →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PROJECT INQUIRY & CONTACT ────────────────────────────── */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#151514]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F4F2EE] border border-[#151514]/20 rounded-2xl w-full max-w-lg max-h-[92dvh] overflow-y-auto p-4 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#151514]/10 mb-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#6F6E69]">Institution Inquiries</p>
                <h3 className="text-xl font-medium">Request Regulatory Dossier</h3>
              </div>
              <button
                onClick={() => { setInquiryModalOpen(false); setInquirySubmitted(false); }}
                className="w-8 h-8 rounded-full border border-[#151514]/15 flex items-center justify-center text-[#6F6E69] hover:text-[#151514] hover:bg-[#EBE9E5] transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h4 className="text-lg font-medium">Dossier Request Dispatched</h4>
                <p className="text-xs text-[#6F6E69] max-w-sm mx-auto leading-relaxed">
                  Your institution affiliation request has been registered in the system docket. The regional bureau will respond within 24 hours.
                </p>
                <button
                  onClick={() => { setInquiryModalOpen(false); setInquirySubmitted(false); }}
                  className="px-5 py-2 bg-[#151514] text-[#EBE9E5] rounded-full text-xs font-medium"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInquirySubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6F6E69] mb-1.5">
                    Nodal Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Verma, Principal / Director"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#151514]/15 focus:outline-none focus:border-[#151514] text-xs text-[#151514]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6F6E69] mb-1.5">
                    Technical Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Institute of Technology, Warangal"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#151514]/15 focus:outline-none focus:border-[#151514] text-xs text-[#151514]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6F6E69] mb-1.5">
                    Official Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="principal@institution.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#151514]/15 focus:outline-none focus:border-[#151514] text-xs text-[#151514]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6F6E69] mb-1.5">
                    Application / Inquiry Category
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#151514]/15 focus:outline-none focus:border-[#151514] text-xs text-[#151514]">
                    <option>Extension of Approval (EoA) 2025–26</option>
                    <option>Establishment of New Technical Campus</option>
                    <option>Increase in Intake / Additional Course Division</option>
                    <option>Introduction of Supernumerary Seats (FN / OCI)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#151514] text-[#EBE9E5] rounded-full font-medium text-xs hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Transmit Docket Request</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
