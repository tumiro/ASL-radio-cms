export interface NavigationItem {
  label: string;
  slug: string;
  children?: NavigationItem[];
}

export interface PageContent {
  title: string;
  slug: string;
  heroImage: string;
  body: string; // Markdown-like text or HTML
  sections?: {
    heading: string;
    content: string;
    image?: string;
  }[];
}

export interface SiteConfig {
  siteName: string;
  navigation: NavigationItem[];
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}