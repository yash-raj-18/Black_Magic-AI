import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { SocialAccount } from '../../types';
import { Youtube, Twitter, Instagram, Facebook, Linkedin, Plus, CheckCircle2, Link2, Unlink } from 'lucide-react';

const platforms: { id: SocialAccount['platform']; icon: typeof Youtube; label: string; color: string }[] = [
  { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-500' },
  { id: 'tiktok', icon: Youtube, label: 'TikTok', color: 'text-pink-400' },
  { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-orange-400' },
  { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
  { id: 'twitter', icon: Twitter, label: 'X / Twitter', color: 'text-sky-400' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600' },
];

export default function SocialPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!user) return;
    const { data } = await supabase.from('social_accounts').select('id, user_id, platform, platform_user_id, username, connected, created_at').eq('user_id', user.id);
    if (data) setAccounts(data as SocialAccount[]);
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      await fetchAccounts();
      setLoading(false);
    })();
  }, [user]);

  const handleConnect = async (platform: string) => {
    if (!user) return;
    setConnecting(platform);

    const platformUserMap: Record<string, string> = {
      youtube: 'youtube_creator',
      tiktok: 'tiktok_creator',
      instagram: 'ig_creator',
      facebook: 'fb_page',
      twitter: 'x_creator',
      linkedin: 'li_creator',
    };

    const { error } = await supabase.from('social_accounts').insert({
      user_id: user.id,
      platform,
      platform_user_id: crypto.randomUUID().slice(0, 8),
      username: platformUserMap[platform] || `${platform}_user`,
      connected: true,
    });

    if (!error) await fetchAccounts();
    setConnecting(null);
  };

  const handleDisconnect = async (id: string) => {
    if (!user) return;
    setDisconnecting(id);
    const { error } = await supabase.from('social_accounts').delete().eq('id', id).eq('user_id', user.id);
    if (!error) setAccounts(accounts.filter((a) => a.id !== id));
    setDisconnecting(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const connectedCount = accounts.filter(a => a.connected).length;

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-bright">Social Accounts</h1><p className="text-dim text-sm">{connectedCount > 0 ? `${connectedCount} platform${connectedCount > 1 ? 's' : ''} connected` : 'Connect your platforms for automated publishing'}</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, i) => {
          const account = accounts.find((a) => a.platform === platform.id && a.connected);
          const isConnecting = connecting === platform.id;
          const isDisconnecting = account && disconnecting === account.id;

          return (
            <motion.div key={platform.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center"><platform.icon className={`w-5 h-5 ${platform.color}`} /></div>
                <div><h3 className="text-sm font-medium text-bright">{platform.label}</h3></div>
                {account && <CheckCircle2 className="w-5 h-5 text-neon-green ml-auto" />}
              </div>

              {account ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neon-green"><Link2 className="w-3 h-3" /> Connected as @{account.username}</div>
                  <p className="text-xs text-dim">Connected {new Date(account.created_at).toLocaleDateString()}</p>
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    disabled={isDisconnecting}
                    className="text-xs text-accent/70 hover:text-accent flex items-center gap-1 transition-colors"
                  >
                    <Unlink className="w-3 h-3" />
                    {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  disabled={isConnecting}
                  className="btn-ghost text-xs w-full !py-2 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="font-display font-semibold text-bright mb-3">Auto-Publishing Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Cross-platform publishing',
            'Smart scheduling with best posting times',
            'Auto hashtag insertion',
            'Draft system for review',
            'Bulk upload capability',
            'Engagement tracking per platform',
          ].map((f) => <div key={f} className="flex items-center gap-2 text-sm text-dim"><CheckCircle2 className="w-4 h-4 text-neon-green shrink-0" />{f}</div>)}
        </div>
      </div>
    </div>
  );
}
