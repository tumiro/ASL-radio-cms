import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Layout, FileText, Settings, LogOut, Github, Search, PenTool, Save, Plus, Trash2, Image as ImageIcon, CheckSquare, ExternalLink, Bold, Italic, List, Type, Link as LinkIcon, LayoutGrid, Eye, Code as CodeIcon, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { PageContent } from '../types';

const AdminPanel: React.FC = () => {
  // Inicjalizacja stanu bezpośrednio z localStorage - eliminuje mignięcie ekranu logowania
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('localAdminLoggedIn') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content');
  
  const { 
    pages, updatePage, createPage, 
    siteConfig, updateSiteConfig,
    mediaLibrary, addMedia, removeMedia 
  } = useContent();
  
  // Page Editor State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [pageFormData, setPageFormData] = useState<PageContent | null>(null);
  const [addToMenu, setAddToMenu] = useState(false);
  
  // Preview Mode State for Editor
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  
  // Ref do textarea, aby móc wstawiać tekst w miejscu kursora
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Settings Editor State
  const [tempConfigJson, setTempConfigJson] = useState('');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Media State
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('localAdminLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('localAdminLoggedIn');
  };

  // --- HANDLERS: PAGES ---
  const handleEditClick = (slug: string) => {
    setEditingSlug(slug);
    setPageFormData({ ...pages[slug] });
    setShowHtmlPreview(false); // Zawsze zaczynamy od edycji kodu
    
    // Check if page is already in navigation
    const isInNav = siteConfig.navigation.some(item => item.slug === slug);
    setAddToMenu(isInNav);
  };

  const handleCreateNewPage = () => {
    const newPage: PageContent = {
      title: 'Nowa Strona',
      slug: '/nowa-strona',
      heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
      body: '<p>Wpisz treść tutaj...</p>',
      sections: []
    };
    setEditingSlug('NEW');
    setPageFormData(newPage);
    setAddToMenu(true);
    setShowHtmlPreview(false);
  };

  const handleSavePage = () => {
    if (pageFormData) {
      if (editingSlug === 'NEW') {
        createPage(pageFormData);
      } else if (editingSlug) {
        updatePage(editingSlug, pageFormData);
      }

      if (addToMenu) {
        const existsInNav = siteConfig.navigation.some(item => item.slug === pageFormData.slug);
        if (!existsInNav) {
          const newNavItem = {
            label: pageFormData.title,
            slug: pageFormData.slug
          };
          updateSiteConfig({
            ...siteConfig,
            navigation: [...siteConfig.navigation, newNavItem]
          });
        }
      }

      setEditingSlug(null);
      setPageFormData(null);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (pageFormData) {
      setPageFormData({
        ...pageFormData,
        [e.target.name]: e.target.value
      });
    }
  };

  // --- TOOLBAR HANDLERS (Logika wstawiania tagów) ---
  const insertTag = (startTag: string, endTag: string = '') => {
    if (!textAreaRef.current || !pageFormData) return;

    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    const newText = text.substring(0, start) + startTag + selection + endTag + text.substring(end);
    
    setPageFormData({
      ...pageFormData,
      body: newText
    });

    // Przywróć fokus i ustaw kursor po wstawionym tagu
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(start + startTag.length, end + startTag.length);
      }
    }, 0);
  };

  const insertTable = () => {
    const tableTemplate = `
<table>
  <thead>
    <tr>
      <th>Nagłówek 1</th>
      <th>Nagłówek 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dane 1</td>
      <td>Dane 2</td>
    </tr>
  </tbody>
</table>
`;
    insertTag(tableTemplate);
  };

  // --- HANDLERS: MEDIA ---
  const handleAddMedia = () => {
    if (!newImageUrl.trim()) return;
    addMedia({
      id: Date.now().toString(),
      name: 'Image ' + Date.now(),
      url: newImageUrl
    });
    setNewImageUrl('');
  };

  // --- HANDLERS: SETTINGS ---
  const handleInitSettings = () => {
    setActiveTab('settings');
    setTempConfigJson(JSON.stringify(siteConfig.navigation, null, 2));
    setSettingsMessage(null);
  };

  const handleSaveSettings = () => {
    try {
      const parsedNav = JSON.parse(tempConfigJson);
      updateSiteConfig({
        ...siteConfig,
        navigation: parsedNav
      });
      setSettingsMessage('Settings saved successfully!');
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (e) {
      setSettingsMessage('Error: Invalid JSON format');
    }
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gray-800 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Decap CMS</h1>
            <p className="text-gray-400">Panel zarządzania stroną SP-RADIO</p>
          </div>
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">Zaloguj się, aby edytować treści</p>
              <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200 mb-2">
                Wersja 2.5 (Fast Load)
              </div>
            </div>
            {/* ZIELONY PRZYCISK DLA WERYFIKACJI */}
            <button 
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-lg"
            >
              <Github className="w-5 h-5" />
              Zaloguj do Panelu v2.5
            </button>
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Symulacja uwierzytelniania</p>
              <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">← Wróć na stronę główną</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 text-white font-bold text-xl border-b border-gray-700">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">D</div>
          Decap CMS
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">Collections</div>
          <button 
            onClick={() => { setActiveTab('content'); setEditingSlug(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'content' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Pages</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'media' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Layout className="w-4 h-4" />
            <span>Media</span>
          </button>
          
          <button 
            onClick={handleInitSettings}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" className="w-8 h-8 rounded-full" />
            <div className="text-sm">
              <div className="text-white">Admin User</div>
              <div className="text-xs text-gray-500">Logged in via GitHub</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
          <Link to="/" className="block mt-4 text-xs text-blue-400 hover:underline flex items-center gap-1">
            View Live Site <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* --- CONTENT TAB: EDITOR --- */}
        {activeTab === 'content' && editingSlug && pageFormData && (
          <div className="flex-1 flex flex-col h-full bg-white animate-in slide-in-from-right-4 duration-200">
             {/* STICKY HEADER - Always visible */}
             <div className="sticky top-0 z-20 h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50 shadow-sm">
                <div className="flex items-center gap-4">
                   <h2 className="text-lg font-bold text-gray-800">
                      {editingSlug === 'NEW' ? 'Creating New Page' : `Editing: ${pageFormData.title}`}
                   </h2>
                   <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                      {pageFormData.slug}
                   </span>
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="outline" size="sm" onClick={() => { setEditingSlug(null); setPageFormData(null); }}>
                      Cancel
                   </Button>
                   <Button variant="primary" size="sm" onClick={handleSavePage} className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save
                   </Button>
                </div>
             </div>
             
             {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                         <input 
                            type="text" name="title" value={pageFormData.title} onChange={handlePageInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                         <input 
                            type="text" name="slug" value={pageFormData.slug} onChange={handlePageInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono bg-gray-50"
                         />
                      </div>
                   </div>

                   {/* Navigation Toggle */}
                   <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="addToNav"
                        checked={addToMenu} 
                        onChange={(e) => setAddToMenu(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="addToNav" className="text-sm font-medium text-blue-900 flex items-center gap-2 cursor-pointer">
                        <CheckSquare className="w-4 h-4" /> Add to Main Navigation Menu
                      </label>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                      <input 
                         type="text" name="heroImage" value={pageFormData.heroImage} onChange={handlePageInputChange}
                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      {/* Live Image Preview */}
                      {pageFormData.heroImage && (
                        <div className="mt-2 relative h-48 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                          <img src={pageFormData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" 
                               onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Image Preview</div>
                        </div>
                      )}
                   </div>
                   
                   {/* Rich Text Editor Toolbar area */}
                   <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-blue-700">Treść Strony (Edytor HTML)</label>
                        <button 
                          onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                          className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full font-medium transition-colors"
                        >
                           {showHtmlPreview ? <><CodeIcon className="w-3 h-3" /> Edytuj Kod</> : <><Eye className="w-3 h-3" /> Podgląd</>}
                        </button>
                      </div>
                      
                      {/* TOOLBAR - Zmiana koloru tła dla lepszej widoczności */}
                      {!showHtmlPreview && (
                        <div className="sticky top-0 md:top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-blue-50 border border-blue-200 border-b-0 rounded-t-md shadow-sm">
                          <span className="text-[10px] font-bold text-blue-400 mr-2 uppercase tracking-wider">Narzędzia:</span>
                          <button onClick={() => insertTag('<strong>', '</strong>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Bold"><Bold className="w-4 h-4"/></button>
                          <button onClick={() => insertTag('<em>', '</em>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Italic"><Italic className="w-4 h-4"/></button>
                          <div className="w-px h-5 bg-blue-200 mx-1"></div>
                          <button onClick={() => insertTag('<h2>', '</h2>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 font-bold text-xs w-8" title="H2 Header">H2</button>
                          <button onClick={() => insertTag('<h3>', '</h3>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 font-bold text-xs w-8" title="H3 Header">H3</button>
                          <div className="w-px h-5 bg-blue-200 mx-1"></div>
                          <button onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Bullet List"><List className="w-4 h-4"/></button>
                          <button onClick={() => insertTable()} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Insert Table"><LayoutGrid className="w-4 h-4"/></button>
                          <div className="w-px h-5 bg-blue-200 mx-1"></div>
                          <button onClick={() => insertTag('<a href="#">', '</a>')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Link"><LinkIcon className="w-4 h-4"/></button>
                          <button onClick={() => insertTag('<img src="', '" alt="Opis" />')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Image"><ImageIcon className="w-4 h-4"/></button>
                          <button onClick={() => insertTag('<br />')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-gray-700 transition-all" title="Line Break"><Type className="w-4 h-4"/></button>
                        </div>
                      )}

                      {showHtmlPreview ? (
                        <div className="w-full px-6 py-6 border border-gray-300 rounded-md bg-white min-h-[400px] html-content prose prose-lg prose-slate max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: pageFormData.body }} />
                        </div>
                      ) : (
                        <textarea 
                           ref={textAreaRef}
                           name="body" 
                           value={pageFormData.body} 
                           onChange={handlePageInputChange} 
                           rows={18}
                           className="w-full px-4 py-3 border border-blue-200 rounded-b-md focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                           placeholder="Type here. HTML tags supported."
                        ></textarea>
                      )}
                      
                      {!showHtmlPreview && (
                         <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                           <CodeIcon className="w-3 h-3" /> Jesteś w trybie edycji kodu HTML. Użyj paska powyżej, aby dodać formatowanie.
                         </p>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- CONTENT TAB: LIST --- */}
        {activeTab === 'content' && !editingSlug && (
          <>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
              <h2 className="text-xl font-bold text-gray-800">Pages Collection</h2>
              <Button size="sm" variant="primary" onClick={handleCreateNewPage} className="flex items-center gap-2">
                 <Plus className="w-4 h-4" /> New Entry
              </Button>
            </header>
            
            {/* INSTRUCTION BANNER */}
            <div className="bg-blue-50 border-b border-blue-100 p-4 px-8 flex items-start gap-3">
               <Info className="w-5 h-5 text-blue-600 mt-0.5" />
               <div className="text-sm text-blue-800">
                  <strong>Witaj w panelu v2.5!</strong> <br/>
                  Aby zobaczyć <strong>pasek narzędzi edycji</strong> i zmieniać treść, kliknij ikonę ołówka (<PenTool className="w-3 h-3 inline"/>) przy wybranej stronie poniżej.
               </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Search pages..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Slug</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.values(pages).map((page: PageContent) => (
                      <tr key={page.slug} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4"><div className="font-medium text-gray-900">{page.title}</div></td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{page.slug}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleEditClick(page.slug)} className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Edytuj stronę">
                            <PenTool className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* --- MEDIA TAB --- */}
        {activeTab === 'media' && (
           <>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
              <h2 className="text-xl font-bold text-gray-800">Media Library</h2>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Paste Image URL..." 
                   className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
                   value={newImageUrl}
                   onChange={(e) => setNewImageUrl(e.target.value)}
                 />
                 <Button size="sm" variant="primary" onClick={handleAddMedia} disabled={!newImageUrl}>
                    Upload URL
                 </Button>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-8 bg-gray-100">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {mediaLibrary.map(item => (
                     <div key={item.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden aspect-square">
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <button 
                             onClick={() => window.open(item.url, '_blank')}
                             className="p-2 bg-white rounded-full text-gray-800 hover:text-blue-600"
                             title="View"
                           >
                              <ImageIcon className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => removeMedia(item.id)}
                              className="p-2 bg-white rounded-full text-gray-800 hover:text-red-600"
                              title="Delete"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs truncate">
                           {item.name}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
           </>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
           <div className="flex-1 flex flex-col h-full bg-white">
               <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
                 <h2 className="text-xl font-bold text-gray-800">Global Settings</h2>
                 <Button size="sm" variant="primary" onClick={handleSaveSettings} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Configuration
                 </Button>
               </header>
               <div className="flex-1 overflow-auto p-8">
                  <div className="max-w-3xl mx-auto space-y-8">
                     
                     {settingsMessage && (
                       <div className={`p-4 rounded-md text-sm ${settingsMessage.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                          {settingsMessage}
                       </div>
                     )}

                     <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">General</h3>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                           <input 
                              type="text" 
                              value={siteConfig.siteName}
                              onChange={(e) => updateSiteConfig({...siteConfig, siteName: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                           />
                           <p className="text-xs text-gray-500 mt-1">Appears in Navbar and Footer.</p>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Navigation Menu (JSON)</h3>
                        <p className="text-sm text-gray-600 mb-4">
                           Edit the JSON structure below to change the website navigation. 
                           <strong> Warning:</strong> Invalid JSON will prevent the menu from loading.
                        </p>
                        <textarea 
                           rows={15}
                           value={tempConfigJson}
                           onChange={(e) => setTempConfigJson(e.target.value)}
                           className="w-full p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                     </div>

                  </div>
               </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;