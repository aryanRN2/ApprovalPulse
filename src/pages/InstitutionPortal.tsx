import { useState } from 'react';
import { PageHeader, StatusBadge, SlaBar, EmptyState } from '../components/ui';
import { MOCK_APPLICATIONS, MOCK_UNDERTAKINGS, MOCK_DOCUMENTS, STAGE_LABELS } from '../lib/data';
import { CheckCircle, Clock, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

const STAGE_ORDER = [
  'preliminary_scrutiny',
  'rescrutiny',
  'evc_queue',
  'evc_scheduled',
  'evc_reported',
  'shc_committee',
  'ca_decision',
  'approved',
];

export default function InstitutionPortal() {
  const app = MOCK_APPLICATIONS[0]; // Institution sees their own application
  const undertakings = MOCK_UNDERTAKINGS.filter(u => u.applicationId === app.id);
  const documents = MOCK_DOCUMENTS;
  const [activeTab, setActiveTab] = useState<'status' | 'undertakings' | 'documents'>('status');

  const currentStageIdx = STAGE_ORDER.indexOf(app.currentStage);

  const tabs = [
    { key: 'status' as const, label: 'Application Status' },
    { key: 'undertakings' as const, label: `Undertakings (${undertakings.length})` },
    { key: 'documents' as const, label: 'Documents' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Institution Portal"
        subtitle={app.institutionName}
      />

      {/* Application summary card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Reference Number</p>
            <p className="text-base font-semibold text-ink">{app.refNo}</p>
            <p className="text-sm text-muted">{app.type} · Region: {app.region}</p>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 pt-2 sm:pt-0 border-t sm:border-0 border-border">
            <StatusBadge status={app.status} />
            <p className="text-xs text-muted">Submitted {app.submittedAt}</p>
          </div>
        </div>

        <div className="divider my-3" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card-sm sm:border-0 sm:p-0 bg-surface/50 sm:bg-transparent">
            <p className="text-xs text-muted">Current Stage</p>
            <p className="text-sm font-semibold mt-0.5">{STAGE_LABELS[app.currentStage]}</p>
          </div>
          <div className="card-sm sm:border-0 sm:p-0 bg-surface/50 sm:bg-transparent">
            <p className="text-xs text-muted">SLA Status</p>
            <div className="mt-1">
              <SlaBar percent={app.slaPercent} status={app.slaStatus} showLabel />
            </div>
          </div>
          <div className="card-sm sm:border-0 sm:p-0 bg-surface/50 sm:bg-transparent">
            <p className="text-xs text-muted">Assigned Officer</p>
            <p className="text-sm font-semibold mt-0.5">{app.assignedOfficer}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-0 overflow-x-auto no-scrollbar touch-scroll">
        {tabs.map(tab => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            className={`px-3 py-2 text-sm border-b-2 whitespace-nowrap transition-colors min-h-[38px] ${
              activeTab === tab.key
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Tab: Parcel Tracker */}
      {activeTab === 'status' && (
        <div className="space-y-3">
          <h3 className="text-base">Application Progress</h3>
          <div className="card">
            <div className="space-y-0">
              {STAGE_ORDER.map((stage, idx) => {
                const isCompleted = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isPending = idx > currentStageIdx;

                return (
                  <div key={stage} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                    <div className="flex flex-col items-center mt-0.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-success' :
                        isCurrent ? 'bg-accent' :
                        'bg-border'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle size={14} className="text-white" />
                        ) : isCurrent ? (
                          <Clock size={14} className="text-white" />
                        ) : (
                          <span className="text-[10px] text-muted">{idx + 1}</span>
                        )}
                      </div>
                      {idx < STAGE_ORDER.length - 1 && (
                        <div className={`w-px flex-1 mt-1 min-h-[16px] ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className={`text-sm font-semibold ${isPending ? 'text-muted' : 'text-ink'}`}>
                        {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-accent mt-0.5 font-semibold">In Progress · Last updated {app.lastMovedAt}</p>
                      )}
                      {isCompleted && (
                        <p className="text-xs text-success mt-0.5">Completed</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {(app.undertakingsDue > 0 || app.docsExpiring > 0) && (
            <div className="card border-amber-200 bg-amber-50">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">Action Required</p>
                  <ul className="text-sm text-muted mt-0.5 space-y-0.5">
                    {app.undertakingsDue > 0 && <li>{app.undertakingsDue} undertaking(s) pending submission</li>}
                    {app.docsExpiring > 0 && <li>{app.docsExpiring} document(s) expiring within 30 days</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Undertakings Tab */}
      {activeTab === 'undertakings' && (
        <div className="space-y-2">
          {undertakings.length === 0 ? (
            <EmptyState message="No undertakings required for this application." />
          ) : (
            undertakings.map(u => (
              <div key={u.id} className="card flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-ink">{u.text}</p>
                  <p className="text-xs text-muted mt-0.5">Due: {u.dueAt} · Evidence: {u.evidenceRequired ? 'Required' : 'Not required'}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                  <StatusBadge status={u.status} />
                  {(u.status === 'open' || u.status === 'overdue') && (
                    <button className="btn-primary text-xs w-full sm:w-auto">Upload Evidence</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-muted flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{doc.docType}</p>
                  <p className="text-xs text-muted truncate">Expires: {doc.expiryDate} · {doc.daysUntilExpiry} days remaining</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                <StatusBadge status={doc.status} />
                {doc.status !== 'valid' && (
                  <button className="btn-primary text-xs">Renew</button>
                )}
                <ChevronRight size={14} className="text-muted hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
