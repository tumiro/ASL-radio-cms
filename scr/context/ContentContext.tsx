import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MOCK_PAGES, SITE_CONFIG } from '../constants';
import { PageContent, SiteConfig, MediaItem } from '../types';
import navigationData from '../content/settings/navigation.json';

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

// Ulepszona funkcja parsująca pliki Markdown (odporna na różne znaki nowej linii)
const parseMarkdownFile = (fileContent: string): PageContent => {
  if (!fileContent) return { title: 'Błąd', slug: '/error', heroImage: '', body: '' };

  // Normalizacja znaków nowej linii (CRLF -> LF) dla Windowsa
  const normalizedContent = fileContent.replace(/\r\n/g, '\n');

  // Próba podziału pliku na części: [pusta, frontmatter, treść]
  const parts = normalizedContent.split(/^---$/m);

  if (parts.length >= 3) {
    const yamlContent = parts[1].trim();
    // Cała reszta to treść (łączymy z powrotem, jeśli w treści też były ---)
    const body = parts.slice(2).join('---').trim();

    const metadata: Record<string, string> = {};
    
    // Prosty parser YAML (linia po linii)
    yamlContent.split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex > -1) {
        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();
        // Usuń cudzysłowy jeśli istnieją
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        metadata[key] = value;
      }
    });

    return {
      title: metadata.title || 'Bez tytułu',
      slug: metadata.slug || '/',
      heroImage: metadata.heroImage || '',
      body: body,
      sections: []
    };
  }

  // Fallback: jeśli formatowanie jest inne niż oczekiwane
  return { title: 'Błąd formatowania pliku', slug: '/error-format', heroImage: '', body: fileContent, sections: [] };
};

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stan początkowy
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  
  // Inicjalizacja konfiguracji z pliku JSON lub fallback
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: SITE_CONFIG.siteName,
    navigation: (navigationData as any).items || SITE_CONFIG.navigation
  });
  
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(INITIAL_MEDIA);

  // Efekt: Wczytaj pliki Markdown przy starcie aplikacji
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Vite glob import - kluczowy element łączący pliki z kodem
        // Importujemy jako surowy tekst (?raw), żeby samemu sparsować
        const modules = (import.meta as any).glob('../content/pages/*.md', { query: '?raw', import: 'default' });
        
        const loadedPages: Record<string, PageContent> = {};
        let filesCount = 0;

        for (const path in modules) {
          try {
            // Wywołanie funkcji importującej
            const rawContent = await modules[path]() as string;
            const parsedPage = parseMarkdownFile(rawContent);
            
            // Jeśli parsowanie się udało i mamy slug, dodaj do stanu
            if (parsedPage.slug) {
              loadedPages[parsedPage.slug] = parsedPage;
              filesCount++;
            }
          } catch (e) {
            console.error(`Błąd wczytywania pliku ${path}:`, e);
          }
        }

        if (filesCount > 0) {
          console.log(`[ContentContext] Wczytano ${filesCount} stron z plików .md`);
          setPages(loadedPages);
        } else {
          console.warn("[ContentContext] Nie znaleziono plików .md, używam danych przykładowych.");
          setPages(MOCK_PAGES);
        }

      } catch (error) {
        console.error("Krytyczny błąd ładowania treści:", error);
        setPages(MOCK_PAGES);
      }
    };

    loadContent();
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