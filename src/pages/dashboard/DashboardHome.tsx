import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { TrendingUp, Video, Sparkles, BarChart3, ArrowUpRight, Clock, CheckCircle2, Zap } from 'lucide-react';

interface ClipWithVideo {
  id: string;
  title: string;
  status: string;
  viral_score: number;
  duration: number;
  created_at: string;
  video_id: string;
  videos: { source_type: string } | null;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clipCount, setClipCount] = useState(0);
  const [avgViralScore, setAvgViralScore] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [recentClips, setRecentClips] = useState<ClipWithVideo[]>([]);
  const [socialAccountCount, setSocialAccountCount] = useState(0);
  const [profile, setProfile] = useState<{ plan: string; exports_used: number; exports_limit: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [clipsRes, publishedRes, analyticsRes, socialRes, profileRes] = await Promise.all([
        supabase.from('clips').select('id, title, status, viral_score, duration, created_at, video_id, videos(source_type)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('published_clips').select('id').eq('user_id', user.id).eq('status', 'published'),
        supabase.from('analytics').select('views').eq('user_id', user.id),
        supabase.from('social_accounts').select('id').eq('user_id', user.id).eq('connected', true),
        supabase.from('profiles').select('plan, exports_used, exports_limit').eq('id', user.id).maybeSingle(),
      ]);

      const clips = (clipsRes.data || []) as unknown as ClipWithVideo[];
      setRecentClips(clips);
      setClipCount(clips.length);

      if (clips.length > 0) {
        const scores = clips.filter(c => c.viral_score > 0).map(c => c.viral_score);
        setAvgViralScore(scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0);
      }

      setPublishedCount(publishedRes.data?.length || 0);
      setTotalViews(analyticsRes.data?.reduce((sum: number, a: any) => sum + (a.views || 0), 0) || 0);
      setSocialAccountCount(socialRes.data?.length || 0);
      setProfile(profileRes.data as any);
      setLoading(false);
    })();
  }, [user]);

  const getPlatformLabel = (sourceType: string | null) => {
    if (!sourceType) return 'Video';
    return sourceType === 'youtube' ? 'YouTube' : sourceType === 'upload' ? 'Upload' : 'Transcript';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const stats = [
    { label: 'Total Clips', value: clipCount.toString(), change: 'This month', icon: Video, color: 'text-primary' },
    { label: 'Avg Viral Score', value: avgViralScore.toString(), change: 'All clips', icon: TrendingUp, color: 'text-neon-green' },
    { label: 'Published', value: publishedCount.toString(), change: 'All time', icon: CheckCircle2, color: 'text-accent' },
    { label: 'Total Views', value: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(), change: 'All clips', icon: BarChart3, color: 'text-primary' },
  ];

  const insights = [
    ...(socialAccountCount === 0 ? ['Connect your social accounts to enable auto-publishing and track engagement.'] : []),
    ...(clipCount === 0 ? ['Generate your first clip by pasting a YouTube URL in the Generate page.'] : ['Review your recent clips and publish the ones with viral scores above 80.']),
    ...(profile && profile.exports_used >= profile.exports_limit * 0.8 ? ['You\'re approaching your export limit. Consider upgrading your plan for more exports.'] : []),
    'Post between 7-9 PM EST for maximum engagement on short-form platforms.',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-bright">Dashboard</h1><p className="text-dim text-sm">Welcome back. Here's your content overview.</p></div>
        <Link to="/dashboard/generate" className="btn-primary text-sm !px-5 !py-2.5 inline-flex items-center gap-2"><Zap className="w-4 h-4" /> Generate New Clip</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass rounded-xl p-5 card-hover">
            <div className="flex items-center justify-between mb-3"><stat.icon className={`w-5 h-5 ${stat.color}`} /><span className="text-dim text-xs">{stat.change}</span></div>
            <p className="font-display text-2xl font-bold text-bright">{stat.value}</p>
            <p className="text-dim text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {profile && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-bright font-medium capitalize">{profile.plan} Plan</span>
              <span className="text-xs text-dim">{profile.exports_used} / {profile.exports_limit} exports used</span>
            </div>
            <div className="flex-1 max-w-xs ml-4">
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${Math.min((profile.exports_used / profile.exports_limit) * 100, 100)}%` }} />
              </div>
            </div>
            {profile.plan === 'free' && <Link to="/pricing" className="btn-ghost text-xs !px-3 !py-1.5 ml-4">Upgrade</Link>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="font-display font-semibold text-bright">Recent Clips</h2><Link to="/dashboard/videos" className="text-primary text-sm hover:underline">View All</Link></div>
          {recentClips.length === 0 ? (
            <div className="text-center py-8"><Video className="w-10 h-10 text-dim mx-auto mb-3" /><p className="text-dim text-sm mb-4">No clips yet. Generate your first one!</p><Link to="/dashboard/generate" className="btn-primary text-sm">Generate Clip</Link></div>
          ) : (
            <div className="space-y-3">
              {recentClips.map((clip) => (
                <div key={clip.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0"><Video className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bright truncate">{clip.title || 'Untitled Clip'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-dim flex items-center gap-1"><Clock className="w-3 h-3" />{clip.duration}s</span>
                      <span className="text-xs text-dim">{getPlatformLabel(clip.videos?.source_type || null)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${clip.viral_score >= 90 ? 'text-neon-green' : clip.viral_score >= 70 ? 'text-primary' : 'text-dim'}`}>{clip.viral_score || '--'}</div>
                    <div className={`text-xs ${clip.status === 'completed' ? 'text-neon-green' : clip.status === 'failed' ? 'text-accent' : 'text-yellow-500'}`}>{clip.status === 'completed' ? 'Ready' : clip.status === 'failed' ? 'Failed' : 'Processing'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-primary" /><h2 className="font-display font-semibold text-bright">AI Insights</h2></div>
          <div className="space-y-3">
            {insights.map((rec, i) => <div key={i} className="p-3 rounded-xl bg-surface-2/50 border border-border/30"><p className="text-sm text-dim leading-relaxed">{rec}</p></div>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Paste YouTube Link', icon: Video, path: '/dashboard/generate', color: 'text-primary' },
          { label: 'View Analytics', icon: BarChart3, path: '/dashboard/analytics', color: 'text-accent' },
          { label: socialAccountCount > 0 ? `${socialAccountCount} Platforms Connected` : 'Connect Platforms', icon: Sparkles, path: '/dashboard/social', color: 'text-neon-green' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className="glass rounded-xl p-5 card-hover flex items-center gap-3">
            <action.icon className={`w-6 h-6 ${action.color}`} /><span className="text-sm font-medium text-bright">{action.label}</span><ArrowUpRight className="w-4 h-4 text-dim ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}
