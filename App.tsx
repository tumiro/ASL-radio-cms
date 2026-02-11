import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageRenderer from './components/PageRenderer';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import { ContentProvider } from './context/ContentContext';

// Komponent wymuszający przejście do statycznego pliku Decap CMS
// Rozwiązuje problem, gdy Router SPA "przejmuje" ścieżkę /admin
const DecapCMSRedirect: React.FC = () => {
  React.useEffect(() => {
    // Twarde przekierowanie do pliku index.html w folderze admin
    window.location.href = '/admin/index.html';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Ładowanie Decap CMS...</h2>
        <p className="text-gray-400 mt-2 text-sm">Przekierowywanie do panelu zarządzania...</p>
      </div>
    </div>
  );
};

// Komponent layoutu, który warunkowo wyświetla Navbar i Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Ukryj elementy UI dla ścieżek admina
  const isAdminRoute = location.pathname.startsWith('/local-admin') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          {/* Version Indicator */}
          <div className="bg-gray-900 text-gray-700 text-[10px] text-center py-1">
            Build: v2.6 (Stable)
          </div>
        </>
      )}
      
      {/* Widget czatu tylko na stronie głównej, nie w adminie */}
      {!isAdminRoute && <ChatWidget />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ContentProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Wewnętrzny panel React (Custom Admin) - Tu jest Toolbar! */}
            <Route path="/local-admin" element={<AdminPanel />} />
            
            {/* Przekierowanie dla Decap CMS */}
            <Route path="/admin" element={<DecapCMSRedirect />} />
            <Route path="/admin/*" element={<DecapCMSRedirect />} />

            {/* Obsługa wszystkich innych stron przez system renderowania treści */}
            <Route path="*" element={<PageRenderer />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ContentProvider>
  );
};

export default App;