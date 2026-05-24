import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, Building2, Sparkles, X, Shield, Clock, AlertCircle, Loader2, Copy, CheckCircle2, Smartphone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/shared/SEOHead';
import { useAuth } from '../hooks/useAuth';
import type { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  { id: 'free', name: 'Free', price: 0, yearlyPrice: 0, features: ['3 exports/month', 'Watermarked videos', 'Basic AI editing', '720p resolution', 'Email support'], cta: 'Get Started' },
  { id: 'creator', name: 'Creator', price: 1499, yearlyPrice: 1199, features: ['100 videos/month', 'HD exports', 'AI captions', 'Social publishing', 'No watermark', '5 platform connections', 'Priority support'], cta: 'Start Creator', highlight: true },
  { id: 'pro', name: 'Pro', price: 3499, yearlyPrice: 2799, features: ['Unlimited videos', '4K rendering', 'Viral analytics', 'Priority rendering', 'AI voiceovers', 'All platforms', 'Trend prediction', 'Custom branding'], cta: 'Go Pro' },
  { id: 'agency', name: 'Agency', price: 6999, yearlyPrice: 5599, features: ['Team access (up to 10)', 'White-label system', 'Unlimited automation', 'Advanced analytics', 'API access', 'Dedicated manager', 'Custom integrations', 'Bulk processing'], cta: 'Contact Sales' },
];

const planIcons = { free: Sparkles, creator: Zap, pro: Crown, agency: Building2 };
const planColors = { free: 'text-dim', creator: 'text-primary', pro: 'text-accent', agency: 'text-neon-green' };

function formatINR(cents: number) {
  return `₹${(cents / 100).toLocaleString('en-IN')}`;
}

type PaymentStep = 'idle' | 'auth' | 'creating' | 'qr' | 'confirming' | 'success' | 'error';

