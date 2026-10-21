// ── Shared Types ───────────────────────────────────────────────
export type Role =
  | 'institution'
  | 'scrutiny_officer'
  | 'regional_officer'
  | 'bureau_head'
  | 'evc_member'
  | 'committee_member'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  region?: string;
  institution?: string;
}

export type StageKey =
  | 'preliminary_scrutiny'
  | 'rescrutiny'
  | 'evc_queue'
  | 'evc_scheduled'
  | 'evc_reported'
  | 'shc_committee'
  | 'sac_committee'
  | 'ca_decision'
  | 'approved'
  | 'rejected'
  | 'returned';

export type AppStatus = 'active' | 'returned' | 'approved' | 'rejected' | 'on_hold';

export interface Application {
  id: string;
  refNo: string;
  institutionName: string;
  region: string;
  type: 'New Institute' | 'Increase in Intake' | 'New Program' | 'Extension of Approval';
  currentStage: StageKey;
  status: AppStatus;
  assignedOfficer: string;
  slaPercent: number;    // 0–100
  slaStatus: 'ok' | 'warning' | 'breached';
  submittedAt: string;
  lastMovedAt: string;
  undertakingsDue: number;
  docsExpiring: number;
}

export interface Undertaking {
  id: string;
  applicationId: string;
  text: string;
  dueAt: string;
  status: 'open' | 'submitted' | 'under_verification' | 'accepted' | 'rejected' | 'overdue';
  evidenceRequired: boolean;
}

export interface InstitutionDocument {
  id: string;
  docType: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  daysUntilExpiry: number;
}

export interface EvcCase {
  id: string;
  applicationId: string;
  institutionName: string;
  region: string;
  status: 'queued' | 'scheduled' | 'conducted' | 'reported';
  proposedDate?: string;
  confirmedDate?: string;
  members: string[];
}

