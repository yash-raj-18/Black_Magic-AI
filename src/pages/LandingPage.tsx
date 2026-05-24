import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import SocialProof from '../components/landing/SocialProof';
import CTA from '../components/landing/CTA';
import SEOHead from '../components/shared/SEOHead';

export default function LandingPage() {
  return (
    <main>
      <SEOHead
        title="Black Magic AI - Turn Any Video Into Viral Shorts with AI | Free Trial"
        description="Black Magic AI automatically transforms long videos into engaging viral-ready clips optimized for YouTube Shorts, TikTok, Instagram Reels, and more. AI-powered viral clip detection, auto captions, smart reframing, and social media automation."
        keywords="AI video editing, viral shorts generator, YouTube Shorts AI, TikTok video maker, Instagram Reels creator, AI clip generator, video automation, Black Magic AI"
        canonical="https://black-magic-ai.app/"
        ogImage="https://images.pexels.com/photos/2873485/pexels-photo-2873485.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      <Hero />
      <Features />
      <HowItWorks />
      <SocialProof />
      <CTA />
    </main>
  );
}
