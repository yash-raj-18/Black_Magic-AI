export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  plan: 'free' | 'creator' | 'pro' | 'agency';
  stripe_customer_id: string | null;
  exports_used: number;
  exports_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  source_type: 'youtube' | 'upload' | 'transcript';
  source_url: string;
  title: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
  transcript: string;
  created_at: string;
}

export interface Clip {
  id: string;
  video_id: string;
  user_id: string;
  title: string;
  hook_text: string;
  viral_score: number;
  duration: number;
  captions: Caption[];
  effects: Record<string, unknown>;
  thumbnail_url: string;
  clip_url: string;
  status: 'generating' | 'completed' | 'failed';
  platform_optimizations: Record<string, unknown>;
  hashtags: string[];
  created_at: string;
}

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  platform_user_id: string;
  username: string;
  connected: boolean;
  created_at: string;
}

export interface PublishedClip {
  id: string;
  clip_id: string;
  social_account_id: string;
  user_id: string;
  platform_post_id: string;
  status: 'scheduled' | 'published' | 'failed';
  scheduled_at: string | null;
  published_at: string | null;
  engagement_stats: Record<string, number>;
  created_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  clip_id: string | null;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  viral_score: number;
  retention_rate: number;
  date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: 'creator' | 'pro' | 'agency';
  amount: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  payment_method: string;
  transaction_ref: string;
  verified_at: string | null;
  notes: string;
  created_at: string;
}

export type Plan = 'free' | 'creator' | 'pro' | 'agency';

export interface PricingPlan {
  id: Plan;
  name: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  highlight?: boolean;
  cta: string;
}
