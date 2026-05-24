import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Zap } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEOHead from '../components/shared/SEOHead';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) { setError(error); setLoading(false); }
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <SEOHead
        title="Create Account - Black Magic AI | Free Trial"
        description="Create your free Black Magic AI account and start transforming long videos into viral shorts with AI-powered clip detection, auto captions, and social media automation."
        canonical="https://black-magic-ai.app/register"
      />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div></Link>
            <h1 className="font-display text-2xl font-bold text-bright mb-2">Create Account</h1>
            <p className="text-dim text-sm">Start creating viral content with AI magic</p>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} required />
            <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} required minLength={6} />
            <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
          </form>
          <p className="text-center text-dim/50 text-xs mt-4">By signing up, you confirm you will only upload content you own or have rights to use.</p>
          <p className="text-center text-dim text-sm mt-4">Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