export interface Notification {
  id: string;
  type: 'sla_warning' | 'escalation' | 'doc_expiry' | 'undertaking' | 'info';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ── Mock Data ──────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Meera Iyer', email: 'meera@sampleinstitute.edu', role: 'institution', institution: 'INST-MH-0042', region: 'Maharashtra' },
  { id: 'u2', name: 'Rajiv Menon', email: 'rajiv.menon@aicte.gov.in', role: 'scrutiny_officer', region: 'Maharashtra' },
  { id: 'u3', name: 'Priya Sharma', email: 'priya.sharma@aicte.gov.in', role: 'regional_officer', region: 'Maharashtra' },
  { id: 'u4', name: 'Anand Kulkarni', email: 'anand.k@aicte.gov.in', role: 'bureau_head' },
  { id: 'u5', name: 'Col. Suresh Nair', email: 'suresh.nair@aicte.gov.in', role: 'evc_member' },
  { id: 'u6', name: 'Dr. Fatima Sheikh', email: 'fatima.sheikh@aicte.gov.in', role: 'committee_member' },
  { id: 'u7', name: 'Admin Console', email: 'admin@aicte.gov.in', role: 'admin' },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001', refNo: 'AICTE/MH/2024/NI/0042',
    institutionName: 'Sunrise Institute of Technology, Pune',
    region: 'Maharashtra', type: 'New Institute',
    currentStage: 'preliminary_scrutiny', status: 'active',
    assignedOfficer: 'Rajiv Menon', slaPercent: 72, slaStatus: 'ok',
    submittedAt: '2024-09-01', lastMovedAt: '2024-09-05',
    undertakingsDue: 2, docsExpiring: 1,
  },
  {
    id: 'app-002', refNo: 'AICTE/KA/2024/II/0189',
    institutionName: 'Karnataka College of Engineering, Bangalore',
    region: 'Karnataka', type: 'Increase in Intake',
    currentStage: 'evc_queue', status: 'active',
    assignedOfficer: 'Sita Rao', slaPercent: 91, slaStatus: 'warning',
    submittedAt: '2024-08-15', lastMovedAt: '2024-09-10',
    undertakingsDue: 0, docsExpiring: 2,
  },
  {
    id: 'app-003', refNo: 'AICTE/TN/2024/NP/0097',
    institutionName: 'Coimbatore Technical University',
    region: 'Tamil Nadu', type: 'New Program',
    currentStage: 'shc_committee', status: 'active',
    assignedOfficer: 'Arun Kumar', slaPercent: 105, slaStatus: 'breached',
    submittedAt: '2024-07-20', lastMovedAt: '2024-09-15',
    undertakingsDue: 3, docsExpiring: 0,
  },
  {
    id: 'app-004', refNo: 'AICTE/DL/2024/EA/0033',
    institutionName: 'Delhi School of Management',
    region: 'Northern', type: 'Extension of Approval',
    currentStage: 'ca_decision', status: 'active',
    assignedOfficer: 'Vinod Gupta', slaPercent: 55, slaStatus: 'ok',
    submittedAt: '2024-08-28', lastMovedAt: '2024-09-18',
    undertakingsDue: 1, docsExpiring: 0,
  },
  {
    id: 'app-005', refNo: 'AICTE/GJ/2024/NI/0078',
    institutionName: 'Gujarat Polytechnic Institute, Ahmedabad',
    region: 'Gujarat', type: 'New Institute',
    currentStage: 'returned', status: 'returned',
    assignedOfficer: 'Rajiv Menon', slaPercent: 0, slaStatus: 'ok',
    submittedAt: '2024-08-01', lastMovedAt: '2024-09-02',
    undertakingsDue: 0, docsExpiring: 3,
  },
  {
    id: 'app-006', refNo: 'AICTE/MH/2024/NP/0101',
    institutionName: 'Mumbai Institute of Design',
    region: 'Maharashtra', type: 'New Program',
    currentStage: 'approved', status: 'approved',
    assignedOfficer: 'Rajiv Menon', slaPercent: 100, slaStatus: 'ok',
    submittedAt: '2024-06-10', lastMovedAt: '2024-09-01',
    undertakingsDue: 0, docsExpiring: 0,
  },
];

export const MOCK_UNDERTAKINGS: Undertaking[] = [
  { id: 'ut-001', applicationId: 'app-001', text: 'Submit NOC from State Government for land use', dueAt: '2024-10-15', status: 'open', evidenceRequired: true },
  { id: 'ut-002', applicationId: 'app-001', text: 'Provide updated bank solvency certificate', dueAt: '2024-10-20', status: 'submitted', evidenceRequired: true },
  { id: 'ut-003', applicationId: 'app-003', text: 'Submit undertaking for faculty recruitment', dueAt: '2024-09-30', status: 'overdue', evidenceRequired: false },
  { id: 'ut-004', applicationId: 'app-003', text: 'Provide evidence of library digitization', dueAt: '2024-10-05', status: 'under_verification', evidenceRequired: true },
  { id: 'ut-005', applicationId: 'app-003', text: 'Submit hostel facility compliance certificate', dueAt: '2024-10-12', status: 'open', evidenceRequired: true },
  { id: 'ut-006', applicationId: 'app-004', text: 'Renew land lease agreement (minimum 30 years)', dueAt: '2024-11-01', status: 'open', evidenceRequired: true },
];

export const MOCK_DOCUMENTS: InstitutionDocument[] = [
  { id: 'doc-001', docType: 'Land Lease Agreement', expiryDate: '2024-11-15', status: 'expiring_soon', daysUntilExpiry: 25 },
  { id: 'doc-002', docType: 'Fire Safety Certificate', expiryDate: '2024-10-31', status: 'expiring_soon', daysUntilExpiry: 10 },
  { id: 'doc-003', docType: 'Building Completion Certificate', expiryDate: '2026-06-01', status: 'valid', daysUntilExpiry: 580 },
  { id: 'doc-004', docType: 'Affiliation Certificate', expiryDate: '2025-03-31', status: 'valid', daysUntilExpiry: 192 },
];

