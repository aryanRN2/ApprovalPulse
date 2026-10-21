import { useState } from 'react';
import { PageHeader, StatusBadge, SlaBar } from '../components/ui';
import { MOCK_APPLICATIONS, PENDENCY_DATA, REGIONS, STAGE_LABELS } from '../lib/data';
import type { StageKey } from '../lib/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

const STAGE_COLS: StageKey[] = ['preliminary_scrutiny', 'evc_queue', 'shc_committee', 'ca_decision'];
const STAGE_COLORS = ['#1D4ED8', '#7C3AED', '#D97706', '#DC2626'];

const AGEING_DATA = [
  { bucket: '0–5 days', count: 18 },
  { bucket: '6–10 days', count: 12 },
  { bucket: '11–15 days', count: 7 },
  { bucket: '16–20 days', count: 4 },
  { bucket: '21+ days', count: 3 },
];

export default function RegionalDashboard() {
  const [regionFilter, setRegionFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'ageing'>('overview');

  const apps = MOCK_APPLICATIONS.filter(a =>
    regionFilter === '' || a.region === regionFilter
  );

  const stats = {
    total: MOCK_APPLICATIONS.length,
    active: MOCK_APPLICATIONS.filter(a => a.status === 'active').length,
    breached: MOCK_APPLICATIONS.filter(a => a.slaStatus === 'breached').length,
    approved: MOCK_APPLICATIONS.filter(a => a.status === 'approved').length,
  };

  const pendencyChartData = PENDENCY_DATA.map(row => ({
    ...row,
    region: row.region.length > 8 ? row.region.slice(0, 8) + '\u2026' : row.region,
    total: STAGE_COLS.reduce((s, k) => s + (row as unknown as Record<string, number>)[k], 0),
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Regional Dashboard"
        subtitle="Pendency overview and SLA monitoring"
        actions={
          <select
            id="region-filter"
            className="form-select w-40"
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
          >
            <option value="">All Regions</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Applications', value: stats.total, icon: null, color: 'text-ink' },
          { label: 'Active', value: stats.active, icon: <TrendingUp size={14} className="text-accent" />, color: 'text-accent' },
          { label: 'SLA Breached', value: stats.breached, icon: <AlertTriangle size={14} className="text-danger" />, color: 'text-danger' },
          { label: 'Approved (2024)', value: stats.approved, icon: <TrendingDown size={14} className="text-success" />, color: 'text-success' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">{s.label}</span>
              {s.icon}
            </div>
            <span className={`stat-value ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-0">
        {[
          { key: 'overview' as const, label: 'Pendency Heatmap' },
          { key: 'applications' as const, label: 'Applications' },
          { key: 'ageing' as const, label: 'Ageing Distribution' },
        ].map(tab => (
          <button
            key={tab.key}
            id={`dash-tab-${tab.key}`}
            className={`px-3 py-2 text-sm border-b-2 transition-colors ${
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

      {/* Pendency Heatmap */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Stacked bar chart */}
          <div className="card">
            <h3 className="text-sm mb-3">Applications by Region and Stage</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pendencyChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="region" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: '1px solid #E5E5E5', borderRadius: '4px', fontSize: '12px', boxShadow: 'none' }}
                  formatter={(val: number, name: string) => [val, STAGE_LABELS[name as StageKey] ?? name]}
                />
                {STAGE_COLS.map((stage, i) => (
                  <Bar key={stage} dataKey={stage} stackId="a" fill={STAGE_COLORS[i]} radius={i === STAGE_COLS.length - 1 ? [2, 2, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-2">
              {STAGE_COLS.map((stage, i) => (
                <div key={stage} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ background: STAGE_COLORS[i] }} />
                  <span className="text-xs text-muted">{STAGE_LABELS[stage]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Region-stage table */}
          <div className="card overflow-x-auto">
            <h3 className="text-sm mb-3">Pendency Matrix</h3>
            <table className="table-base min-w-full">
              <thead>
                <tr>
                  <th>Region</th>
                  {STAGE_COLS.map(s => <th key={s}>{STAGE_LABELS[s]}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {PENDENCY_DATA.map(row => {
                  const total = STAGE_COLS.reduce((s, k) => s + (row as unknown as Record<string, number>)[k], 0);
                  return (
                    <tr key={row.region}>
                      <td className="font-semibold">{row.region}</td>
                      {STAGE_COLS.map(s => {
                        const val = (row as unknown as Record<string, number>)[s];
                        return (
                          <td key={s}>
                            <span className={`font-semibold ${val > 10 ? 'text-danger' : val > 6 ? 'text-warning' : 'text-ink'}`}>
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      <td className="font-semibold">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications list */}
      {activeTab === 'applications' && (
        <div className="card overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Reference No.</th>
                <th>Institution</th>
                <th>Type</th>
                <th>Stage</th>
                <th>SLA</th>
                <th>Status</th>
                <th>Officer</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id}>
                  <td className="font-mono text-xs">{app.refNo}</td>
                  <td className="font-semibold max-w-[180px] truncate">{app.institutionName}</td>
                  <td className="text-muted">{app.type}</td>
                  <td>{STAGE_LABELS[app.currentStage]}</td>
                  <td className="w-28">
                    <SlaBar percent={app.slaPercent} status={app.slaStatus} showLabel />
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="text-muted">{app.assignedOfficer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ageing distribution */}
      {activeTab === 'ageing' && (
        <div className="card">
          <h3 className="text-sm mb-3">Application Ageing (Working Days in Current Stage)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={AGEING_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="bucket" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #E5E5E5', borderRadius: '4px', fontSize: '12px', boxShadow: 'none' }}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {AGEING_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.bucket === '21+ days' ? '#DC2626' : entry.bucket === '16–20 days' ? '#D97706' : '#1D4ED8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted mt-2">
            Applications in the 21+ day bucket are flagged for escalation review.
          </p>
        </div>
      )}
    </div>
  );
}
