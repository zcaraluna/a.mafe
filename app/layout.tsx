'use client';

import './globals.css'
import { SessionProvider } from 'next-auth/react'
import LanguageSelector, { LanguageProvider } from '../components/LanguageSelector'
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const mostrarSelector = !pathname.startsWith('/admin');
  return (
    <html lang="es">
      <head>
        <title>Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos - Alerta MAFE</title>
        <meta name="description" content="Sistema para la gestión de denuncias de niños, niñas y adolescentes desaparecidos" />
        <link rel="icon" href="/src/favicon.ico" />
      </head>
      <body className="bg-white min-h-screen">
        <LanguageProvider>
          {mostrarSelector && (
            <div className="fixed top-20 right-4 z-50">
              <LanguageSelector />
            </div>
          )}
          <SessionProvider>{children}</SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
