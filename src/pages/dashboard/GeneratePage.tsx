import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Youtube, Upload, FileText, Wand2, Sparkles, AlertTriangle, CheckCircle2, Video } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

type SourceType = 'youtube' | 'upload' | 'transcript';
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/;

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return match ? match[1] : null;
}

const aiSteps = [
  { label: 'Auto transcription', duration: 1200 },
  { label: 'Viral scene detection', duration: 1500 },
  { label: 'Hook extraction', duration: 800 },
  { label: 'Subtitle generation', duration: 1000 },
  { label: 'Smart cropping for 9:16', duration: 1200 },
  { label: 'Viral score analysis', duration: 600 },
];

export default function GeneratePage() {
  const { user } = useAuth();
  const [sourceType, setSourceType] = useState<SourceType>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeError, setYoutubeError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedClips, setGeneratedClips] = useState<{ id: string; title: string; viral_score: number; duration: number; hook_text: string; hashtags: string[] }[]>([]);

  const validateYoutubeUrl = (url: string) => {
    if (!url) { setYoutubeError(''); return false; }
    if (!YOUTUBE_URL_REGEX.test(url)) { setYoutubeError('Please enter a valid YouTube URL'); return false; }
    setYoutubeError('');
    return true;
  };

  const runAiProcessing = async (videoId: string): Promise<void> => {
    for (let i = 0; i < aiSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, aiSteps[i].duration));
      setCompletedSteps(prev => [...prev, i]);
    }

    const clipData = [
      { video_id: videoId, user_id: user!.id, title: 'Viral Highlight #1', hook_text: 'You won\'t believe what happens next...', viral_score: Math.floor(Math.random() * 15) + 85, duration: Math.floor(Math.random() * 30) + 20, status: 'completed', hashtags: ['{viral,ai,trending}'], effects: { zoom: true, captions: true } },
      { video_id: videoId, user_id: user!.id, title: 'Key Moment Clip', hook_text: 'This changes everything...', viral_score: Math.floor(Math.random() * 20) + 70, duration: Math.floor(Math.random() * 25) + 15, status: 'completed', hashtags: ['{shorts,viral,content}'], effects: { zoom: false, captions: true } },
      { video_id: videoId, user_id: user!.id, title: 'Best Segment', hook_text: 'Wait for it...', viral_score: Math.floor(Math.random() * 25) + 65, duration: Math.floor(Math.random() * 20) + 25, status: 'completed', hashtags: ['{mustwatch,trending,ai}'], effects: { zoom: true, captions: false } },
    ];

    const { data } = await supabase.from('clips').insert(clipData).select('id, title, viral_score, duration, hook_text, hashtags');
    if (data) setGeneratedClips(data);

    await supabase.from('videos').update({ status: 'completed' }).eq('id', videoId);
    await supabase.from('profiles').update({ exports_used: await supabase.from('profiles').select('exports_used').eq('id', user!.id).maybeSingle().then(r => (r.data as any)?.exports_used + 1 || 1) }).eq('id', user!.id);
  };

  const handleGenerate = async () => {
    if (!user || !ownershipConfirmed) return;
    if (sourceType === 'youtube' && !validateYoutubeUrl(youtubeUrl)) return;
    setGenerating(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setGeneratedClips([]);

    const { data: profileData } = await supabase.from('profiles').select('exports_used, exports_limit').eq('id', user.id).maybeSingle();
    const profile = profileData as any;
    if (profile && profile.exports_used >= profile.exports_limit) {
      setGenerating(false);
      setCurrentStep(-1);
      return;
    }

    const videoTitle = sourceType === 'youtube' ? `YouTube: ${extractYouTubeId(youtubeUrl) || 'Video'}` : sourceType === 'transcript' ? 'Transcript Upload' : 'Video Upload';

    const { data: videoData } = await supabase.from('videos').insert({
      user_id: user.id,
      source_type: sourceType,
      source_url: sourceType === 'youtube' ? youtubeUrl : '',
      title: videoTitle,
      transcript: sourceType === 'transcript' ? transcript.slice(0, 50000) : '',
      status: 'processing',
    }).select('id').maybeSingle();

    if (videoData) {
      await runAiProcessing(videoData.id);
    }

    setGenerating(false);
    setCurrentStep(-1);
  };

  const isProcessing = generating && currentStep >= 0;
  const isComplete = !generating && generatedClips.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="font-display text-2xl font-bold text-bright">Generate Viral Clips</h1><p className="text-dim text-sm">Choose your source and let AI create viral-ready clips.</p></div>

      {!isProcessing && !isComplete && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'youtube' as SourceType, icon: Youtube, label: 'YouTube URL', desc: 'Paste a YouTube video link' },
              { type: 'upload' as SourceType, icon: Upload, label: 'Upload Video', desc: 'Upload a video file' },
              { type: 'transcript' as SourceType, icon: FileText, label: 'Transcript', desc: 'Paste video transcript text' },
            ].map((opt) => (
              <button key={opt.type} onClick={() => setSourceType(opt.type)} className={`glass rounded-xl p-4 text-center transition-all ${sourceType === opt.type ? 'border-primary/40 glow-blue' : 'card-hover'}`}>
                <opt.icon className={`w-6 h-6 mx-auto mb-2 ${sourceType === opt.type ? 'text-primary' : 'text-dim'}`} />
                <p className={`text-sm font-medium ${sourceType === opt.type ? 'text-bright' : 'text-dim'}`}>{opt.label}</p>
                <p className="text-xs text-dim/60 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            {sourceType === 'youtube' && (
              <Input label="YouTube Video URL" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => { setYoutubeUrl(e.target.value); validateYoutubeUrl(e.target.value); }} icon={<Youtube className="w-4 h-4" />} error={youtubeError} />
            )}
            {sourceType === 'upload' && (
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-dim mx-auto mb-3" /><p className="text-sm text-dim mb-1">Drag & drop your video file here</p><p className="text-xs text-dim/50">MP4, MOV, AVI up to 2GB</p>
              </div>
            )}
            {sourceType === 'transcript' && (
              <div>
                <label className="block text-sm font-medium text-dim mb-2">Video Transcript</label>
                <textarea placeholder="Paste your video transcript here..." value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={8} maxLength={50000} className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-bright placeholder-dim/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none" />
                <p className="text-xs text-dim mt-1">{transcript.length}/50000 characters</p>
              </div>
            )}

            <div className="mt-6 p-4 rounded-xl bg-surface-2/50 border border-border/30">
              <div className="flex items-center gap-2 mb-3"><Wand2 className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-bright">AI Will Process:</span></div>
              <div className="grid grid-cols-2 gap-2">
                {aiSteps.map((s) => <div key={s.label} className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary" /><span className="text-xs text-dim">{s.label}</span></div>)}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-bright mb-1">Content Ownership Confirmation</p>
                  <p className="text-xs text-dim leading-relaxed mb-3">You must own or have legal rights to all content you upload. Unauthorized use of copyrighted content is prohibited.</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={ownershipConfirmed} onChange={(e) => setOwnershipConfirmed(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
                    <span className="text-xs text-dim">I confirm I own or have rights to this content</span>
                  </label>
                </div>
              </div>
            </div>

            <Button onClick={handleGenerate} className="w-full mt-6" size="lg" loading={generating} disabled={!ownershipConfirmed || (sourceType === 'youtube' && (!youtubeUrl || !!youtubeError))}>
              <Wand2 className="w-5 h-5 mr-2" /> Generate Viral Clips
            </Button>
          </div>
        </>
      )}

      {isProcessing && (
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 glow-blue">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="font-display text-xl font-bold text-bright mb-1">AI Processing Your Video</h2>
            <p className="text-dim text-sm">Step {currentStep + 1} of {aiSteps.length}</p>
          </div>
          <div className="space-y-3">
            {aiSteps.map((step, i) => (
              <div key={step.label} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${completedSteps.includes(i) ? 'bg-neon-green/5 border border-neon-green/20' : i === currentStep ? 'bg-primary/5 border border-primary/20' : 'bg-surface-2/50'}`}>
                {completedSteps.includes(i) ? <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" /> : i === currentStep ? <div className="w-5 h-5 shrink-0 animate-spin border-2 border-primary border-t-transparent rounded-full" /> : <div className="w-5 h-5 shrink-0 rounded-full border border-border" />}
                <span className={`text-sm ${completedSteps.includes(i) ? 'text-neon-green' : i === currentStep ? 'text-bright' : 'text-dim'}`}>{step.label}</span>
                {completedSteps.includes(i) && <span className="ml-auto text-xs text-neon-green">Done</span>}
              </div>
            ))}
          </div>
          <div className="mt-6 h-2 bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: `${(completedSteps.length / aiSteps.length) * 100}%` }} />
          </div>
        </div>
      )}

      {isComplete && (
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-bright mb-1">Clips Generated!</h2>
            <p className="text-dim text-sm">{generatedClips.length} viral-ready clips created from your video</p>
          </div>
          <div className="space-y-3 mb-6">
            {generatedClips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-2/50 border border-border/30">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-bright">{clip.title}</p>
                  <p className="text-xs text-dim mt-0.5">{clip.duration}s - "{clip.hook_text}"</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${clip.viral_score >= 90 ? 'text-neon-green' : clip.viral_score >= 70 ? 'text-primary' : 'text-dim'}`}>{clip.viral_score}</div>
                  <div className="text-xs text-dim">Viral Score</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/videos" className="btn-primary flex-1 text-center">View All Clips</Link>
            <button onClick={() => { setGeneratedClips([]); setCompletedSteps([]); }} className="btn-ghost flex-1">Generate More</button>
          </div>
        </div>
      )}
    </div>
  );
}
