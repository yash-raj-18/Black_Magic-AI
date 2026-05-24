import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react';

interface AnalyticsRow {
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  viral_score: number;
  retention_rate: number;
}

interface ClipWithScore {
  id: string;
  title: string;
  viral_score: number;
  duration: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (<div className="glass rounded-lg p-3 text-xs"><p className="text-bright font-medium mb-1">{label}</p>{payload.map((p: any) => <p key={p.name} className="text-dim">{p.name}: <span className="text-bright">{p.value.toLocaleString()}</span></p>)}</div>);
  }
  return null;
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);
  const [topClips, setTopClips] = useState<ClipWithScore[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [avgViralScore, setAvgViralScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [analyticsRes, clipsRes] = await Promise.all([
        supabase.from('analytics').select('date, views, likes, shares, comments, viral_score, retention_rate').eq('user_id', user.id).order('date', { ascending: true }),
        supabase.from('clips').select('id, title, viral_score, duration').eq('user_id', user.id).eq('status', 'completed').order('viral_score', { ascending: false }).limit(10),
      ]);

      const analyticsData = (analyticsRes.data || []) as AnalyticsRow[];
      setAnalytics(analyticsData);
      setTopClips((clipsRes.data || []) as ClipWithScore[]);

      if (analyticsData.length > 0) {
        setTotalViews(analyticsData.reduce((s, a) => s + a.views, 0));
        setTotalLikes(analyticsData.reduce((s, a) => s + a.likes, 0));
        setTotalShares(analyticsData.reduce((s, a) => s + a.shares, 0));
        const scored = analyticsData.filter(a => a.viral_score > 0);
        setAvgViralScore(scored.length > 0 ? Math.round(scored.reduce((s, a) => s + a.viral_score, 0) / scored.length) : 0);
      }

      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const hasAnalytics = analytics.length > 0;
  const viewsChartData = hasAnalytics ? analytics.map(a => ({ date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), views: a.views, likes: a.likes })) : [];
  const viralTrendData = hasAnalytics ? analytics.map(a => ({ date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), score: a.viral_score })) : [];

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-bright">Analytics</h1><p className="text-dim text-sm">Track your content performance across platforms</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(), icon: Eye, color: 'text-primary' },
          { label: 'Total Likes', value: totalLikes > 1000 ? `${(totalLikes / 1000).toFixed(1)}K` : totalLikes.toString(), icon: Heart, color: 'text-accent' },
          { label: 'Total Shares', value: totalShares > 1000 ? `${(totalShares / 1000).toFixed(1)}K` : totalShares.toString(), icon: Share2, color: 'text-neon-green' },
          { label: 'Avg Viral Score', value: avgViralScore.toString(), icon: TrendingUp, color: 'text-primary' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} /><p className="font-display text-xl font-bold text-bright">{stat.value}</p><p className="text-xs text-dim">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {!hasAnalytics ? (
        <div className="glass rounded-xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-dim mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-bright mb-2">No analytics data yet</h3>
          <p className="text-dim text-sm mb-6">Generate and publish clips to start seeing engagement data here.</p>
          <a href="/dashboard/generate" className="btn-primary text-sm">Generate Your First Clip</a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-5">
              <h3 className="font-display font-semibold text-bright mb-4">Views & Engagement</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={viewsChartData}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00d4ff" stopOpacity={0} /></linearGradient>
                    <linearGradient id="likesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff3e8a" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff3e8a" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" /><XAxis dataKey="date" stroke="#8888a0" fontSize={12} /><YAxis stroke="#8888a0" fontSize={12} /><Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="#00d4ff" fill="url(#viewsGrad)" strokeWidth={2} /><Area type="monotone" dataKey="likes" stroke="#ff3e8a" fill="url(#likesGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="font-display font-semibold text-bright mb-4">Viral Score Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={viralTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" /><XAxis dataKey="date" stroke="#8888a0" fontSize={12} /><YAxis stroke="#8888a0" fontSize={12} domain={[0, 100]} /><Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#00ff88" strokeWidth={3} dot={{ fill: '#00ff88', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {topClips.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="font-display font-semibold text-bright mb-4">Top Performing Clips</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-3 px-2 text-dim font-medium">Clip</th><th className="text-right py-3 px-2 text-dim font-medium">Duration</th><th className="text-right py-3 px-2 text-dim font-medium">Viral Score</th></tr></thead>
              <tbody>
                {topClips.map((clip) => (
                  <tr key={clip.id} className="border-b border-border/30 hover:bg-surface-2/30">
                    <td className="py-3 px-2 text-bright font-medium">{clip.title || 'Untitled Clip'}</td>
                    <td className="py-3 px-2 text-right text-dim">{clip.duration}s</td>
                    <td className="py-3 px-2 text-right"><span className={`font-medium ${clip.viral_score >= 90 ? 'text-neon-green' : clip.viral_score >= 70 ? 'text-primary' : 'text-dim'}`}>{clip.viral_score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
