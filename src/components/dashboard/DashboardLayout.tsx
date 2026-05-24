import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Video, Wand2, Share2, BarChart3, Settings, LogOut, Zap, Menu, X, ChevronRight, Image } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Video, label: 'Videos', path: '/dashboard/videos' },
  { icon: Wand2, label: 'Generate', path: '/dashboard/generate' },
  { icon: Share2, label: 'Social Accounts', path: '/dashboard/social' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Image, label: 'Content Calendar', path: '/dashboard/calendar' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex">
      <AnimatePresence>
        {sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-bright">Black Magic AI</span>
          </Link>
          <button className="lg:hidden ml-auto text-dim" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-dim hover:text-bright hover:bg-surface-2'}`}>
                <item.icon className="w-5 h-5" />{item.label}{active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-bright truncate">{user?.email || 'User'}</p><p className="text-xs text-dim">Free Plan</p></div>
          </div>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dim hover:text-accent hover:bg-accent/5 w-full transition-all"><LogOut className="w-5 h-5" /> Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-8 glass-strong sticky top-0 z-30">
          <button className="lg:hidden text-dim mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
          <div className="flex-1" />
          <Link to="/dashboard/generate" className="btn-primary text-sm !px-4 !py-2">Generate Clips</Link>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
