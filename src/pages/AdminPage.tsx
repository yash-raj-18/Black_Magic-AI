import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Users, DollarSign, Activity, BarChart3, Shield, Settings } from 'lucide-react';

interface ProfileRow {
  id: string;
  email: string;
  plan: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [planBreakdown, setPlanBreakdown] = useState<{ plan: string; count: number }[]>([]);
  const [recentUsers, setRecentUsers] = useState<ProfileRow[]>([]);
  const [totalClips, setTotalClips] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [profilesRes, clipsRes, videosRes] = await Promise.all([
        supabase.from('profiles').select('id, email, plan, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('clips').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
      ]);

      const profiles = (profilesRes.data || []) as ProfileRow[];
      setRecentUsers(profiles);

      const planCounts: Record<string, number> = {};
      profiles.forEach(p => { planCounts[p.plan] = (planCounts[p.plan] || 0) + 1; });
      setPlanBreakdown(Object.entries(planCounts).map(([plan, count]) => ({ plan, count })));

      setTotalClips(clipsRes.count || 0);
      setTotalVideos(videosRes.count || 0);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-bg"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16 relative">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2"><Shield className="w-6 h-6 text-primary" /><h1 className="font-display text-3xl font-bold text-bright">Admin Panel</h1></div>
          <p className="text-dim text-sm">System administration and monitoring</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: recentUsers.length.toString(), sub: 'Recent signups shown', icon: Users, color: 'text-primary' },
            { label: 'Total Clips', value: totalClips.toString(), sub: 'All time', icon: Activity, color: 'text-neon-green' },
            { label: 'Total Videos', value: totalVideos.toString(), sub: 'All sources', icon: BarChart3, color: 'text-accent' },
            { label: 'Plans Active', value: planBreakdown.length.toString(), sub: 'Different tiers', icon: DollarSign, color: 'text-primary' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 card-hover">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} /><p className="font-display text-2xl font-bold text-bright">{stat.value}</p><p className="text-xs text-dim">{stat.label}</p><span className="text-xs text-dim/60">{stat.sub}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-primary" /><h3 className="font-display font-semibold text-bright">Plan Distribution</h3></div>
            {planBreakdown.length === 0 ? <p className="text-dim text-sm">No data yet</p> : (
              <div className="space-y-3">
                {planBreakdown.map(({ plan, count }) => (
                  <div key={plan} className="p-3 rounded-xl bg-surface-2/50">
                    <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-bright capitalize">{plan}</span><span className="text-sm text-primary font-medium">{count}</span></div>
                    <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${Math.min((count / recentUsers.length) * 100, 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-primary" /><h3 className="font-display font-semibold text-bright">Recent Users</h3></div>
            {recentUsers.length === 0 ? <p className="text-dim text-sm">No users yet</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-2 px-2 text-dim font-medium">Email</th><th className="text-left py-2 px-2 text-dim font-medium">Plan</th><th className="text-left py-2 px-2 text-dim font-medium">Joined</th></tr></thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/30 hover:bg-surface-2/30">
                        <td className="py-2 px-2 text-bright">{u.email.replace(/(.{1}).+(@.+)/, '$1***$2')}</td>
                        <td className="py-2 px-2"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.plan === 'pro' ? 'bg-accent/10 text-accent' : u.plan === 'agency' ? 'bg-neon-green/10 text-neon-green' : u.plan === 'creator' ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-dim'}`}>{u.plan}</span></td>
                        <td className="py-2 px-2 text-dim">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'User Management', icon: Users, desc: 'View and manage all users' }, { label: 'Revenue Reports', icon: DollarSign, desc: 'Financial analytics' },
            { label: 'Content Moderation', icon: Shield, desc: 'Review flagged content' }, { label: 'System Settings', icon: Settings, desc: 'Platform configuration' },
          ].map((action) => <div key={action.label} className="glass rounded-xl p-5 card-hover cursor-pointer"><action.icon className="w-6 h-6 text-primary mb-3" /><h3 className="text-sm font-medium text-bright mb-1">{action.label}</h3><p className="text-xs text-dim">{action.desc}</p></div>)}
        </div>
      </div>
    </div>
  );
}
