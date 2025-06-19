"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from '../../components/LanguageSelector';

const textos = {
  es: {
    titulo: "¡Denuncia enviada!",
    codigo: "Su código de seguimiento es:",
    contacto: "Un personal capacitado lo contactará en la brevedad posible.",
    cargando: "Cargando..."
  },
  en: {
    titulo: "Report submitted!",
    codigo: "Your tracking code is:",
    contacto: "A trained staff member will contact you as soon as possible.",
    cargando: "Loading..."
  },
  gn: {
    titulo: "Emomarandu mboupa!",
    codigo: "Nde código de seguimiento ha'e:",
    contacto: "Peteĩ tembikuaa rehegua oikóta nderehe pya'e",
    cargando: "Oñemyanyhẽ..."
  },
  pt: {
    titulo: "Denúncia enviada!",
    codigo: "Seu código de acompanhamento é:",
    contacto: "Um profissional capacitado entrará em contato com você em breve.",
    cargando: "Carregando..."
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">{textos[language].titulo}</h1>
        <p className="mb-2">
          {textos[language].codigo}<br />
          <span className="font-mono text-lg text-blue-700">{codigo}</span>
        </p>
        <p>{textos[language].contacto}</p>
      </div>
    </div>
  );
} 