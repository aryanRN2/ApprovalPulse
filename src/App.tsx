import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import InstitutionPortal from './pages/InstitutionPortal';
import OfficerWorkbench from './pages/OfficerWorkbench';
import EvcScheduler from './pages/EvcScheduler';
import CommitteeDecisions from './pages/CommitteeDecisions';
import RegionalDashboard from './pages/RegionalDashboard';
import AdminConsole from './pages/AdminConsole';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute(user.role)} replace /> : <LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/institution" element={<InstitutionPortal />} />
        <Route path="/officer" element={<OfficerWorkbench />} />
        <Route path="/evc" element={<EvcScheduler />} />
        <Route path="/committee" element={<CommitteeDecisions />} />
        <Route path="/dashboard" element={<RegionalDashboard />} />
        <Route path="/admin" element={<AdminConsole />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function getDefaultRoute(role: string): string {
  const map: Record<string, string> = {
    institution: '/institution',
    scrutiny_officer: '/officer',
    regional_officer: '/dashboard',
    bureau_head: '/dashboard',
    evc_member: '/evc',
    committee_member: '/committee',
    admin: '/admin',
  };
  return map[role] ?? '/login';
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
