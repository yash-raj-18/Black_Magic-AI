import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Video, Clock, CheckCircle2, XCircle, Sparkles, Play } from 'lucide-react';
import type { Video as VideoType, Clip } from '../../types';
import { Link } from 'react-router-dom';

interface VideoWithClips extends VideoType {
  clips: Clip[];
}

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoWithClips[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('videos')
        .select('*, clips(id, title, status, viral_score, duration, hook_text, hashtags)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setVideos(data as VideoWithClips[]);
      setLoading(false);
    })();
  }, [user]);

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-accent" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const statusLabel = (status: string) => status === 'completed' ? 'Processed' : status === 'failed' ? 'Failed' : 'Processing';

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-bright">Videos & Clips</h1><p className="text-dim text-sm">Your source videos and generated clips</p></div>
        <Link to="/dashboard/generate" className="btn-primary text-sm !px-5 !py-2.5 inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate New</Link>
      </div>

      {videos.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-12 text-center">
          <Video className="w-12 h-12 text-dim mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-bright mb-2">No videos yet</h3>
          <p className="text-dim text-sm mb-6">Start by pasting a YouTube link or uploading a video.</p>
          <Link to="/dashboard/generate" className="btn-primary text-sm">Generate Your First Clip</Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {videos.map((video, i) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="glass rounded-xl card-hover">
                <div
                  className="p-5 cursor-pointer flex items-center gap-4"
                  onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-bright truncate">{video.title || 'Untitled Video'}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-dim capitalize">{video.source_type}</span>
                      <div className="flex items-center gap-1.5">{statusIcon(video.status)}<span className="text-xs text-dim">{statusLabel(video.status)}</span></div>
                      {video.clips && <span className="text-xs text-primary">{video.clips.length} clips</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-dim">{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {expandedVideo === video.id && video.clips && video.clips.length > 0 && (
                  <div className="border-t border-border/50 p-4">
                    <h4 className="text-xs font-medium text-dim mb-3 uppercase tracking-wider">Generated Clips</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {video.clips.map((clip) => (
                        <div key={clip.id} className="p-4 rounded-xl bg-surface-2/50 border border-border/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Play className="w-4 h-4 text-primary" />
                            <p className="text-sm font-medium text-bright truncate">{clip.title || 'Untitled Clip'}</p>
                          </div>
                          {clip.hook_text && <p className="text-xs text-dim italic mb-2">"{clip.hook_text}"</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-dim">{clip.duration}s</span>
                            <div className="flex items-center gap-2">
                              <div className={`text-sm font-bold ${clip.viral_score >= 90 ? 'text-neon-green' : clip.viral_score >= 70 ? 'text-primary' : 'text-dim'}`}>{clip.viral_score}</div>
                              <div className={`text-xs px-1.5 py-0.5 rounded ${clip.status === 'completed' ? 'bg-neon-green/10 text-neon-green' : 'bg-yellow-500/10 text-yellow-500'}`}>{clip.status === 'completed' ? 'Ready' : 'Processing'}</div>
                            </div>
                          </div>
                          {clip.hashtags && clip.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {clip.hashtags.slice(0, 4).map((tag, j) => <span key={j} className="text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded">{tag}</span>)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
