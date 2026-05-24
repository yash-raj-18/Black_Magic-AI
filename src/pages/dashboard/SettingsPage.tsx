import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../types';
import { User, CreditCard, Bell, Shield, Save } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PLAN_LABELS: Record<string, { label: string; exports: number }> = {
  free: { label: 'Free', exports: 3 },
  creator: { label: 'Creator', exports: 100 },
  pro: { label: 'Pro', exports: 999999 },
  agency: { label: 'Agency', exports: 999999 },
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) { setProfile(data as Profile); setName(data.full_name); }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const sanitizedName = name.slice(0, 100).replace(/<[^>]*>/g, '');
    await supabase.from('profiles').update({ full_name: sanitizedName, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (profile) setProfile({ ...profile, full_name: sanitizedName });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const planInfo = profile ? PLAN_LABELS[profile.plan] || PLAN_LABELS.free : PLAN_LABELS.free;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-bright">Settings</h1><p className="text-dim text-sm">Manage your account and preferences</p></div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6"><User className="w-5 h-5 text-primary" /><h2 className="font-display font-semibold text-bright">Profile</h2></div>
        <div className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          <Input label="Email" value={user?.email || ''} disabled />
          <div className="flex items-center gap-3"><Button onClick={handleSave} loading={saving} size="sm"><Save className="w-4 h-4 mr-1" /> Save Changes</Button>{saved && <span className="text-neon-green text-sm">Saved!</span>}</div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-accent" /><h2 className="font-display font-semibold text-bright">Subscription</h2></div>
        <div className="p-4 rounded-xl bg-surface-2/50 border border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-bright capitalize">{planInfo.label} Plan</span>
            <a href="/pricing" className="btn-ghost text-xs !px-3 !py-1.5">{profile?.plan === 'free' ? 'Upgrade' : 'Change Plan'}</a>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-dim">{profile?.exports_used || 0} / {planInfo.exports === 999999 ? 'Unlimited' : planInfo.exports} exports used</span>
            </div>
            {planInfo.exports !== 999999 && (
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${Math.min(((profile?.exports_used || 0) / planInfo.exports) * 100, 100)}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-neon-green" /><h2 className="font-display font-semibold text-bright">Notifications</h2></div>
        <div className="space-y-3">
          {[
            { label: 'Clip generation complete', enabled: true }, { label: 'Social media post published', enabled: true },
            { label: 'Weekly analytics summary', enabled: false }, { label: 'New feature announcements', enabled: true },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-dim">{notif.label}</span>
              <button className={`w-10 h-5 rounded-full transition-colors ${notif.enabled ? 'bg-primary' : 'bg-border'} relative`} onClick={(e) => { const el = e.currentTarget; el.classList.toggle('bg-primary'); el.classList.toggle('bg-border'); }}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${notif.enabled ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-primary" /><h2 className="font-display font-semibold text-bright">Content & Security</h2></div>
        <div className="space-y-3 text-sm text-dim">
          <p>All uploaded content requires ownership confirmation. AI-assisted transformation operates under fair use guidelines.</p>
          <p>Your data is encrypted and stored securely. We never share your content with third parties.</p>
        </div>
      </div>
    </div>
  );
}
