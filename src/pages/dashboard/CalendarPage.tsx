import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Youtube, Instagram, Twitter } from 'lucide-react';

interface ScheduledPost {
  id: string;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  clips: { title: string } | null;
  social_accounts: { platform: string; username: string } | null;
}

const platformIcons: Record<string, typeof Youtube> = { youtube: Youtube, tiktok: Youtube, instagram: Instagram, twitter: Twitter, facebook: Youtube, linkedin: Youtube };
const platformColors: Record<string, string> = { youtube: 'text-red-500', tiktok: 'text-pink-400', instagram: 'text-orange-400', twitter: 'text-sky-400', facebook: 'text-blue-500', linkedin: 'text-blue-600' };

export default function CalendarPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('published_clips')
        .select('id, status, scheduled_at, published_at, clips(title), social_accounts(platform, username)')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true, nullsFirst: false });
      if (data) setPosts(data as unknown as ScheduledPost[]);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-bright">Content Calendar</h1><p className="text-dim text-sm">Schedule and manage your content across platforms</p></div>

      {posts.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <CalendarIcon className="w-12 h-12 text-dim mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-bright mb-2">No scheduled posts yet</h3>
          <p className="text-dim text-sm mb-6">Generate clips and connect social accounts to start scheduling content.</p>
          <div className="flex gap-3 justify-center">
            <a href="/dashboard/generate" className="btn-primary text-sm">Generate Clips</a>
            <a href="/dashboard/social" className="btn-ghost text-sm">Connect Accounts</a>
          </div>
        </div>
      ) : (
        <>
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-bright">Scheduled ({scheduledPosts.length})</h3>
              <span className="text-xs text-dim">{publishedPosts.length} published</span>
            </div>
            <div className="space-y-3">
              {scheduledPosts.map((post, i) => {
                const Icon = platformIcons[post.social_accounts?.platform || ''] || Youtube;
                const color = platformColors[post.social_accounts?.platform || ''] || 'text-dim';
                return (
                  <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0"><Icon className={`w-5 h-5 ${color}`} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bright truncate">{post.clips?.title || 'Untitled Clip'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-dim" />
                        <span className="text-xs text-dim">{post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : 'No time set'}</span>
                        <span className="text-xs text-dim">@{post.social_accounts?.username || 'unknown'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">Scheduled</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {publishedPosts.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-display font-semibold text-bright mb-4">Recently Published</h3>
              <div className="space-y-3">
                {publishedPosts.slice(0, 5).map((post) => {
                  const Icon = platformIcons[post.social_accounts?.platform || ''] || Youtube;
                  const color = platformColors[post.social_accounts?.platform || ''] || 'text-dim';
                  return (
                    <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0"><Icon className={`w-5 h-5 ${color}`} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-bright truncate">{post.clips?.title || 'Untitled Clip'}</p>
                        <span className="text-xs text-dim">{post.published_at ? new Date(post.published_at).toLocaleString() : ''}</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-neon-green" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4"><CalendarIcon className="w-5 h-5 text-primary" /><h3 className="font-display font-semibold text-bright">AI Scheduling Insights</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { tip: 'Best YouTube posting time: Tue/Thu 5-7 PM EST', confidence: '94%' },
            { tip: 'TikTok peak hours: Mon-Fri 7-9 PM EST', confidence: '91%' },
            { tip: 'Instagram Reels perform best on Wed/Sat', confidence: '88%' },
            { tip: 'Twitter engagement peaks at 12 PM and 6 PM', confidence: '85%' },
          ].map((insight) => <div key={insight.tip} className="p-3 rounded-xl bg-surface-2/50 border border-border/30"><p className="text-sm text-dim">{insight.tip}</p><div className="flex items-center gap-1 mt-2"><CheckCircle2 className="w-3 h-3 text-neon-green" /><span className="text-xs text-neon-green">{insight.confidence} confidence</span></div></div>)}
        </div>
      </div>
    </div>
  );
}
