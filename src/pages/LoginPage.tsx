import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Zap } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEOHead from '../components/shared/SEOHead';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error); setLoading(false); }
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <SEOHead
        title="Sign In - Black Magic AI"
        description="Sign in to your Black Magic AI account to start creating viral short-form content with AI."
        canonical="https://black-magic-ai.app/login"
      />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div></Link>
            <h1 className="font-display text-2xl font-bold text-bright mb-2">Welcome Back</h1>
            <p className="text-dim text-sm">Sign in to your Black Magic AI account</p>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} required />
            <div className="flex items-center justify-end"><Link to="/forgot-password" className="text-primary text-sm hover:underline">Forgot password?</Link></div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
          </form>
          <p className="text-center text-dim text-sm mt-6">Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up free</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
