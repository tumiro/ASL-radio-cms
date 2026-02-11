import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MOCK_PAGES, SITE_CONFIG } from '../constants';
import { PageContent, SiteConfig, MediaItem } from '../types';

interface ContentContextType {
  pages: Record<string, PageContent>;
  updatePage: (originalSlug: string, newPageData: PageContent) => void;
  createPage: (newPageData: PageContent) => void;
  deletePage: (slug: string) => void;
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: SiteConfig) => void;
  mediaLibrary: MediaItem[];
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const INITIAL_MEDIA: MediaItem[] = [
  { id: '1', name: 'Antena Yagi', url: 'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Radio Shack', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Mikrofon', url: 'https://images.unsplash.com/photo-1520263118671-663851065c71?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Spotkanie', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
];

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize directly from constants to prevent "glob is not a function" error
  const [pages, setPages] = useState<Record<string, PageContent>>(MOCK_PAGES);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(INITIAL_MEDIA);

  // NOTE: We have removed the dynamic import.meta.glob logic.
  // This ensures the application runs stably in all environments.
  // In a real production setup with Decap CMS, the build process would need 
  // to regenerate the 'constants' or a JSON file based on the Markdown content.

  const updatePage = (originalSlug: string, newPageData: PageContent) => {
    setPages((prevPages) => {
      const newPages = { ...prevPages };
      if (originalSlug !== newPageData.slug) {
        delete newPages[originalSlug];
      }
      newPages[newPageData.slug] = newPageData;
      return newPages;
    });
  };

  const createPage = (newPageData: PageContent) => {
    setPages((prevPages) => ({
      ...prevPages,
      [newPageData.slug]: newPageData,
    }));
  };

  const deletePage = (slug: string) => {
    setPages((prevPages) => {
      const newPages = { ...prevPages };
      delete newPages[slug];
      return newPages;
    });
  };

  const updateSiteConfig = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  };

  const addMedia = (item: MediaItem) => {
    setMediaLibrary(prev => [item, ...prev]);
  };

  const removeMedia = (id: string) => {
    setMediaLibrary(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ContentContext.Provider value={{ 
      pages, updatePage, createPage, deletePage,
      siteConfig, updateSiteConfig,
      mediaLibrary, addMedia, removeMedia
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};