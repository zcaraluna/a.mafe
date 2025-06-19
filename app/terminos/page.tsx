"use client";
import NavBar from '../../components/NavBar';
import { useLanguage } from '../../components/LanguageSelector';

export default function Terminos() {
  const { language } = useLanguage();

  const translations = {
    es: {
      title: "Página en construcción",
      message: "Pronto estará disponible el contenido de esta sección."
    },
    en: {
      title: "Page under construction",
      message: "Content for this section will be available soon."
    },
    gn: {
      title: "Kuatiarogue oñemopu'ãva",
      message: "Ko tenda retaite oñemboaje pya'e."
    },
    pt: {
      title: "Página em construção",
      message: "O conteúdo desta seção estará disponível em breve."
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-48 mb-6">
        <img
          src="/src/Gobierno_del_Paraguay_Palacio.jpg"
          alt="Gobierno del Paraguay"
          className="w-full h-48 object-cover"
        />
        <img
          src="/src/pn.png"
          alt="Policía Nacional"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-28 w-auto"
          style={{ zIndex: 10 }}
        />
      </div>
      <main className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-yellow-50 border border-yellow-300 rounded shadow p-8 mt-12 text-center flex flex-col items-center max-w-md">
          <span className="text-5xl mb-4">🚧</span>
          <h1 className="text-2xl font-bold mb-2 text-yellow-800">{t.title}</h1>
          <p className="text-gray-700 text-base">{t.message}</p>
        </div>
      </main>
    </div>
  );
} 