export default function PricingPage() {
  const { user } = useAuth();
  const [yearly, setYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<PaymentStep>('idle');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pollCount, setPollCount] = useState(0);

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') return;
    if (planId === 'agency') return;
    setSelectedPlan(planId);
    setErrorMsg('');

    if (!user) {
      setStep('auth');
      return;
    }

    await createPayment(planId);
  };

  const createPayment = async (planId: string) => {
    setStep('creating');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStep('auth');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'create',
          plan_id: planId,
          billing_cycle: yearly ? 'yearly' : 'monthly',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to create payment');
        setStep('error');
        return;
      }

      setTransactionRef(data.transaction_ref);
      setPaymentId(data.payment_id);
      setStep('qr');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStep('error');
    }
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!paymentId || !user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'status', payment_id: paymentId }),
      });

      const data = await res.json();
      if (data.payment?.status === 'verified') {
        setStep('success');
      }
    } catch {
      // silently fail on poll
    }
  }, [paymentId, user]);

  useEffect(() => {
    if (step !== 'qr' && step !== 'confirming') return;
    if (pollCount >= 60) return;

    const interval = setInterval(() => {
      setPollCount(prev => prev + 1);
      checkPaymentStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [step, checkPaymentStatus, pollCount]);

  const handleConfirmPayment = () => {
    setStep('confirming');
    checkPaymentStatus();
  };

  const copyRef = () => {
    navigator.clipboard.writeText(transactionRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setStep('idle');
    setSelectedPlan(null);
    setTransactionRef('');
    setPaymentId('');
    setErrorMsg('');
    setPollCount(0);
  };

  const plan = plans.find(p => p.id === selectedPlan);
  const priceDisplay = plan ? formatINR(yearly ? plan.yearlyPrice : plan.price) : '';

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <SEOHead
        title="Pricing - Black Magic AI | Affordable AI Video Editing Plans"
        description="Choose the perfect plan for your viral content creation. Free, Creator, Pro, and Agency plans with AI-powered clip detection, auto captions, and social media automation. Start with a free trial."
        keywords="AI video editing pricing, viral shorts pricing, YouTube Shorts AI plans, TikTok video maker cost, Black Magic AI pricing"
        canonical="https://black-magic-ai.app/pricing"
      />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">Pricing</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-bright mb-4">Choose Your <span className="gradient-text">Magic Tier</span></h1>
          <p className="text-dim text-lg max-w-2xl mx-auto mb-8">Start free and scale as you grow. All plans include a 7-day free trial.</p>
          <div className="inline-flex items-center gap-4 glass rounded-full px-2 py-1">
            <button onClick={() => setYearly(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? 'bg-primary text-white' : 'text-dim'}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${yearly ? 'bg-primary text-white' : 'text-dim'}`}>Yearly <span className="text-neon-green text-xs ml-1">Save 20%</span></button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, i) => {
            const Icon = planIcons[p.id];
            const color = planColors[p.id];
            const isFree = p.id === 'free';
            const isAgency = p.id === 'agency';
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`glass rounded-2xl p-6 card-hover relative flex flex-col ${p.highlight ? 'glow-blue border-primary/30' : ''}`}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>}
                <div className="mb-6">
                  <Icon className={`w-8 h-8 ${color} mb-3`} />
                  <h3 className="font-display text-xl font-bold text-bright">{p.name}</h3>
                  <div className="mt-2">
                    <span className="font-display text-4xl font-bold text-bright">{isFree ? 'Free' : formatINR(yearly ? p.yearlyPrice : p.price)}</span>
                    {!isFree && <span className="text-dim text-sm">/month</span>}
                  </div>
                  {yearly && p.price > 0 && <p className="text-neon-green text-xs mt-1">Billed {formatINR(p.yearlyPrice * 12)}/year</p>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">{p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className={`w-4 h-4 ${color} mt-0.5 shrink-0`} /><span className="text-sm text-dim">{f}</span></li>)}</ul>
                {isFree ? (
                  <Link to="/register" className={`w-full text-center block ${p.highlight ? 'btn-primary' : 'btn-ghost'} !py-3`}>{p.cta}</Link>
                ) : isAgency ? (
                  <Link to="/register" className={`w-full text-center block ${p.highlight ? 'btn-primary' : 'btn-ghost'} !py-3`}>{p.cta}</Link>
                ) : (
                  <button onClick={() => handlePlanSelect(p.id)} className={`w-full text-center ${p.highlight ? 'btn-primary' : 'btn-ghost'} !py-3 flex items-center justify-center gap-2`}>
                    <Smartphone className="w-4 h-4" /> {p.cta}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-8 flex items-center justify-center gap-6 text-dim text-xs">
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-neon-green" /> Secure Payments</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Instant Activation</div>
          <div className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-accent" /> PhonePe Verified</div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPlan && step !== 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-surface rounded-2xl p-6 sm:p-8 max-w-md w-full glass-strong border border-border relative overflow-hidden">
              <button onClick={closeModal} className="absolute top-4 right-4 text-dim hover:text-bright transition-colors z-10"><X className="w-5 h-5" /></button>

              {step === 'auth' && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Shield className="w-7 h-7 text-primary" /></div>
                  <h2 className="font-display text-2xl font-bold text-bright mb-2">Sign In Required</h2>
                  <p className="text-dim text-sm mb-6">Create an account or sign in to purchase the {plan?.name} plan.</p>
                  <div className="space-y-3">
                    <Link to="/login" state={{ from: { planId: selectedPlan, billing: yearly ? 'yearly' : 'monthly' } } as any} className="btn-primary w-full block text-center !py-3">Sign In</Link>
                    <Link to="/register" state={{ from: { planId: selectedPlan, billing: yearly ? 'yearly' : 'monthly' } } as any} className="btn-ghost w-full block text-center !py-3">Create Account</Link>
                  </div>
                </div>
              )}

              {step === 'creating' && (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                  <h2 className="font-display text-xl font-bold text-bright mb-2">Creating Payment...</h2>
                  <p className="text-dim text-sm">Setting up your secure payment session</p>
                </div>
              )}

              {step === 'qr' && (
                <div>
                  <div className="mb-5 pb-5 border-b border-border">
                    <h2 className="font-display text-2xl font-bold text-bright mb-1">Complete Payment</h2>
                    <div className="flex items-center justify-between">
                      <p className="text-dim text-sm">{plan?.name} Plan ({yearly ? 'Yearly' : 'Monthly'})</p>
                      <p className="text-primary font-bold text-lg">{priceDisplay}/mo</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-dim text-sm mb-3 text-center">Scan with PhonePe to pay</p>
                    <div className="flex justify-center mb-3">
                      <img src="/IMG-20251217-WA0011.jpg" alt="PhonePe QR Code - Scan to pay" className="w-56 h-56 rounded-xl border-2 border-primary/30" />
                    </div>
                    <p className="text-center text-xs text-dim mb-1">Payment to: <span className="text-bright font-medium">Mr Yash Raj</span></p>
                  </div>

                  <div className="bg-surface-2 rounded-xl p-3 mb-4 border border-border/50">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-dim mb-0.5">Transaction Reference</p>
                        <p className="text-sm text-bright font-mono truncate">{transactionRef}</p>
                      </div>
                      <button onClick={copyRef} className="shrink-0 p-2 rounded-lg bg-surface hover:bg-primary/10 transition-colors">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-dim" />}
                      </button>
                    </div>
                    <p className="text-xs text-dim mt-2">Add this reference in your PhonePe payment notes for faster verification.</p>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-3 mb-5 border border-primary/20">
                    <p className="text-xs text-dim"><span className="text-primary font-semibold">Important:</span> After completing payment in PhonePe, click the button below. We will verify your payment automatically.</p>
                  </div>

                  <button onClick={handleConfirmPayment} className="w-full btn-primary !py-3 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> I've Completed Payment
                  </button>
                </div>
              )}

              {step === 'confirming' && (
                <div className="text-center py-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                  <h2 className="font-display text-xl font-bold text-bright mb-2">Verifying Payment...</h2>
                  <p className="text-dim text-sm mb-1">Checking payment status with our servers</p>
                  <p className="text-dim text-xs">This will update automatically once verified</p>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }} className="w-2 h-2 rounded-full bg-primary" />
                    ))}
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                    <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-bright mb-2">Payment Verified!</h2>
                  <p className="text-dim text-sm mb-6">Your {plan?.name} plan is now active. Start creating viral content!</p>
                  <Link to="/dashboard" className="btn-primary w-full block text-center !py-3" onClick={closeModal}>Go to Dashboard</Link>
                </div>
              )}

              {step === 'error' && (
                <div className="text-center py-6">
                  <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2 className="font-display text-xl font-bold text-bright mb-2">Payment Error</h2>
                  <p className="text-dim text-sm mb-6">{errorMsg}</p>
                  <button onClick={() => selectedPlan && createPayment(selectedPlan)} className="btn-primary w-full !py-3">Try Again</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
