import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import clsx from 'clsx';
import {
  LayoutDashboard, FileText, Shield, Calendar, Users,
  Settings, Bell, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import type { Role } from '../lib/data';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={16} />, roles: ['regional_officer', 'bureau_head', 'admin'] },
  { label: 'My Application', to: '/institution', icon: <FileText size={16} />, roles: ['institution'] },
  { label: 'Workbench', to: '/officer', icon: <Shield size={16} />, roles: ['scrutiny_officer', 'regional_officer', 'bureau_head'] },
  { label: 'EVC Scheduler', to: '/evc', icon: <Calendar size={16} />, roles: ['evc_member', 'scrutiny_officer', 'regional_officer', 'bureau_head', 'admin'] },
  { label: 'Committee', to: '/committee', icon: <Users size={16} />, roles: ['committee_member', 'bureau_head', 'admin'] },
  { label: 'Admin Console', to: '/admin', icon: <Settings size={16} />, roles: ['admin'] },
];

export default function AppLayout() {
  const { user, notifications, unreadCount, logout, markAllRead } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex flex-col h-full">
      {/* Logo & Close */}
      <div className="flex items-center justify-between border-b border-border pr-2">
        <NavLink to="/" title="ApprovalPulse Overview" className="flex items-center gap-2 px-3 py-3.5 hover:bg-surface transition-colors group flex-1">
          <div className="w-7 h-7 bg-[#151514] rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <span className="text-white text-xs font-bold tracking-tight">AP</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-none">ApprovalPulse</p>
            <p className="text-[11px] text-muted leading-none mt-1">AICTE Platform</p>
          </div>
        </NavLink>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn-ghost p-1.5 text-muted hover:text-ink"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 touch-scroll">
        {visibleNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx('nav-link min-h-[40px]', { active: isActive })}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User info */}
      <div className="px-2 py-3 border-t border-border bg-surface/50">
        <div className="card-sm">
          <p className="text-xs font-semibold text-ink truncate">{user?.name}</p>
          <p className="text-[11px] text-muted truncate">{user?.email}</p>
          {user?.region && <p className="text-[11px] text-muted truncate">{user.region}</p>}
        </div>
        <button
          id="btn-logout"
          className="nav-link w-full mt-1.5 text-danger hover:bg-red-50 hover:text-danger min-h-[38px]"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex flex-col w-64 max-w-[80vw] bg-white border-r border-border z-50 shadow-2xl h-full">
            <SidebarContent isMobile={true} />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-3 flex-shrink-0 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2 min-w-0">
            <button
              className="lg:hidden btn-ghost p-1.5 -ml-1 text-ink flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 lg:hidden">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface border border-border text-ink capitalize truncate max-w-[140px] sm:max-w-none">
                {user?.role.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                id="btn-notifications"
                className="btn-ghost p-1.5 relative"
                onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-12 sm:top-full mt-1 sm:w-80 bg-white border border-border rounded shadow-lg z-50 max-w-sm ml-auto">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-xs font-semibold">Notifications</span>
                    <button className="text-xs text-accent" onClick={markAllRead}>Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-border touch-scroll">
                    {notifications.map(n => (
                      <div key={n.id} className={clsx('px-3 py-2', { 'bg-accent-light': !n.read })}>
                        <p className="text-xs font-semibold text-ink">{n.title}</p>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-[10px] text-muted mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                id="btn-user-menu"
                className="btn-ghost flex items-center gap-1 text-sm p-1"
                onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
              >
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-semibold">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <span className="hidden sm:block text-sm">{user?.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold truncate">{user?.name}</p>
                    <p className="text-[11px] text-muted capitalize truncate">{user?.role.replace(/_/g, ' ')}</p>
                  </div>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-red-50" onClick={handleLogout}>
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden touch-scroll">
          <div className="content-width py-3 sm:py-4">
            <div className="page-enter">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
