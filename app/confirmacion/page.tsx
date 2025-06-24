"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useLanguage } from '../../components/LanguageSelector';
import PDFGenerator from '../components/PDFGenerator';
import NavBar from '../../components/NavBar';

const textos = {
  es: {
    titulo: "¡Denuncia enviada!",
    codigo: "Su código de seguimiento es:",
    contacto: "Un personal capacitado lo contactará en la brevedad posible.",
    cargando: "Cargando...",
    descargarPDF: "Descargar copia en PDF",
    errorCargar: "Error al cargar los datos de la denuncia",
    datosCargando: "Cargando datos de la denuncia..."
  },
  en: {
    titulo: "Report submitted!",
    codigo: "Your tracking code is:",
    contacto: "A trained staff member will contact you as soon as possible.",
    cargando: "Loading...",
    descargarPDF: "Download PDF copy",
    errorCargar: "Error loading report data",
    datosCargando: "Loading report data..."
  },
  gn: {
    titulo: "Emomarandu mboupa!",
    codigo: "Nde código de seguimiento ha'e:",
    contacto: "Peteĩ tembikuaa rehegua oikóta nderehe pya'e",
    cargando: "Oñemyanyhẽ...",
    descargarPDF: "Emboguejy PDF rupive",
    errorCargar: "Error oñemyanyhẽvo mba'ekuaa",
    datosCargando: "Oñemyanyhẽ mba'ekuaa..."
  },
  pt: {
    titulo: "Denúncia enviada!",
    codigo: "Seu código de acompanhamento é:",
    contacto: "Um profissional capacitado entrará em contato com você em breve.",
    cargando: "Carregando...",
    descargarPDF: "Baixar cópia em PDF",
    errorCargar: "Erro ao carregar dados da denúncia",
    datosCargando: "Carregando dados da denúncia..."
  }
};

export default function Confirmacion() {
  const { language } = useLanguage();
  // Validar que el idioma sea uno de los permitidos
  const allowedLanguages = ['es', 'en', 'gn', 'pt'] as const;
  const safeLanguage = allowedLanguages.includes(language as any) ? language as typeof allowedLanguages[number] : 'es';

  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center'>{textos[safeLanguage].cargando}</div>}>
      <ConfirmacionContent language={safeLanguage} />
    </Suspense>
  );
}

function ConfirmacionContent({ language }: { language: keyof typeof textos }) {
  const searchParams = useSearchParams();
  const codigo = searchParams.get("codigo");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (codigo) {
      console.log('🔄 Confirmación: Iniciando búsqueda de denuncia con código:', codigo);
      setLoading(true);
      
      const endpoint = `/api/denuncias/codigo?codigo=${codigo}`;
      
      console.log('🔗 Confirmación: Usando endpoint:', endpoint);
      
      fetch(endpoint)
        .then(res => {
          console.log('📡 Confirmación: Respuesta del servidor:', res.status, res.statusText);
          return res.json();
        })
        .then(data => {
          console.log('📊 Confirmación: Datos recibidos:', data);
          if (data.ok) {
            console.log('✅ Confirmación: Denuncia encontrada, estableciendo report');
            setReport(data.report);
          } else {
            console.log('❌ Confirmación: Error en datos:', data.error);
            setError(data.error || textos[language].errorCargar);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('💥 Confirmación: Error en fetch:', err);
          setError(textos[language].errorCargar);
          setLoading(false);
        });
    }
  }, [codigo, language]);

  const t = textos[language];

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
          <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">{t.titulo}</h1>
            <p className="mb-2">
              {t.codigo}<br />
              <span className="font-mono text-lg text-blue-700">{codigo}</span>
            </p>
            <p className="mb-6">{t.contacto}</p>
            
            {/* Botón de descarga PDF */}
            {report && (
              <div className="mt-6">
                <PDFGenerator report={report} language={language} />
              </div>
            )}
            
            {loading && (
              <div className="mt-6">
                <p className="text-gray-600">{t.datosCargando}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 