import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Notification } from './data';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from './data';

interface AuthContextType {
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  login: (userId: string) => void;
  logout: () => void;
  markAllRead: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const login = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{ user, notifications, unreadCount, login, logout, markAllRead }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
