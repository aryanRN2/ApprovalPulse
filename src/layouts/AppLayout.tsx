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

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <NavLink to="/" title="ApprovalPulse Overview" className="flex items-center gap-2 px-3 py-4 border-b border-border hover:bg-surface transition-colors group">
        <div className="w-7 h-7 bg-accent rounded flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <span className="text-white text-xs font-semibold">AP</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink leading-none">ApprovalPulse</p>
          <p className="text-xs text-muted leading-none mt-0.5">AICTE Platform</p>
        </div>
      </NavLink>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx('nav-link', { active: isActive })}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User info */}
      <div className="px-2 py-3 border-t border-border">
        <div className="card-sm">
          <p className="text-xs font-semibold text-ink truncate">{user?.name}</p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
          {user?.region && <p className="text-xs text-muted">{user.region}</p>}
        </div>
        <button
          id="btn-logout"
          className="nav-link w-full mt-1 text-danger hover:bg-red-50 hover:text-danger"
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
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-56 bg-white border-r border-border z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden btn-ghost p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Notifications */}
            <div className="relative">
              <button
                id="btn-notifications"
                className="btn-ghost p-1 relative"
                onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-danger text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-border rounded shadow-sm z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button className="text-xs text-accent" onClick={markAllRead}>Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.map(n => (
                      <div key={n.id} className={clsx('px-3 py-2', { 'bg-accent-light': !n.read })}>
                        <p className="text-xs font-semibold text-ink">{n.title}</p>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-[11px] text-muted mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
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
                className="btn-ghost flex items-center gap-1 text-sm"
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
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded shadow-sm z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted capitalize">{user?.role.replace(/_/g, ' ')}</p>
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
        <main className="flex-1 overflow-y-auto">
          <div className="content-width py-4">
            <div className="page-enter">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
