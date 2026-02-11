import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import Button from './ui/Button';

const PageRenderer: React.FC = () => {
  const location = useLocation();
  const { pages } = useContent();
  
  // Decode the pathname to handle special chars if any
  const slug = location.pathname;
  
  // Normalizacja sluga (usuwa ewentualny slash na końcu, jeśli to nie strona główna)
  const normalizedSlug = slug.length > 1 && slug.endsWith('/') ? slug.slice(0, -1) : slug;
  
  const content = pages[normalizedSlug];

  if (!content) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Nie znaleziono strony ({normalizedSlug}).</p>
        <Button onClick={() => window.history.back()} variant="outline">Wróć</Button>
      </div>
    );
  }

  // Funkcja sprawdzająca, czy treść wygląda na HTML (zawiera znaczniki)
  const isHtml = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text);

  return (
    <div className="animate-in fade-in duration-500 pb-16">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img 
          src={content.heroImage} 
          alt={content.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm drop-shadow-md">
              {content.title}
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose prose-lg prose-slate mx-auto text-gray-600">
          
          {/* Logic: Jeśli tekst zawiera HTML, renderuj go jako HTML. W przeciwnym razie jako tekst z zachowaniem linii */}
          {isHtml(content.body) ? (
             <div dangerouslySetInnerHTML={{ __html: content.body }} />
          ) : (
             <p className="text-xl leading-relaxed text-gray-700 font-light mb-8 whitespace-pre-line">
               {content.body}
             </p>
          )}

        </div>

        {/* Dynamic Sections (Legacy support for structured data) */}
        {content.sections && content.sections.length > 0 && (
          <div className="mt-16 space-y-20">
            {content.sections.map((section, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}
              >
                {section.image && (
                  <div className="w-full md:w-1/2 group">
                    <div className="overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src={section.image} 
                        alt={section.heading} 
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-4">{section.heading}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageRenderer;