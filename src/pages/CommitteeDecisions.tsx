import { useState } from 'react';
import { PageHeader, StatusBadge } from '../components/ui';
import { MOCK_APPLICATIONS } from '../lib/data';
import { CheckCircle, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

const AGENDA_ITEMS = MOCK_APPLICATIONS.filter(a => ['shc_committee', 'ca_decision'].includes(a.currentStage));

type DecisionOutcome = 'approved' | 'rejected' | 'conditional';

interface Decision {
  applicationId: string;
  outcome: DecisionOutcome;
  remarks: string;
}

export default function CommitteeDecisions() {
  const [selected, setSelected] = useState(AGENDA_ITEMS[0] || null);
  const [mobileView, setMobileView] = useState<'agenda' | 'case'>('agenda');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [outcome, setOutcome] = useState<DecisionOutcome | ''>('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDecision = () => {
    if (!selected || !outcome || !remarks) return;
    setDecisions(prev => ({
      ...prev,
      [selected.id]: { applicationId: selected.id, outcome: outcome as DecisionOutcome, remarks },
    }));
    setSubmitted(true);
  };

  const handleSelectAgenda = (app: typeof AGENDA_ITEMS[0]) => {
    setSelected(app);
    setSubmitted(false);
    setOutcome('');
    setRemarks('');
    setMobileView('case');
  };

  const existingDecision = selected ? decisions[selected.id] : null;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Committee & Decisions"
        subtitle="Standing Hearing Committee / Appellate Committee"
      />

      {/* Mobile back button when viewing case on small screen */}
      {selected && mobileView === 'case' && (
        <div className="lg:hidden flex items-center justify-between pb-1">
          <button
            onClick={() => setMobileView('agenda')}
            className="btn-secondary text-xs flex items-center gap-1.5 min-h-[36px]"
          >
            <ArrowLeft size={14} />
            <span>Back to Agenda ({AGENDA_ITEMS.length})</span>
          </button>
          <span className="text-xs text-muted font-mono">{selected.refNo}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Agenda list */}
        <div className={`space-y-2 lg:col-span-2 ${selected && mobileView === 'case' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-semibold">Meeting Agenda</h3>
            <span className="badge-gray">{AGENDA_ITEMS.length} items</span>
          </div>

          {AGENDA_ITEMS.map((app, idx) => {
            const dec = decisions[app.id];
            return (
              <button
                key={app.id}
                id={`agenda-item-${app.id}`}
                className={`w-full text-left card hover:border-accent transition-colors active:bg-surface ${selected?.id === app.id ? 'border-accent bg-accent-light' : ''}`}
                onClick={() => handleSelectAgenda(app)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-muted w-4 font-semibold flex-shrink-0">{idx + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink leading-tight truncate">{app.institutionName}</p>
                      <p className="text-xs text-muted truncate">{app.type}</p>
                    </div>
                  </div>
                  {dec ? (
                    <span className={`badge flex-shrink-0 ${dec.outcome === 'approved' ? 'badge-green' : dec.outcome === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                      {dec.outcome}
                    </span>
                  ) : (
                    <span className="badge-gray flex-shrink-0">Pending</span>
                  )}
                </div>
              </button>
            );
          })}

          {AGENDA_ITEMS.length === 0 && (
            <div className="text-sm text-muted text-center py-8 border border-dashed border-border rounded">
              No items scheduled for today&apos;s committee.
            </div>
          )}
        </div>

        {/* Case detail & decision */}
        <div className={`lg:col-span-3 ${selected && mobileView === 'agenda' ? 'hidden lg:block' : 'block'}`}>
          {!selected ? (
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded text-sm text-muted">
              Select an agenda item to view details.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Case summary */}
              <div className="card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base truncate">{selected.institutionName}</h3>
                    <p className="text-xs text-muted mt-0.5">{selected.refNo} · {selected.type}</p>
                  </div>
                  <div className="flex sm:justify-end">
                    <StatusBadge status={selected.currentStage === 'shc_committee' ? 'active' : 'active'} />
                  </div>
                </div>

                <div className="bg-surface border border-border rounded p-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <FileText size={13} className="text-muted" />
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">AI-Assisted Draft Summary</span>
                    <span className="badge-amber text-[10px]">Suggested — Human Review</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    The institution has applied for a {selected.type.toLowerCase()} in {selected.region}. EVC report indicates infrastructure compliance is satisfactory. Faculty
                    recruitment undertaking has been submitted but is pending verification. Financial solvency documents are in order. Two minor deficiencies were noted in
                    the preliminary scrutiny stage and subsequently resolved upon re-submission.
                  </p>
                  <p className="text-[11px] text-muted italic mt-1.5 pt-1 border-t border-border">
                    ⚠ Draft generated from application records. Verify all details before recording decision.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'EVC Outcome', value: 'Satisfactory' },
                    { label: 'Undertakings', value: `${selected.undertakingsDue} Pending` },
                    { label: 'Region', value: selected.region },
                  ].map(item => (
                    <div key={item.label} className="card-sm bg-surface">
                      <p className="text-xs text-muted">{item.label}</p>
                      <p className="text-sm font-semibold text-ink mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision form */}
              {existingDecision ? (
                <div className="card border-green-200 bg-green-50">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Decision Recorded</p>
                      <p className="text-xs text-muted capitalize mt-0.5">Outcome: {existingDecision.outcome} · {existingDecision.remarks}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card space-y-3">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={15} className="text-accent flex-shrink-0" />
                    <h4 className="text-sm font-semibold">Record Committee Decision</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    This decision is irreversible once recorded and will be logged in the tamper-evident audit trail.
                    Only authorised committee members may record decisions.
                  </p>

                  <div>
                    <label className="form-label" htmlFor="decision-outcome">Outcome *</label>
                    <select
                      id="decision-outcome"
                      className="form-select"
                      value={outcome}
                      onChange={e => setOutcome(e.target.value as DecisionOutcome | '')}
                    >
                      <option value="">Select outcome</option>
                      <option value="approved">Approved</option>
                      <option value="conditional">Conditional Approval</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="decision-remarks">Remarks *</label>
                    <textarea
                      id="decision-remarks"
                      className="form-input resize-none h-20"
                      placeholder="Enter committee's reasoning and any conditions..."
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>

                  <button
                    id="btn-record-decision"
                    className="btn-primary w-full sm:w-auto"
                    disabled={!outcome || !remarks}
                    onClick={handleDecision}
                  >
                    Record Decision
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