export const MOCK_EVC_CASES: EvcCase[] = [
  { id: 'evc-001', applicationId: 'app-002', institutionName: 'Karnataka College of Engineering', region: 'Karnataka', status: 'queued', members: [] },
  { id: 'evc-002', applicationId: 'app-001', institutionName: 'Sunrise Institute of Technology', region: 'Maharashtra', status: 'scheduled', proposedDate: '2024-10-18', confirmedDate: '2024-10-18', members: ['Col. Suresh Nair', 'Dr. Meena Joshi'] },
  { id: 'evc-003', applicationId: 'app-006', institutionName: 'Mumbai Institute of Design', region: 'Maharashtra', status: 'reported', confirmedDate: '2024-09-05', members: ['Col. Suresh Nair', 'Prof. Ramesh Iyer'] },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'sla_warning', title: 'SLA Breach: AICTE/TN/2024/NP/0097', body: 'Coimbatore Technical University application has breached the SLA by 5 working days. Escalation triggered to Regional Head.', read: false, createdAt: '2024-10-21T09:15:00Z' },
  { id: 'n2', type: 'doc_expiry', title: 'Document Expiring: Fire Safety Certificate', body: 'Fire Safety Certificate for Sunrise Institute of Technology expires in 10 days.', read: false, createdAt: '2024-10-21T08:00:00Z' },
  { id: 'n3', type: 'undertaking', title: 'Undertaking Overdue: AICTE/TN/2024/NP/0097', body: 'Faculty recruitment undertaking is past due. Institution has not responded.', read: true, createdAt: '2024-10-20T17:30:00Z' },
  { id: 'n4', type: 'escalation', title: 'Escalation Level 2: AICTE/KA/2024/II/0189', body: 'EVC scheduling overdue. Escalated to Regional Officer for mandatory response.', read: true, createdAt: '2024-10-20T11:00:00Z' },
  { id: 'n5', type: 'info', title: 'EVC Confirmed: AICTE/MH/2024/NI/0042', body: 'Expert Visit Committee confirmed for 18 October 2024 at Sunrise Institute of Technology.', read: true, createdAt: '2024-10-19T14:00:00Z' },
];

export const STAGE_LABELS: Record<StageKey, string> = {
  preliminary_scrutiny: 'Preliminary Scrutiny',
  rescrutiny: 'Re-Scrutiny',
  evc_queue: 'EVC Queue',
  evc_scheduled: 'EVC Scheduled',
  evc_reported: 'EVC Reported',
  shc_committee: 'SHC Committee',
  sac_committee: 'SAC Committee',
  ca_decision: 'CA Decision',
  approved: 'Approved',
  rejected: 'Rejected',
  returned: 'Returned',
};

export const REGIONS = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Northern', 'Gujarat', 'West Bengal', 'Rajasthan', 'Telangana'];

export const PENDENCY_DATA = [
  { region: 'Maharashtra', preliminary_scrutiny: 12, evc_queue: 8, shc_committee: 4, ca_decision: 2 },
  { region: 'Karnataka',   preliminary_scrutiny: 9,  evc_queue: 11, shc_committee: 2, ca_decision: 3 },
  { region: 'Tamil Nadu',  preliminary_scrutiny: 15, evc_queue: 5,  shc_committee: 7, ca_decision: 1 },
  { region: 'Northern',    preliminary_scrutiny: 6,  evc_queue: 4,  shc_committee: 3, ca_decision: 5 },
  { region: 'Gujarat',     preliminary_scrutiny: 10, evc_queue: 7,  shc_committee: 1, ca_decision: 0 },
  { region: 'Telangana',   preliminary_scrutiny: 8,  evc_queue: 6,  shc_committee: 4, ca_decision: 2 },
];
