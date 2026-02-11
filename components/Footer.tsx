import React from 'react';
import { Radio, Mail, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Footer: React.FC = () => {
  const { siteConfig } = useContent();

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
               <Radio className="h-5 w-5" /> {siteConfig.siteName}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Promujemy krótkofalarstwo jako hobby techniczne i sposób na poznawanie świata. 
              Dołącz do nas na pasmach KF i UKF. Vy 73!
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Na Skróty</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/klub" className="hover:text-blue-400 transition-colors">O Klubie</Link></li>
              <li><Link to="/aktywnosc" className="hover:text-blue-400 transition-colors">Aktywność</Link></li>
              <li><Link to="/kontakt" className="hover:text-blue-400 transition-colors">QSL Bureau</Link></li>
              <li><a href="https://pzk.org.pl" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Polski Związek Krótkofalowców</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Kontakt</h3>
            <div className="flex flex-col space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>ul. Radiowa 73, 00-001 Warszawa</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>klub@sp-radio.pl</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-blue-500" />
                <span>145.500 MHz (FM)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.siteName}. Vy 73 de SP0DX.
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/admin" className="flex items-center gap-1 hover:text-gray-300 transition-colors" title="Panel Administratora">
              <Lock className="h-3 w-3" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;