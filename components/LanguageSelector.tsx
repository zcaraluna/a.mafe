'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
export const LanguageContext = createContext({
  language: 'es',
  setLanguage: (lang: string) => {},
});

// Hook personalizado para usar el idioma
export const useLanguage = () => useContext(LanguageContext);

// Componente proveedor del contexto
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

const LANGUAGES = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'gn', flag: '🇵🇾', label: 'Guaraní' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    const lastAccepted = localStorage.getItem('langAcceptedAt');
    const now = Date.now();
    if (!savedLang || !lastAccepted || now - parseInt(lastAccepted, 10) > 2 * 60 * 60 * 1000) {
      setShowModal(true);
    } else if (savedLang !== language) {
      setLanguage(savedLang);
    }
    // eslint-disable-next-line
  }, []);

  const handleSelect = (lang: string) => {
    if (!accepted) return;
    setLanguage(lang);
    localStorage.setItem('lang', lang);
    localStorage.setItem('langAcceptedAt', Date.now().toString());
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">
              Selecciona tu idioma<br />
              <span className="text-sm font-normal">Select your language / Eiporavo ne ñe'ẽ / Selecione seu idioma</span>
            </h2>
            <div className="flex gap-4 mb-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`flex flex-col items-center px-4 py-2 rounded hover:bg-blue-100 focus:outline-none ${!accepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={l.label}
                  disabled={!accepted}
                >
                  <span style={{ fontSize: '2rem' }}>{l.flag}</span>
                  <span className="mt-1 text-base font-medium">{l.label}</span>
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="accent-blue-600"
              />
              <span className="text-sm">
                Acepto los{' '}
                <a
                  href="/terminos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  términos y condiciones
                </a>
                {' '}que implican utilizar esta página
              </span>
            </label>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => handleSelect(l.code)}
            className={`px-2 py-1 rounded ${
              language === l.code ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            aria-label={l.label}
          >
            {l.flag}
          </button>
        ))}
      </div>
    </>
  );
} 