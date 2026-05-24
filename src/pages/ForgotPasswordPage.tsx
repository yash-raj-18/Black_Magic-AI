import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Zap, ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) { setError(error); setLoading(false); }
    else { setSent(true); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <div className="absolute inset-0 grid-pattern" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div></Link>
            <h1 className="font-display text-2xl font-bold text-bright mb-2">Reset Password</h1>
            <p className="text-dim text-sm">We'll send you a reset link</p>
          </div>
          {sent ? (
            <div className="text-center">
              <div className="mb-4 p-4 rounded-xl bg-neon-green/10 border border-neon-green/20"><p className="text-neon-green text-sm">Check your email for a reset link.</p></div>
              <Link to="/login" className="btn-ghost inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Sign In</Link>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
                <Button type="submit" className="w-full" size="lg" loading={loading}>Send Reset Link</Button>
              </form>
              <p className="text-center text-dim text-sm mt-6"><Link to="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back to Sign In</Link></p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
