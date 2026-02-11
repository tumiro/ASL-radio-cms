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

// Funkcja parsująca pliki Markdown (Frontmatter + Treść)
const parseMarkdownFile = (fileContent: string): PageContent => {
  // Regex do wyciągnięcia YAML frontmattera (pomiędzy --- a ---)
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    // Jeśli plik nie ma poprawnego formatu, zwróć błąd jako treść
    return { title: 'Błąd formatowania', slug: '/error', heroImage: '', body: fileContent };
  }

  const yamlContent = match[1];
  const body = match[2].trim();

  const metadata: Record<string, string> = {};
  
  // Prosty parser YAML (klucz: wartość)
  yamlContent.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
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
    sections: [] // CMS w tym trybie zarządza głównie body, sekcje są opcjonalne
  };
};

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stan początkowy
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);
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
            
            // Jeśli parsowanie się udało, dodaj do stanu
            if (parsedPage.slug) {
              loadedPages[parsedPage.slug] = parsedPage;
              filesCount++;
            }
          } catch (e) {
            console.error(`Błąd wczytywania pliku ${path}:`, e);
          }
        }

        if (filesCount > 0) {
          console.log(`Wczytano ${filesCount} stron z systemu plików.`);
          setPages(loadedPages);
        } else {
          // Fallback: Jeśli nie znaleziono plików .md, użyj stałych (dla bezpieczeństwa)
          console.warn("Nie znaleziono plików .md, używam danych zapasowych.");
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