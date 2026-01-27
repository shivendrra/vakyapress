export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string; // Markdown or HTML
  author: string;
  authorImage?: string;
  category: string;
  tags?: string[]; // Added tags support
  imageUrl: string;
  publishedAt: string;
  featured?: boolean;
}

export type UserRole = 'audience' | 'writer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  preferences?: {
    mutedTopics?: string[];
    emailNotifications?: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

// New Types for Content Management
export interface Video {
  id: number;
  title: string;
  url: string; // YouTube URL
  thumbnail: string;
  duration: string;
  type: string;
}

export interface PageContent {
  title: string;
  content: string;
  lastUpdated?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  skills: string; // Comma separated
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  linkedinUrl: string;
  portfolioUrl: string; // GitHub, Blog, Portfolio etc.
  resumeUrl: string;
  pitch: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface StaffProfile {
  id: string; // Slug (e.g. swati-sharma)
  name: string;
  title: string; // e.g. Editor-in-Chief
  department: 'Editorial' | 'Creative' | 'Production' | 'Tech' | 'Management';
  bio: string;
  image: string;
  email: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
    substack?: string;
  };
  accessLevel: UserRole; // This controls their login permission
}

export interface SiteContent {
  videos: Video[];
  pages: Record<string, PageContent>;
  jobs: JobPosting[];
}

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

// Navigation Types
export type ViewState =
  | 'landing'
  | 'articles'
  | 'article_detail'
  | 'store'
  | 'about'
  | 'contact'
  | 'auth'
  | 'admin_dashboard'
  | 'writer_profile'
  | 'user_profile'
  | 'ethics'
  | 'financials'
  | 'pitch'
  | 'careers'
  | 'privacy'
  | 'terms'
  | 'cookie_policy'
  | 'privacy_settings'
  | 'licensing'
  | 'accessibility';