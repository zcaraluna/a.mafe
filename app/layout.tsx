'use client';

import './globals.css'
import { SessionProvider } from 'next-auth/react'
import LanguageSelector, { LanguageProvider } from '../components/LanguageSelector'
import Footer from '../components/Footer'
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const noMostrarElementos = pathname.startsWith('/admin') || pathname.startsWith('/akiravive');
  
  return (
    <html lang="es">
      <head>
        <title>Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos - Alerta MAFE</title>
        <meta name="description" content="Sistema para la gestión de denuncias de niños, niñas y adolescentes desaparecidos" />
        <link rel="icon" href="/src/favicon.ico" />
      </head>
      <body className="bg-white min-h-screen flex flex-col">
        <LanguageProvider>
          {!noMostrarElementos && (
            <div className="fixed top-20 right-4 z-50">
              <LanguageSelector />
            </div>
          )}
          <SessionProvider>
            <div className="flex-1">
              {children}
            </div>
            {!noMostrarElementos && <Footer />}
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
