import { useState } from 'react';
import { PageHeader } from '../components/ui';
import { Settings, Clock, AlertTriangle, Database, Play, Pause, RotateCcw } from 'lucide-react';

const WORKFLOW_TEMPLATES = [
  { code: 'NI', name: 'New Institute', stages: 7, version: '2024.2', active: true },
  { code: 'II', name: 'Increase in Intake', stages: 5, version: '2024.2', active: true },
  { code: 'NP', name: 'New Program', stages: 6, version: '2024.1', active: true },
  { code: 'EA', name: 'Extension of Approval', stages: 4, version: '2024.2', active: true },
  { code: 'SC', name: 'Staff Changes', stages: 3, version: '2023.3', active: false },
];

const TIMELINE_CONFIG = [
  { stage: 'Preliminary Scrutiny', standardDays: 15, warningPct: 80, escalationDays: 5 },
  { stage: 'Re-Scrutiny', standardDays: 10, warningPct: 80, escalationDays: 3 },
  { stage: 'EVC Queue → Schedule', standardDays: 10, warningPct: 80, escalationDays: 5 },
  { stage: 'EVC Visit → Report', standardDays: 5, warningPct: 80, escalationDays: 2 },
  { stage: 'Committee Decision', standardDays: 20, warningPct: 80, escalationDays: 7 },
];

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'timelines' | 'simulator'>('workflow');
  const [simDays, setSimDays] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  const advanceDays = (days: number) => {
    setSimDays(prev => {
      const next = prev + days;
      const newLogs: string[] = [];
      if (next >= 12) newLogs.push(`[Day ${next}] ⚠ SLA Warning: AICTE/KA/2024/II/0189 at 91% — Alert sent to officer.`);
      if (next >= 15) newLogs.push(`[Day ${next}] 🔴 SLA Breach: AICTE/TN/2024/NP/0097 — Escalation Level 1 triggered.`);
      if (next >= 20) newLogs.push(`[Day ${next}] 🔴 Escalation Level 2: AICTE/TN/2024/NP/0097 — Regional Head notified.`);
      if (next >= 7) newLogs.push(`[Day ${next}] 📄 Document Expiry Warning: Fire Safety Certificate expires in ${Math.max(0, 10 - (next - 7))} days.`);
      setSimLog(prev => [...newLogs, ...prev].slice(0, 20));
      return next;
    });
  };

  const resetSim = () => {
    setSimDays(0);
    setSimLog([]);
    setSimRunning(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Admin Console"
        subtitle="Workflow configuration, rules management, and demo simulator"
      />

      {/* Tabs */}
      <div className="border-b border-border flex gap-0 overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap">
        {[
          { key: 'workflow' as const, label: 'Workflow Templates', icon: <Database size={14} /> },
          { key: 'timelines' as const, label: 'SLA Timelines', icon: <Clock size={14} /> },
          { key: 'simulator' as const, label: 'Demo Time Simulator', icon: <Play size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            id={`admin-tab-${tab.key}`}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 whitespace-nowrap transition-colors min-h-[38px] ${
              activeTab === tab.key
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Workflow Templates */}
      {activeTab === 'workflow' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-muted">Versioned workflow templates. Changes require a new version — active cases stay on their pinned version.</p>
            <button className="btn-primary text-xs w-full sm:w-auto whitespace-nowrap">+ New Template</button>
          </div>
          <div className="card overflow-x-auto touch-scroll">
            <table className="table-base min-w-[550px]">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Template Name</th>
                  <th>Stages</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {WORKFLOW_TEMPLATES.map(t => (
                  <tr key={t.code}>
                    <td className="font-mono font-semibold">{t.code}</td>
                    <td className="font-semibold">{t.name}</td>
                    <td>{t.stages}</td>
                    <td className="text-muted">{t.version}</td>
                    <td>
                      <span className={t.active ? 'badge-green' : 'badge-gray'}>
                        {t.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn-secondary text-xs">Edit</button>
                        <button className="btn-ghost text-xs">View JSON</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={14} className="text-muted" />
              <h4 className="text-sm">Alert Rules</h4>
            </div>
            <div className="space-y-1.5">
              {[
                { rule: 'SLA Warning Alert', trigger: 'Clock reaches warning threshold (80%)', channels: 'In-App, Email', dedupe: '24h' },
                { rule: 'SLA Breach Alert', trigger: 'Clock exceeds 100% limit', channels: 'In-App, Email, SMS', dedupe: '1h' },
                { rule: 'Document Expiry Alert', trigger: '90/60/30/15/7 days before expiry', channels: 'In-App, Email', dedupe: 'Per threshold' },
                { rule: 'Undertaking Overdue', trigger: 'Undertaking due date passed', channels: 'In-App, SMS', dedupe: '24h' },
              ].map(r => (
                <div key={r.rule} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-2 border-t border-border first:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{r.rule}</p>
                    <p className="text-xs text-muted">{r.trigger}</p>
                    <p className="text-xs text-muted mt-0.5">Channels: {r.channels} · Dedupe: {r.dedupe}</p>
                  </div>
                  <button className="btn-secondary text-xs flex-shrink-0 self-start sm:self-auto">Edit Rule</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SLA Timelines */}
      {activeTab === 'timelines' && (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-muted">Configure standard working-day limits, warning thresholds, and escalation offsets per stage.</p>
          <div className="card overflow-x-auto touch-scroll">
            <table className="table-base min-w-[500px]">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Standard Days</th>
                  <th>Warning at</th>
                  <th>Escalation Offset</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {TIMELINE_CONFIG.map(t => (
                  <tr key={t.stage}>
                    <td className="font-semibold">{t.stage}</td>
                    <td>
                      <input
                        type="number"
                        className="form-input w-16 text-center"
                        defaultValue={t.standardDays}
                      />
                    </td>
                    <td className="text-muted">{t.warningPct}%</td>
                    <td className="text-muted">+{t.escalationDays} days</td>
                    <td>
                      <button className="btn-primary text-xs">Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card bg-surface">
            <h4 className="text-sm mb-2">Escalation Policy</h4>
            <div className="space-y-1">
              {[
                { level: 'Level 0', offset: '80% SLA', target: 'Assigned Officer', response: false },
                { level: 'Level 1', offset: '100% SLA (Breach)', target: 'Officer + Regional Officer', response: false },
                { level: 'Level 2', offset: '+5 working days', target: 'Regional Head', response: true },
                { level: 'Level 3', offset: '+10 working days', target: 'National Bureau Officer', response: true },
                { level: 'Level 4', offset: 'Prolonged inaction', target: 'Competent Authority', response: true },
              ].map(e => (
                <div key={e.level} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border last:border-0 text-sm gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm">{e.level}</span>
                    <span className="text-xs text-muted">({e.offset})</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 flex-1">
                    <span className="text-xs text-ink">{e.target}</span>
                    <span className={`badge ${e.response ? 'badge-amber' : 'badge-gray'} text-[11px]`}>
                      {e.response ? 'Response Required' : 'Alert Only'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demo Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-3 max-w-2xl">
          <div className="card border-amber-200 bg-amber-50">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-ink">DEMO_MODE Active</p>
                <p className="text-xs text-muted">
                  This simulator advances the virtual system clock for demo purposes only.
                  No actual AICTE records are affected. Deadline triggers and escalations
                  will fire in real-time as virtual days advance.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base">Virtual Clock</h3>
                <p className="text-sm text-muted">Base: 21 October 2024</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-ink">+{simDays} days</p>
                <p className="text-xs text-muted">{new Date(new Date('2024-10-21').getTime() + simDays * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {[1, 5, 10, 15, 20].map(d => (
                <button
                  key={d}
                  id={`sim-advance-${d}`}
                  className="btn-secondary"
                  onClick={() => advanceDays(d)}
                >
                  +{d} {d === 1 ? 'day' : 'days'}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                id="btn-sim-toggle"
                className={simRunning ? 'btn-secondary' : 'btn-primary'}
                onClick={() => setSimRunning(v => !v)}
              >
                {simRunning ? <><Pause size={14} /> Pause Auto</> : <><Play size={14} /> Auto Advance</>}
              </button>
              <button
                id="btn-sim-reset"
                className="btn-ghost"
                onClick={resetSim}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Event log */}
          <div className="card">
            <h4 className="text-sm mb-2">Event Log</h4>
            {simLog.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">Advance the clock to see SLA events trigger in real-time.</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto font-mono text-xs">
                {simLog.map((log, i) => (
                  <div key={i} className={`py-1 px-1.5 rounded ${
                    log.includes('🔴') ? 'bg-red-50 text-danger' :
                    log.includes('⚠') ? 'bg-amber-50 text-warning' :
                    'bg-surface text-muted'
                  }`}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
