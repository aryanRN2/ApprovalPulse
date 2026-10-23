import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { MOCK_USERS } from '../lib/data';
import type { Role } from '../lib/data';

const ROLE_LABELS: Record<Role, string> = {
  institution: 'Institution Nodal Officer',
  scrutiny_officer: 'Scrutiny Officer',
  regional_officer: 'Regional Officer',
  bureau_head: 'Bureau Head',
  evc_member: 'EVC Member',
  committee_member: 'Committee Member',
  admin: 'System Administrator',
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  institution: 'Track your application status, submit compliance evidence, and manage documents.',
  scrutiny_officer: 'Review applications, conduct scrutiny, manage your workbench and queue.',
  regional_officer: 'Monitor regional pendency, manage escalations, oversee officer workload.',
  bureau_head: 'National oversight, bottleneck analysis, strategic reporting.',
  evc_member: 'Schedule and conduct expert visits, upload visit reports.',
  committee_member: 'Review case summaries, record committee decisions.',
  admin: 'Configure workflow templates, manage rules, run demo simulator.',
};

const ROLE_ROUTES: Record<Role, string> = {
  institution: '/institution',
  scrutiny_officer: '/officer',
  regional_officer: '/dashboard',
  bureau_head: '/dashboard',
  evc_member: '/evc',
  committee_member: '/committee',
  admin: '/admin',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'select' | 'otp'>('select');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!selectedUser) { setError('Please select a user role to continue.'); return; }
    setError('');
    setStep('otp');
  };

  const handleLogin = () => {
    if (otp !== '123456') { setError('Invalid OTP. For demo, use 123456.'); return; }
    login(selectedUser);
    const user = MOCK_USERS.find(u => u.id === selectedUser);
    if (user) navigate(ROLE_ROUTES[user.role]);
  };

  const selectedUserObj = MOCK_USERS.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 border-r border-border p-6 bg-surface">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-8 group text-left cursor-pointer"
            title="Return to Home"
          >
            <div className="w-8 h-8 bg-[#151514] rounded-md flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <span className="text-white text-xs font-bold tracking-tight">AP</span>
            </div>
            <div>
              <span className="font-semibold text-ink group-hover:text-accent transition-colors">ApprovalPulse</span>
              <p className="text-[11px] text-muted">← Back to Overview</p>
            </div>
          </button>
          <h2 className="text-2xl mb-2">AICTE Approval &amp; Compliance System</h2>
          <p className="text-sm text-muted leading-relaxed">
            Unified workflow management platform for technical institution approvals,
            compliance tracking, and regulatory decision-making.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Applications Tracked', value: '2,847' },
            { label: 'Regions Covered', value: '33' },
            { label: 'SLA Compliance', value: '91.4%' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-t border-border">
              <span className="text-xs text-muted">{item.label}</span>
              <span className="text-sm font-semibold text-ink">{item.value}</span>
            </div>
          ))}
          <p className="text-xs text-muted pt-2">
            All figures are representative demo data for SIH evaluation purposes.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-6 lg:hidden group text-left cursor-pointer min-h-[38px]"
          >
            <div className="w-7 h-7 bg-[#151514] rounded-md flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-white text-xs font-bold tracking-tight">AP</span>
            </div>
            <div>
              <span className="font-semibold text-ink group-hover:text-accent transition-colors">ApprovalPulse</span>
              <p className="text-[10px] text-muted">← Back to Overview</p>
            </div>
          </button>

          <h1 className="text-2xl mb-1">Sign in</h1>
          <p className="text-sm text-muted mb-5">
            {step === 'select' ? 'Select your role to access the system.' : 'Enter the OTP sent to your registered mobile.'}
          </p>

          {step === 'select' ? (
            <div className="space-y-3">
              <div>
                <label className="form-label" htmlFor="role-select">Select Demo User</label>
                <select
                  id="role-select"
                  className="form-select min-h-[38px]"
                  value={selectedUser}
                  onChange={e => { setSelectedUser(e.target.value); setError(''); }}
                >
                  <option value="">— Choose a role —</option>
                  {MOCK_USERS.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({ROLE_LABELS[u.role]})
                    </option>
                  ))}
                </select>
              </div>

              {selectedUserObj && (
                <div className="card-sm bg-accent-light border-blue-200">
                  <p className="text-xs font-semibold text-accent">{ROLE_LABELS[selectedUserObj.role]}</p>
                  <p className="text-xs text-muted mt-0.5">{ROLE_DESCRIPTIONS[selectedUserObj.role]}</p>
                </div>
              )}

              {error && <p className="text-xs text-danger">{error}</p>}

              <button id="btn-continue" className="btn-primary w-full justify-center min-h-[40px]" onClick={handleContinue}>
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="card-sm bg-surface flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{selectedUserObj?.name}</p>
                  <p className="text-xs text-muted">{selectedUserObj?.email}</p>
                </div>
                <button className="btn-ghost text-xs p-1" onClick={() => setStep('select')}>Change</button>
              </div>

              <div>
                <label className="form-label" htmlFor="otp-input">One-Time Password</label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="form-input tracking-[0.3em] text-center font-semibold text-base py-2"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <p className="text-xs text-muted mt-0.5">Demo OTP: <strong>123456</strong></p>
              </div>

              {error && <p className="text-xs text-danger">{error}</p>}

              <button id="btn-signin" className="btn-primary w-full justify-center min-h-[40px]" onClick={handleLogin}>
                Sign In
              </button>
            </div>
          )}

          <p className="text-xs text-muted mt-6 pt-4 border-t border-border">
            This is a demonstration system for Smart India Hackathon 2024.
            All data is synthetic and does not represent actual AICTE records.
          </p>
        </div>
      </div>
    </div>
  );
}
