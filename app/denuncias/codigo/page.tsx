"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageSelector';
import PDFGenerator from '../../components/PDFGenerator';
import NavBar from '../../../components/NavBar';

const textos = {
  es: {
    titulo: "Acceder a mi denuncia",
    subtitulo: "Ingrese su código de seguimiento para acceder a su denuncia",
    codigo: "Código de seguimiento:",
    placeholder: "Ej: DEN-20250101-ABC123",
    buscar: "Buscar denuncia",
    cargando: "Buscando denuncia...",
    errorNoEncontrada: "No se encontró una denuncia con ese código",
    errorGeneral: "Error al buscar la denuncia",
    volver: "Volver a buscar",
    nuevaBusqueda: "Nueva búsqueda",
    autenticidad: "Documento auténtico",
    mensajeAutenticidad: "Este documento es una copia auténtica de la denuncia registrada en nuestro sistema."
  },
  en: {
    titulo: "Access my report",
    subtitulo: "Enter your tracking code to access your report",
    codigo: "Tracking code:",
    placeholder: "Ex: DEN-20250101-ABC123",
    buscar: "Search report",
    cargando: "Searching report...",
    errorNoEncontrada: "No report found with that code",
    errorGeneral: "Error searching for report",
    volver: "Search again",
    nuevaBusqueda: "New search",
    autenticidad: "Authentic Document",
    mensajeAutenticidad: "This document is an authentic copy of the report registered in our system."
  },
  gn: {
    titulo: "Ahecha che emomarandu",
    subtitulo: "Ehai nde código de seguimiento ehecha hag̃ua nde emomarandu",
    codigo: "Código de seguimiento:",
    placeholder: "Ej: DEN-20250101-ABC123",
    buscar: "Eheka emomarandu",
    cargando: "Oñeheka emomarandu...",
    errorNoEncontrada: "Ndaipóri emomarandu ko código ndive",
    errorGeneral: "Error oñeheka emomarandu",
    volver: "Eheka jey",
    nuevaBusqueda: "Eheka pyahu",
    autenticidad: "Kuatia ojeroviáva",
    mensajeAutenticidad: "Ko kuatia ha'e peteĩ kopia ojeroviáva pe denúncia oñeregistráva'ekue ore sistema-pe."
  },
  pt: {
    titulo: "Acessar minha denúncia",
    subtitulo: "Digite seu código de acompanhamento para acessar sua denúncia",
    codigo: "Código de acompanhamento:",
    placeholder: "Ex: DEN-20250101-ABC123",
    buscar: "Buscar denúncia",
    cargando: "Buscando denúncia...",
    errorNoEncontrada: "Nenhuma denúncia encontrada com esse código",
    errorGeneral: "Erro ao buscar denúncia",
    volver: "Buscar novamente",
    nuevaBusqueda: "Nova busca",
    autenticidad: "Documento autêntico",
    mensajeAutenticidad: "Este documento é uma cópia autêntica da denúncia registrada em nosso sistema."
  }
};

function CodigoDenunciaContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const allowedLanguages = ['es', 'en', 'gn', 'pt'] as const;
  const safeLanguage = allowedLanguages.includes(language as any) ? language as typeof allowedLanguages[number] : 'es';
  const t = textos[safeLanguage];

  const performSearch = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;

    console.log('🔄 Código: Iniciando búsqueda con código:', codeToSearch.trim());
    setLoading(true);
    setError('');
    setReport(null);
    setSearched(true);

    try {
      const endpoint = `/api/denuncias/codigo?codigo=${codeToSearch.trim()}`;
      
      console.log('🔗 Código: Usando endpoint:', endpoint);
      
      const res = await fetch(endpoint);
      console.log('📡 Código: Respuesta del servidor:', res.status, res.statusText);
      
      const data = await res.json();
      console.log('📊 Código: Datos recibidos:', data);
      
      if (data.ok) {
        console.log('✅ Código: Denuncia encontrada, estableciendo report');
        setReport(data.report);
      } else {
        console.log('❌ Código: Error en datos:', data.error);
        setError(data.error || t.errorNoEncontrada);
      }
    } catch (err) {
      console.error('💥 Código: Error en fetch:', err);
      setError(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const codeFromUrl = searchParams.get('codigo');
    if (codeFromUrl) {
      setCodigo(codeFromUrl);
      performSearch(codeFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(codigo);
  };

  const handleNewSearch = () => {
    setCodigo('');
    setReport(null);
    setError('');
    setSearched(false);
  };

  return (
    <>
      <NavBar />
      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-32 sm:h-48 mb-4 sm:mb-6 mt-16">
        <img
          src="/src/Gobierno_del_Paraguay_Palacio.jpg"
          alt="Gobierno del Paraguay"
          className="w-full h-32 sm:h-48 object-cover"
        />
        <img
          src="/src/pn.png"
          alt="Policía Nacional"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-20 sm:h-28 w-auto"
          style={{ zIndex: 10 }}
        />
      </div>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-2">{t.titulo}</h1>
            <p className="text-gray-600 text-center mb-8">{t.subtitulo}</p>

            {/* Formulario de búsqueda (se muestra si no se ha buscado O si hay un error) */}
            {(!searched || error) && (
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="mb-6">
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.codigo}
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                {/* Mensaje de error, si existe */}
                {error && (
                  <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? t.cargando : t.buscar}
                </button>
              </form>
            )}

            {/* Indicador de carga */}
            {loading && (
              <div className="py-8 text-center">
                <p className="text-gray-600">{t.cargando}</p>
              </div>
            )}

            {/* Resultado encontrado */}
            {searched && !loading && !error && report && (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold text-green-800 mb-2">{t.autenticidad}</h2>
                  <p className="text-green-700 mb-2">{t.mensajeAutenticidad}</p>
                  <p className="text-green-700">{t.codigo} <span className="font-mono font-bold">{report.code}</span></p>
                </div>
                <PDFGenerator report={report} language={safeLanguage} />
                <button
                  onClick={handleNewSearch}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  {t.nuevaBusqueda}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function CodigoDenunciaPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CodigoDenunciaContent />
    </Suspense>
  );
} 