'use client';

import { useLanguage } from './LanguageSelector';
import Link from 'next/link';

const textos = {
  es: {
    avisoModelo: "AVISO IMPORTANTE: Esta es una página modelo que aún NO se encuentra operativa.",
    aclaracionDatos: "Todos los datos personales mostrados son inventados, y las fotografías utilizadas tienen únicamente la finalidad de demostrar el funcionamiento del sistema. Cualquier otra interpretación contraria a esto es responsabilidad exclusiva de quien la realice.",
    desarrolladoPor: "Desarrollada por miembros del equipo de investigación de",
    bitcan: "BITCAN",
    terminos: "Términos y Condiciones",
    derechosReservados: "Todos los derechos reservados",
    avisoPrivacidad: "Política de Privacidad"
  },
  en: {
    avisoModelo: "IMPORTANT NOTICE: This is a model page that is NOT yet operational.",
    aclaracionDatos: "All personal data shown is fictitious, and the photographs used are solely for the purpose of demonstrating the system's operation. Any other interpretation contrary to this is the sole responsibility of the person making it.",
    desarrolladoPor: "Developed by members of the research team of",
    bitcan: "BITCAN",
    terminos: "Terms and Conditions",
    derechosReservados: "All rights reserved",
    avisoPrivacidad: "Privacy Policy"
  },
  gn: {
    avisoModelo: "TUICHA: Ko ha'e peteĩ kuatiarogue modelo ndoikove gueteri.",
    aclaracionDatos: "Opaite mba'e rechaukáva ko'ápe ha'e ñemohenda añoite, ha umi ta'anga ojepuru demostración rehe. Oimeraẽva ambue interpretación ndaha'éi ko'ã propósito rehegua ha'e ijehegui oiporavóva.",
    desarrolladoPor: "Ojejapo equipo de investigación ndive",
    bitcan: "BITCAN",
    terminos: "Ñe'ẽme'ẽ ha Ñemboheko",
    derechosReservados: "Opa mba'e oñangareko",
    avisoPrivacidad: "Tekorosã Rehegua"
  },
  pt: {
    avisoModelo: "AVISO IMPORTANTE: Esta é uma página modelo que ainda NÃO está operacional.",
    aclaracionDatos: "Todos os dados pessoais exibidos são inventados, e as fotografias utilizadas têm apenas a finalidade de demonstrar o funcionamento do sistema. Qualquer outra interpretação contrária a isso é de responsabilidade exclusiva de quem a fizer.",
    desarrolladoPor: "Desenvolvida por membros da equipe de pesquisa do",
    bitcan: "BITCAN",
    terminos: "Termos e Condições",
    derechosReservados: "Todos os direitos reservados",
    avisoPrivacidad: "Política de Privacidade"
  }
};

export default function Footer() {
  const { language } = useLanguage();
  const t = textos[language];

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Aviso importante */}
        <div className="bg-yellow-600 text-black p-6 rounded-lg mb-6 flex flex-col items-center justify-center gap-2 text-center max-w-5xl mx-auto">
          <p className="font-semibold text-lg mb-1">{t.avisoModelo}</p>
          <div className="max-w-3xl w-full mx-auto">
            <p className="text-sm mb-1 leading-relaxed">{t.aclaracionDatos}</p>
          </div>
          <p className="text-sm mt-1">
            {t.desarrolladoPor} <strong>{t.bitcan}</strong>
          </p>
        </div>

        {/* Enlaces principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Enlaces legales */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Información Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terminos" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t.terminos}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terminos#privacy" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t.avisoPrivacidad}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terminos#cookies" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Información del sistema */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Sistema MAFE</h3>
            <p className="text-gray-300 text-sm">
              Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Versión: Modelo de Desarrollo
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="border-gray-600 mb-6" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 {t.bitcan} - {t.derechosReservados}</p>
          <p className="mt-1">
            Sistema desarrollado para fines investigativos exclusivamente
          </p>
        </div>
      </div>
    </footer>
  );
} 