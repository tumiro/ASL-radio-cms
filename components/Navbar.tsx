import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Radio } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Navbar: React.FC = () => {
  const { siteConfig } = useContent();
  const config = siteConfig; // Alias for cleaner code below

  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  const toggleMobileSubmenu = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mobileExpanded === label) {
      setMobileExpanded(null);
    } else {
      setMobileExpanded(label);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl relative">
      
      {/* Animated 'Scanner' Line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-800"></div>
      <div className="animate-scan z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center group cursor-pointer z-50">
            <div className="mr-2 p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
               <Radio className="h-5 w-5 text-white" />
            </div>
            <NavLink to="/" className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center">
              {config.siteName}
              <span className="hidden md:inline-block ml-2 text-xs font-normal text-blue-400 border border-blue-900/50 bg-blue-900/20 px-2 py-0.5 rounded-full">
                ON AIR
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {config.navigation.map((item) => (
              <div key={item.label} className="relative group px-3 py-2">
                <div className="flex items-center">
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 flex items-center ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-300 group-hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {item.children && (
                    <ChevronDown className="ml-1 h-3 w-3 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:rotate-180" />
                  )}
                </div>

                {/* Dropdown Menu (Hover) */}
                {item.children && (
                  <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                    <div className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.slug}
                          to={child.slug}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm transition-colors border-l-2 ${
                              isActive 
                                ? 'bg-slate-800 text-blue-400 border-blue-500' 
                                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white hover:border-slate-600'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* CTA Button */}
            <div className="ml-4 pl-4 border-l border-slate-700">
              <NavLink to="/admin" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40">
                Logbook / CMS
              </NavLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-5 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {config.navigation.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between w-full px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">
                      <NavLink 
                        to={item.slug} 
                        className={({ isActive }) => isActive ? 'text-white' : 'text-slate-300'}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                      <button 
                        onClick={(e) => toggleMobileSubmenu(item.label, e)}
                        className="p-2 -mr-2 text-slate-500 hover:text-white"
                      >
                         <ChevronDown className={`h-4 w-4 transform transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {mobileExpanded === item.label && (
                      <div className="pl-4 space-y-1 bg-slate-950/50 py-2 rounded-md">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.slug}
                            to={child.slug}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive 
                                  ? 'text-blue-400 bg-slate-800/50' 
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                        isActive 
                          ? 'text-blue-400 bg-slate-800 border-l-4 border-blue-500' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
            <div className="border-t border-slate-800 mt-4 pt-4">
               <NavLink 
                to="/admin" 
                className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-md font-medium"
               >
                 Panel Admina
               </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;