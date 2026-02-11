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

// Helper do prostego parsowania Frontmatter
const parseMarkdownFile = (fileContent: string): PageContent | null => {
  try {
    const parts = fileContent.split('---');
    if (parts.length < 3) return null;

    const frontmatterRaw = parts[1];
    const body = parts.slice(2).join('---').trim();

    const data: any = {};
    frontmatterRaw.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        data[match[1]] = value;
      }
    });
    
    return {
      title: data.title || 'Bez tytułu',
      slug: data.slug || '/',
      heroImage: data.heroImage || '',
      body: body,
      sections: []
    };
  } catch (e) {
    console.error("Błąd parsowania pliku MD", e);
    return null;
  }
};

const INITIAL_MEDIA: MediaItem[] = [
  { id: '1', name: 'Antena Yagi', url: 'https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Radio Shack', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Mikrofon', url: 'https://images.unsplash.com/photo-1520263118671-663851065c71?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Spotkanie', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
];

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Record<string, PageContent>>(MOCK_PAGES);
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);

  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(INITIAL_MEDIA);

  // --- EFEKT: Ładowanie stron z plików CMS ---
  useEffect(() => {
    // 1. Ładowanie stron Markdown
    const markdownFiles = import.meta.glob('../src/content/pages/*.md', { query: '?raw', import: 'default' });

    const loadCmsPages = async () => {
      const cmsPages: Record<string, PageContent> = {};
      
      for (const path in markdownFiles) {
        try {
          const rawContent = await markdownFiles[path]() as string;
          const parsedPage = parseMarkdownFile(rawContent);
          if (parsedPage) {
            cmsPages[parsedPage.slug] = parsedPage;
          }
        } catch (e) {
          console.error(`Nie udało się załadować pliku: ${path}`, e);
        }
      }

      if (Object.keys(cmsPages).length > 0) {
        setPages(prev => ({
          ...prev,
          ...cmsPages
        }));
      }
    };

    loadCmsPages();

    // 2. Dynamiczne ładowanie nawigacji (JSON)
    // Używamy importu dynamicznego wewnątrz useEffect, aby błąd braku pliku nie przerywał buildu
    const loadNavigation = async () => {
      try {
        // Próbujemy zaimportować plik. Ścieżka jest relatywna do tego pliku (context/)
        // Jeśli plik jest w src/content/settings/navigation.json
        const navModule = await import('../src/content/settings/navigation.json');
        if (navModule.default && navModule.default.items) {
          setSiteConfig(prev => ({
            ...prev,
            navigation: navModule.default.items
          }));
        }
      } catch (e) {
        console.warn("Nie znaleziono pliku navigation.json lub błąd ładowania. Używam domyślnej konfiguracji.", e);
        // Nie robimy nic, zostaje domyślne SITE_CONFIG
      }
    };

    loadNavigation();

  }, []);

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