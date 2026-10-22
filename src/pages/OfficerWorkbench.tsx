import { useState } from 'react';
import { PageHeader, StatusBadge, SlaBar } from '../components/ui';
import { MOCK_APPLICATIONS, STAGE_LABELS } from '../lib/data';
import type { Application } from '../lib/data';
import { Search, Filter, ChevronRight, ArrowRight, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';

export default function OfficerWorkbench() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [mobileView, setMobileView] = useState<'queue' | 'review'>('queue');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnRemarks, setReturnRemarks] = useState('');

  const queue = MOCK_APPLICATIONS.filter(a =>
    a.status === 'active' &&
    a.assignedOfficer === 'Rajiv Menon' &&
    (search === '' || a.institutionName.toLowerCase().includes(search.toLowerCase()) || a.refNo.includes(search)) &&
    (stageFilter === '' || a.currentStage === stageFilter)
  );

  const DEFICIENCY_REASONS = [
    'Incomplete land documents',
    'Faculty qualification discrepancy',
    'Infrastructure compliance gap',
    'Financial solvency certificate missing',
    'NOC from State Government not attached',
    'Other',
  ];

  const CHECKLIST_ITEMS = [
    { id: 'cl1', label: 'Land availability certificate verified', required: true },
    { id: 'cl2', label: 'Faculty list matches AICTE norms', required: true },
    { id: 'cl3', label: 'Infrastructure plan reviewed', required: true },
    { id: 'cl4', label: 'Financial projections assessed', required: true },
    { id: 'cl5', label: 'Affiliation letter from University attached', required: true },
    { id: 'cl6', label: 'Application fee payment confirmed', required: false },
  ];

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allRequired = CHECKLIST_ITEMS.filter(i => i.required).every(i => checklist[i.id]);

  const handleSelectApp = (app: Application) => {
    setSelected(app);
    setMobileView('review');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Officer Workbench"
        subtitle="Scrutiny queue and application review"
      />

      {/* Mobile view indicator when reviewing on small screens */}
      {selected && mobileView === 'review' && (
        <div className="lg:hidden flex items-center justify-between pb-1">
          <button
            onClick={() => setMobileView('queue')}
            className="btn-secondary text-xs flex items-center gap-1.5 min-h-[36px]"
          >
            <ArrowLeft size={14} />
            <span>Back to Queue ({queue.length})</span>
          </button>
          <span className="text-xs text-muted font-mono">{selected.refNo}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Queue panel */}
        <div className={`space-y-3 lg:col-span-2 ${selected && mobileView === 'review' ? 'hidden lg:block' : 'block'}`}>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="search-queue"
                type="text"
                placeholder="Search applications..."
                className="form-input pl-7"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                className="form-select pl-7 pr-3 w-full sm:w-auto"
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
              >
                <option value="">All stages</option>
                <option value="preliminary_scrutiny">Preliminary Scrutiny</option>
                <option value="rescrutiny">Re-Scrutiny</option>
              </select>
            </div>
          </div>

          {/* Queue items */}
          <div className="space-y-1.5">
            {queue.length === 0 && (
              <div className="text-sm text-muted text-center py-8 border border-dashed border-border rounded">
                No applications match the filter.
              </div>
            )}
            {queue.map(app => (
              <button
                key={app.id}
                id={`queue-item-${app.id}`}
                className={`w-full text-left card hover:border-accent transition-colors active:bg-surface ${selected?.id === app.id ? 'border-accent bg-accent-light' : ''}`}
                onClick={() => handleSelectApp(app)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{app.institutionName}</p>
                    <p className="text-xs text-muted truncate">{app.refNo}</p>
                    <p className="text-xs text-muted truncate">{app.type}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={app.slaStatus === 'breached' ? 'overdue' : 'active'} />
                    <ChevronRight size={14} className="text-muted" />
                  </div>
                </div>
                <div className="mt-2">
                  <SlaBar percent={app.slaPercent} status={app.slaStatus} showLabel />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Review panel */}
        <div className={`lg:col-span-3 ${selected && mobileView === 'queue' ? 'hidden lg:block' : 'block'}`}>
          {!selected ? (
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded text-sm text-muted">
              Select an application from the queue to review.
            </div>
          ) : (
            <div className="card space-y-4">
              {/* App header */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base truncate">{selected.institutionName}</h3>
                    <p className="text-xs text-muted mt-0.5">{selected.refNo} · {selected.type} · {STAGE_LABELS[selected.currentStage]}</p>
                  </div>
                  <div className="flex sm:justify-end">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
                <div className="mt-2.5">
                  <p className="text-xs text-muted mb-1">SLA Progress</p>
                  <SlaBar percent={selected.slaPercent} status={selected.slaStatus} showLabel />
                </div>
              </div>

              <div className="divider" />

              {/* Checklist */}
              <div>
                <h4 className="text-sm mb-2 font-semibold">Scrutiny Checklist</h4>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.map(item => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 cursor-pointer group p-1 rounded hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={!!checklist[item.id]}
                        onChange={() => toggleCheck(item.id)}
                        className="w-4 h-4 mt-0.5 accent-accent flex-shrink-0"
                      />
                      <span className={`text-xs sm:text-sm flex-1 ${checklist[item.id] ? 'text-muted line-through' : 'text-ink'}`}>
                        {item.label}
                      </span>
                      {item.required && <span className="text-[10px] text-danger font-semibold flex-shrink-0">Required</span>}
                    </label>
                  ))}
                </div>
              </div>

              {!allRequired && (
                <div className="flex items-center gap-2 px-2.5 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-warning">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>Complete all required checklist items before forwarding.</span>
                </div>
              )}

              <div className="divider" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  id="btn-forward"
                  className="btn-primary w-full sm:w-auto"
                  disabled={!allRequired}
                >
                  <ArrowRight size={14} />
                  <span>Forward to EVC</span>
                </button>
                <button
                  id="btn-return"
                  className="btn-secondary w-full sm:w-auto"
                  onClick={() => setShowReturnModal(true)}
                >
                  <RotateCcw size={14} />
                  <span>Return for Deficiency</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-border rounded w-full max-w-md">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-base">Return for Deficiency</h3>
              <button className="btn-ghost p-0.5" onClick={() => setShowReturnModal(false)}>✕</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="form-label" htmlFor="deficiency-reason">Deficiency Reason *</label>
                <select
                  id="deficiency-reason"
                  className="form-select"
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                >
                  <option value="">Select reason code</option>
                  {DEFICIENCY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="deficiency-remarks">Remarks *</label>
                <textarea
                  id="deficiency-remarks"
                  className="form-input resize-none h-24"
                  placeholder="Provide specific details about the deficiency..."
                  value={returnRemarks}
                  onChange={e => setReturnRemarks(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted">
                Note: Returning this application will pause the AICTE SLA clock until the institution resubmits.
              </p>
            </div>
            <div className="px-4 py-3 border-t border-border flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button
                id="btn-confirm-return"
                className="btn-danger"
                disabled={!returnReason || !returnRemarks}
                onClick={() => setShowReturnModal(false)}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
