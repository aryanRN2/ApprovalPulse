import { useState } from 'react';
import { PageHeader, StatusBadge, SlaBar } from '../components/ui';
import { MOCK_APPLICATIONS, STAGE_LABELS } from '../lib/data';
import type { Application } from '../lib/data';
import { Search, Filter, ChevronRight, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

export default function OfficerWorkbench() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Officer Workbench"
        subtitle="Scrutiny queue and application review"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Queue panel */}
        <div className="lg:col-span-2 space-y-3">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="search-queue"
                type="text"
                placeholder="Search applications..."
                className="form-input pl-6"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                className="form-select pl-6 pr-2"
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
                className={`w-full text-left card hover:border-accent transition-colors ${selected?.id === app.id ? 'border-accent bg-accent-light' : ''}`}
                onClick={() => setSelected(app)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{app.institutionName}</p>
                    <p className="text-xs text-muted">{app.refNo}</p>
                    <p className="text-xs text-muted">{app.type}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={app.slaStatus === 'breached' ? 'overdue' : 'active'} />
                    <ChevronRight size={14} className="text-muted" />
                  </div>
                </div>
                <div className="mt-1.5">
                  <SlaBar percent={app.slaPercent} status={app.slaStatus} showLabel />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Review panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded text-sm text-muted">
              Select an application from the queue to review.
            </div>
          ) : (
            <div className="card space-y-4">
              {/* App header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base">{selected.institutionName}</h3>
                    <p className="text-xs text-muted">{selected.refNo} · {selected.type} · {STAGE_LABELS[selected.currentStage]}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted mb-1">SLA Progress</p>
                  <SlaBar percent={selected.slaPercent} status={selected.slaStatus} showLabel />
                </div>
              </div>

              <div className="divider" />

              {/* Checklist */}
              <div>
                <h4 className="text-sm mb-2">Scrutiny Checklist</h4>
                <div className="space-y-1.5">
                  {CHECKLIST_ITEMS.map(item => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={!!checklist[item.id]}
                        onChange={() => toggleCheck(item.id)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className={`text-sm ${checklist[item.id] ? 'text-muted line-through' : 'text-ink'}`}>
                        {item.label}
                      </span>
                      {item.required && <span className="text-[10px] text-danger font-semibold">Required</span>}
                    </label>
                  ))}
                </div>
              </div>

              {!allRequired && (
                <div className="flex items-center gap-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-xs text-warning">
                  <AlertTriangle size={12} className="flex-shrink-0" />
                  Complete all required checklist items before forwarding.
                </div>
              )}

              <div className="divider" />

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  id="btn-forward"
                  className="btn-primary"
                  disabled={!allRequired}
                >
                  <ArrowRight size={14} />
                  Forward to EVC
                </button>
                <button
                  id="btn-return"
                  className="btn-secondary"
                  onClick={() => setShowReturnModal(true)}
                >
                  <RotateCcw size={14} />
                  Return for Deficiency
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
