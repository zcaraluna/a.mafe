"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageSelector";

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "ADMIN";
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();

  // Auto-logout por inactividad (5 minutos)
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const textos = {
    es: {
      inicio: "Inicio",
      administrar: "Administrar",
      verCasos: "Ver casos publicados",
      verAlertas: "Ver alertas",
      cerrarSesion: "Cerrar sesión",
      accederAdmin: "Acceder como administrador",
      notificaciones: "Notificaciones",
      noPendientes: "No hay comentarios pendientes.",
      ir: "IR"
    },
    en: {
      inicio: "Home",
      administrar: "Administer",
      verCasos: "View published cases",
      verAlertas: "View alerts",
      cerrarSesion: "Sign out",
      accederAdmin: "Admin access",
      notificaciones: "Notifications",
      noPendientes: "No pending comments.",
      ir: "GO"
    },
    gn: {
      inicio: "Ñepyrũ",
      administrar: "Moakãrapu'ã",
      verCasos: "Hecha casos ojeherokyva",
      verAlertas: "Hecha alertas",
      cerrarSesion: "Jesareko",
      accederAdmin: "Eike administrador ramo",
      notificaciones: "Ñemomarandu",
      noPendientes: "Ndaipóri ñomongeta oha'ãva.",
      ir: "HO"
    },
    pt: {
      inicio: "Início",
      administrar: "Administrar",
      verCasos: "Ver casos publicados",
      verAlertas: "Ver alertas",
      cerrarSesion: "Sair",
      accederAdmin: "Acesso administrador",
      notificaciones: "Notificações",
      noPendientes: "Não há comentários pendentes.",
      ir: "IR"
    }
  };
  const t = textos[language] || textos.es;

  useEffect(() => {
    if (!isAdmin) return;
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        signOut();
      }, 5 * 60 * 1000); // 5 minutos
    };
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    async function fetchPending() {
      // Buscar todos los comentarios pendientes de todos los casos
      const res = await fetch("/api/admin/comentarios/pendientes");
      if (res.ok) {
        const data = await res.json();
        setPendingCount(data.count || 0);
        setPendingList(data.comentarios || []);
      }
    }
    fetchPending();
    const interval = setInterval(fetchPending, 30000); // Actualizar cada 30s
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-blue-900 text-white fixed top-0 left-0 z-50 shadow">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg tracking-wide hover:underline mr-4">{t.inicio}</Link>
          {/* Botón de menú hamburguesa para móviles */}
          <button 
            className="md:hidden p-2 hover:bg-blue-800 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Menú de escritorio */}
        <div className="hidden md:flex items-center gap-8">
          {isAdmin && (
            <Link href="/admin" className="hover:underline font-semibold">{t.administrar}</Link>
          )}
          <Link href="/denuncias" className="hover:underline">{t.verCasos}</Link>
          <Link href="/alertas" className="hover:underline">{t.verAlertas}</Link>
          <Link href="/denuncias/codigo" className="hover:underline text-yellow-300">Mi denuncia</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="relative">
              <button className="focus:outline-none" title="Notificaciones de comentarios pendientes" onClick={() => setNotifOpen(o => !o)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-yellow-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-4.488 0A8.967 8.967 0 0 1 3 9.75V8.25A5.25 5.25 0 0 1 8.25 3h7.5A5.25 5.25 0 0 1 21 8.25v1.5a8.967 8.967 0 0 1-7.143 7.332z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3 3 0 0 1-6 0" />
                </svg>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {pendingCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div ref={notifRef} className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white text-gray-900 rounded shadow-lg z-50 border">
                  <div className="p-3 font-semibold border-b">{t.notificaciones}</div>
                  {pendingList.length === 0 ? (
                    <div className="p-4 text-gray-500">{t.noPendientes}</div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y">
                      {pendingList.map((c, i) => (
                        <li key={c.id} className="flex items-center justify-between gap-2 px-4 py-3">
                          <div>
                            Un nuevo comentario en el caso de <b>{c.report?.missingName} {c.report?.missingLastName}</b>
                          </div>
                          <button
                            className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
                            onClick={() => { setNotifOpen(false); router.push(`/denuncias/${c.reportId}`); }}
                          >
                            {t.ir}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {isAdmin ? (
            <button
              onClick={() => {
                if (pathname === "/admin") {
                  signOut({ callbackUrl: "/login" });
                } else {
                  signOut();
                }
              }}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 text-sm md:text-base"
            >
              {t.cerrarSesion}
            </button>
          ) : (
            <Link href="/login" className="bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition text-sm md:text-base">
              Acceder como administrador
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-4 py-3 space-y-2">
            {isAdmin && (
              <Link href="/admin" className="block hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>
                Administrar
              </Link>
            )}
            <Link href="/denuncias" className="block hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>
              Ver casos publicados
            </Link>
            <Link href="/alertas" className="block hover:bg-blue-700 px-3 py-2 rounded" onClick={closeMenu}>
              Ver alertas
            </Link>
            <Link href="/denuncias/codigo" className="block hover:bg-blue-700 px-3 py-2 rounded text-yellow-300" onClick={closeMenu}>
              Mi denuncia
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 