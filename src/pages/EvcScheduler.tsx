import { useState } from 'react';
import { PageHeader, StatusBadge } from '../components/ui';
import { MOCK_EVC_CASES } from '../lib/data';
import { Calendar, Clock, Users, CheckSquare, AlertTriangle } from 'lucide-react';

const MONTHS = ['October 2024'];
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simple October 2024 calendar grid
const OCT_2024_DAYS = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, null, null, null],
];

const BOOKED_DAYS: Record<number, string> = {
  18: 'Sunrise Institute of Technology (Confirmed)',
  22: 'Karnataka College of Engineering (Proposed)',
};

const EXPERT_MEMBERS = [
  { id: 'm1', name: 'Col. Suresh Nair', expertise: 'Infrastructure & Safety', available: true },
  { id: 'm2', name: 'Dr. Meena Joshi', expertise: 'Academic Programs', available: true },
  { id: 'm3', name: 'Prof. Ramesh Iyer', expertise: 'Faculty & Research', available: false },
  { id: 'm4', name: 'Dr. Kavita Desai', expertise: 'Finance & Governance', available: true },
];

export default function EvcScheduler() {
  const [selectedDay, setSelectedDay] = useState<number | null>(18);
  const [selectedCase, setSelectedCase] = useState(MOCK_EVC_CASES[0]);
  const [assignedMembers, setAssignedMembers] = useState<string[]>(['m1', 'm2']);
  const [activeTab, setActiveTab] = useState<'calendar' | 'queue' | 'reports'>('calendar');

  const toggleMember = (id: string) => {
    setAssignedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const clashDetected = selectedDay !== null && BOOKED_DAYS[selectedDay] && assignedMembers.includes('m1');

  return (
    <div className="space-y-4">
      <PageHeader
        title="EVC Scheduler"
        subtitle="Expert Visit Committee scheduling and management"
      />

      {/* Tabs */}
      <div className="border-b border-border flex gap-0 overflow-x-auto no-scrollbar touch-scroll">
        {[
          { key: 'calendar' as const, label: 'Calendar' },
          { key: 'queue' as const, label: `Queue (${MOCK_EVC_CASES.filter(c => c.status === 'queued').length})` },
          { key: 'reports' as const, label: 'Reports' },
        ].map(tab => (
          <button
            key={tab.key}
            id={`evc-tab-${tab.key}`}
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

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base">{MONTHS[0]}</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-accent rounded-sm inline-block" /> Confirmed</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded-sm inline-block" /> Proposed</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px">
              {WEEK_DAYS.map(d => (
                <div key={d} className="text-[11px] text-muted text-center py-1 font-semibold">{d}</div>
              ))}
              {OCT_2024_DAYS.map((week, wi) =>
                week.map((day, di) => {
                  const hasEvent = day !== null && BOOKED_DAYS[day];
                  const isConfirmed = day === 18;
                  const isProposed = day === 22;
                  const isSelected = day === selectedDay;
                  const isToday = day === 21;

                  return (
                    <button
                      key={`${wi}-${di}`}
                      id={day ? `cal-day-${day}` : undefined}
                      disabled={!day}
                      onClick={() => day && setSelectedDay(day)}
                      className={`
                        aspect-square flex flex-col items-center justify-start pt-1 text-sm rounded transition-colors
                        ${!day ? 'invisible' : ''}
                        ${isSelected ? 'bg-accent text-white' : ''}
                        ${isToday && !isSelected ? 'font-semibold text-accent border border-accent' : ''}
                        ${!isSelected && !isToday ? 'hover:bg-surface' : ''}
                      `}
                    >
                      {day && (
                        <>
                          <span className="text-xs">{day}</span>
                          {hasEvent && (
                            <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                              isConfirmed ? 'bg-accent' :
                              isProposed ? 'bg-amber-400' : 'bg-muted'
                            } ${isSelected ? 'bg-white' : ''}`} />
                          )}
                        </>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {selectedDay && BOOKED_DAYS[selectedDay] && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Events on Oct {selectedDay}</p>
                <div className="card-sm bg-accent-light border-blue-200">
                  <p className="text-sm text-ink">{BOOKED_DAYS[selectedDay]}</p>
                </div>
              </div>
            )}
          </div>

          {/* Scheduling panel */}
          <div className="space-y-3">
            {/* Case selector */}
            <div className="card">
              <h4 className="text-sm mb-2">Schedule Visit</h4>
              <div>
                <label className="form-label" htmlFor="evc-case-select">Application</label>
                <select
                  id="evc-case-select"
                  className="form-select"
                  value={selectedCase.id}
                  onChange={e => {
                    const c = MOCK_EVC_CASES.find(x => x.id === e.target.value);
                    if (c) setSelectedCase(c);
                  }}
                >
                  {MOCK_EVC_CASES.map(c => (
                    <option key={c.id} value={c.id}>{c.institutionName}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <label className="form-label" htmlFor="evc-date-select">Visit Date</label>
                <input
                  id="evc-date-select"
                  type="date"
                  className="form-input"
                  defaultValue="2024-10-18"
                />
              </div>
              <StatusBadge status={selectedCase.status} />
            </div>

            {/* Member assignment */}
            <div className="card">
              <div className="flex items-center gap-1 mb-2">
                <Users size={14} className="text-muted" />
                <h4 className="text-sm">Assign Members</h4>
              </div>
              <div className="space-y-1.5">
                {EXPERT_MEMBERS.map(m => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`member-${m.id}`}
                      checked={assignedMembers.includes(m.id)}
                      disabled={!m.available}
                      onChange={() => toggleMember(m.id)}
                      className="accent-accent"
                    />
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${!m.available ? 'text-muted' : 'text-ink'}`}>{m.name}</p>
                      <p className="text-[11px] text-muted">{m.expertise}</p>
                    </div>
                    {!m.available && <span className="badge-gray text-[10px]">Unavailable</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Clash warning */}
            {clashDetected && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning">
                  Col. Suresh Nair is already assigned on this date. Clash detected.
                </p>
              </div>
            )}

            <button
              id="btn-confirm-schedule"
              className="btn-primary w-full justify-center"
              disabled={!!clashDetected || assignedMembers.length === 0}
            >
              <Calendar size={14} />
              Confirm Schedule
            </button>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="space-y-2">
          {MOCK_EVC_CASES.map(c => (
            <div key={c.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{c.institutionName}</p>
                <p className="text-xs text-muted truncate">{c.region} · App: {c.applicationId}</p>
                {c.confirmedDate && <p className="text-xs text-muted mt-0.5">Visit: {c.confirmedDate}</p>}
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                <StatusBadge status={c.status} />
                {c.status === 'queued' && (
                  <button className="btn-primary text-xs w-full sm:w-auto" onClick={() => setActiveTab('calendar')}>
                    Schedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-2">
          {MOCK_EVC_CASES.filter(c => c.status === 'reported').map(c => (
            <div key={c.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare size={16} className="text-success flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{c.institutionName}</p>
                  <p className="text-xs text-muted truncate">Visit: {c.confirmedDate} · Members: {c.members.join(', ')}</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-0 border-t sm:border-0 border-border flex justify-end">
                <button className="btn-secondary text-xs w-full sm:w-auto">View Report</button>
              </div>
            </div>
          ))}
          {MOCK_EVC_CASES.filter(c => c.status === 'conducted').map(c => (
            <div key={c.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-amber-200">
              <div className="flex items-center gap-2 min-w-0">
                <Clock size={16} className="text-warning flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{c.institutionName}</p>
                  <p className="text-xs text-warning">Report pending upload</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-0 border-t sm:border-0 border-border flex justify-end">
                <button className="btn-primary text-xs w-full sm:w-auto">Upload Report</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
