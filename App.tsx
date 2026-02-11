import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageRenderer from './components/PageRenderer';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import { ContentProvider } from './context/ContentContext';

// Komponent layoutu, który warunkowo wyświetla Navbar i Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isAdminRoute && <Footer />}
      
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
            <Route path="/admin" element={<AdminPanel />} />
            {/* 
              We use a wildcard route to handle all slugs defined in our mock content.
              In a real CMS setup, you might generate these routes statically.
            */}
            <Route path="*" element={<PageRenderer />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ContentProvider>
  );
};

export default App;