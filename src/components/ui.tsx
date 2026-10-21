import clsx from 'clsx';

interface SlaBarProps {
  percent: number;
  status: 'ok' | 'warning' | 'breached';
  showLabel?: boolean;
}

export function SlaBar({ percent, status, showLabel = true }: SlaBarProps) {
  const fillColor = {
    ok: 'bg-success',
    warning: 'bg-warning',
    breached: 'bg-danger',
  }[status];

  const displayPct = Math.min(percent, 100);

  return (
    <div className="flex items-center gap-2">
      <div className="sla-bar flex-1">
        <div
          className={clsx('sla-fill', fillColor)}
          style={{ width: `${displayPct}%` }}
        />
      </div>
      {showLabel && (
        <span className={clsx('text-xs font-semibold tabular-nums w-10 text-right', {
          'text-success': status === 'ok',
          'text-warning': status === 'warning',
          'text-danger': status === 'breached',
        })}>
          {percent}%
        </span>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'badge-blue' },
  approved: { label: 'Approved', cls: 'badge-green' },
  rejected: { label: 'Rejected', cls: 'badge-red' },
  returned: { label: 'Returned', cls: 'badge-amber' },
  on_hold: { label: 'On Hold', cls: 'badge-gray' },
  open: { label: 'Open', cls: 'badge-blue' },
  submitted: { label: 'Submitted', cls: 'badge-amber' },
  under_verification: { label: 'Under Verification', cls: 'badge-amber' },
  accepted: { label: 'Accepted', cls: 'badge-green' },
  overdue: { label: 'Overdue', cls: 'badge-red' },
  queued: { label: 'Queued', cls: 'badge-gray' },
  scheduled: { label: 'Scheduled', cls: 'badge-blue' },
  conducted: { label: 'Conducted', cls: 'badge-amber' },
  reported: { label: 'Reported', cls: 'badge-green' },
  valid: { label: 'Valid', cls: 'badge-green' },
  expiring_soon: { label: 'Expiring Soon', cls: 'badge-amber' },
  expired: { label: 'Expired', cls: 'badge-red' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const map = STATUS_MAP[status] ?? { label: status, cls: 'badge-gray' };
  return <span className={map.cls}>{map.label}</span>;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted border border-border rounded border-dashed">
      {message}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );
}
