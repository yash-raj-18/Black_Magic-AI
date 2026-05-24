import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-bright group-hover:text-primary transition-colors">Black Magic AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-dim hover:text-bright transition-colors text-sm font-medium">Home</Link>
            <a href="#features" className="text-dim hover:text-bright transition-colors text-sm font-medium">Features</a>
            <Link to="/pricing" className="text-dim hover:text-bright transition-colors text-sm font-medium">Pricing</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-dim hover:text-bright transition-colors text-sm font-medium">Dashboard</Link>
                <button onClick={handleSignOut} className="btn-ghost text-sm !px-4 !py-2">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost text-sm !px-4 !py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Start Free</Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-dim" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass-strong border-t border-border">
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link to="/" className="text-dim hover:text-bright transition-colors text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Home</Link>
              <a href="#features" className="text-dim hover:text-bright transition-colors text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Features</a>
              <Link to="/pricing" className="text-dim hover:text-bright transition-colors text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Pricing</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-dim hover:text-bright transition-colors text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="btn-ghost text-sm w-full">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Start Free</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
