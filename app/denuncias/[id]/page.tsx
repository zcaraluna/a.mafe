"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import NavBar from '../../../components/NavBar';
import { useSession } from 'next-auth/react';
import { useLanguage } from '../../../components/LanguageSelector';

const textos = {
  es: {
    genero: "Género:",
    edad: "Edad:",
    fechaDesaparicion: "Fecha de desaparición:",
    relatoPublico: "Relato público:",
    sinRelato: "Sin relato público disponible.",
    caracteristicas: "Características físicas",
    colorOjos: "Color de ojos:",
    tipoCabello: "Tipo de cabello:",
    largoCabello: "Largo de cabello:",
    colorCabello: "Color de cabello:",
    colorPiel: "Color de piel:",
    peso: "Peso:",
    estatura: "Estatura:",
    ultimaVestimenta: "Última vestimenta:",
    otrosRasgos: "Otros rasgos:",
    noEspecificado: "No especificado",
    comentariosPendientes: "Comentarios pendientes de revisión",
    noComentariosPendientes: "No hay comentarios pendientes.",
    aceptarPublicar: "Aceptar y publicar",
    aceptarNoPublicar: "Aceptar y no publicar",
    rechazar: "Rechazar",
    comentariosAprobados: "Comentarios aprobados",
    noComentariosPublicos: "Aún no hay comentarios públicos.",
    anonimo: "Anónimo",
    nombre: "Nombre:",
    apellido: "Apellido:",
    cedula: "Cédula:",
    telefono: "Teléfono:",
    ip: "IP:",
    userAgent: "User Agent:",
    dispositivo: "Dispositivo:",
    proxy: "Proxy/VPN:",
    proveedor: "Proveedor:",
    moderadoPor: "Moderado por:",
    el: "el",
    aLas: "a las",
    comentariosInternos: "Comentarios internos (no públicos)",
    noComentariosInternos: "No hay comentarios internos.",
    comentariosRechazados: "Comentarios rechazados",
    noComentariosRechazados: "No hay comentarios rechazados.",
    aportaInfo: "Aporta información",
    enviando: "Enviando...",
    enviarComentario: "Enviar comentario",
    nombres: "Nombres",
    apellidos: "Apellidos",
    comentarAnonimamente: "Comentar anónimamente",
    avisoAnonimo: "Tus datos serán visibles solo para el equipo de investigación. Si marcas esta opción, tu aporte será publicado como Anónimo.",
    escribeComentario: "Escribe tu comentario o información relevante...",
    aprobado: "Aprobado (público)",
    interno: "Interno (no público)",
    rechazado: "Rechazado",
    nacionalidad: "Nacionalidad"
  },
  en: {
    genero: "Gender:",
    edad: "Age:",
    fechaDesaparicion: "Date of disappearance:",
    relatoPublico: "Public story:",
    sinRelato: "No public story available.",
    caracteristicas: "Physical characteristics",
    colorOjos: "Eye color:",
    tipoCabello: "Hair type:",
    largoCabello: "Hair length:",
    colorCabello: "Hair color:",
    colorPiel: "Skin color:",
    peso: "Weight:",
    estatura: "Height:",
    ultimaVestimenta: "Last clothing:",
    otrosRasgos: "Other features:",
    noEspecificado: "Not specified",
    comentariosPendientes: "Comments pending review",
    noComentariosPendientes: "No pending comments.",
    aceptarPublicar: "Accept and publish",
    aceptarNoPublicar: "Accept (not public)",
    rechazar: "Reject",
    comentariosAprobados: "Approved comments",
    noComentariosPublicos: "No public comments yet.",
    anonimo: "Anonymous",
    nombre: "Name:",
    apellido: "Last name:",
    cedula: "ID:",
    telefono: "Phone:",
    ip: "IP:",
    userAgent: "User Agent:",
    dispositivo: "Device:",
    proxy: "Proxy/VPN:",
    proveedor: "Provider:",
    moderadoPor: "Moderated by:",
    el: "on",
    aLas: "at",
    comentariosInternos: "Internal comments (not public)",
    noComentariosInternos: "No internal comments.",
    comentariosRechazados: "Rejected comments",
    noComentariosRechazados: "No rejected comments.",
    aportaInfo: "Provide information",
    enviando: "Sending...",
    enviarComentario: "Send comment",
    nombres: "First name(s)",
    apellidos: "Last name(s)",
    comentarAnonimamente: "Comment anonymously",
    avisoAnonimo: "Your data will only be visible to the investigation team. If you check this option, your contribution will be published as Anonymous.",
    escribeComentario: "Write your comment or relevant information...",
    aprobado: "Approved (public)",
    interno: "Internal (not public)",
    rechazado: "Rejected",
    nacionalidad: "Nationality"
  },
  gn: {
    genero: "Mba'ekuaa:",
    edad: "Ary:",
    fechaDesaparicion: "Ojehúva ára:",
    relatoPublico: "Mombe'u público:",
    sinRelato: "Ndaipóri mombe'u público.",
    caracteristicas: "Mba'e ojehechaukáva",
    colorOjos: "Tesa sa'y:",
    tipoCabello: "Akãra'anga:",
    largoCabello: "Akãra'anga pukukue:",
    colorCabello: "Akãra'anga sa'y:",
    colorPiel: "Pire sa'y:",
    peso: "Pohýi:",
    estatura: "Yvate:",
    ultimaVestimenta: "Aovetã pahague:",
    otrosRasgos: "Ambue mba'e:",
    noEspecificado: "Ndaipóri",
    comentariosPendientes: "Ñomongeta oha'ãva revisión",
    noComentariosPendientes: "Ndaipóri ñomongeta oha'ãva.",
    aceptarPublicar: "Moneĩ ha emyasãi",
    aceptarNoPublicar: "Moneĩ ha ani emyasãi",
    rechazar: "Mboyke",
    comentariosAprobados: "Ñomongeta moneĩva",
    noComentariosPublicos: "Ndorekói gueteri ñomongeta público.",
    anonimo: "Ndojekuaái",
    nombre: "Téra:",
    apellido: "Héra:",
    cedula: "Kuatiarogue:",
    telefono: "Pumbyry:",
    ip: "IP:",
    userAgent: "User Agent:",
    dispositivo: "Mba'eapopyre:",
    proxy: "Proxy/VPN:",
    proveedor: "Proveedor:",
    moderadoPor: "Omoheñói:",
    el: "arange",
    aLas: "ora",
    comentariosInternos: "Ñomongeta ñemigua (ndaha'éi público)",
    noComentariosInternos: "Ndaipóri ñomongeta ñemigua.",
    comentariosRechazados: "Ñomongeta mboýke",
    noComentariosRechazados: "Ndaipóri ñomongeta mboýke.",
    aportaInfo: "Emombe'u marandu",
    enviando: "Oñemondo...",
    enviarComentario: "Emondo ñomongeta",
    nombres: "Téra(kuéra)",
    apellidos: "Héra(kuéra)",
    comentarAnonimamente: "Eñomongeta nde réra'ỹre",
    avisoAnonimo: "Nde marandu ojehechaukáta equipo de investigación-pe añoite. Reiporavóramo ko opción, ne rembiapo ojehechaukáta Ndojekuaái ramo.",
    escribeComentario: "Ehai ne rembiapo térã marandu ojehecharamóva...",
    aprobado: "Moneĩ (público)",
    interno: "Ñemigua (ndaha'éi público)",
    rechazado: "Mboyke",
    nacionalidad: "Nationality"
  },
  pt: {
    genero: "Gênero:",
    edad: "Idade:",
    fechaDesaparicion: "Data do desaparecimento:",
    relatoPublico: "Relato público:",
    sinRelato: "Sem relato público disponível.",
    caracteristicas: "Características físicas",
    colorOjos: "Cor dos olhos:",
    tipoCabello: "Tipo de cabelo:",
    largoCabello: "Comprimento do cabelo:",
    colorCabello: "Cor do cabelo:",
    colorPiel: "Cor da pele:",
    peso: "Peso:",
    estatura: "Altura:",
    ultimaVestimenta: "Última roupa:",
    otrosRasgos: "Outras características:",
    noEspecificado: "Não especificado",
    comentariosPendientes: "Comentários pendentes de revisão",
    noComentariosPendientes: "Não há comentários pendentes.",
    aceptarPublicar: "Aceitar e publicar",
    aceptarNoPublicar: "Aceitar e não publicar",
    rechazar: "Rejeitar",
    comentariosAprobados: "Comentários aprovados",
    noComentariosPublicos: "Ainda não há comentários públicos.",
    anonimo: "Anônimo",
    nombre: "Nome:",
    apellido: "Sobrenome:",
    cedula: "Documento:",
    telefono: "Telefone:",
    ip: "IP:",
    userAgent: "User Agent:",
    dispositivo: "Dispositivo:",
    proxy: "Proxy/VPN:",
    proveedor: "Provedor:",
    moderadoPor: "Moderado por:",
    el: "em",
    aLas: "às",
    comentariosInternos: "Comentários internos (não públicos)",
    noComentariosInternos: "Não há comentários internos.",
    comentariosRechazados: "Comentários rejeitados",
    noComentariosRechazados: "Não há comentários rejeitados.",
    aportaInfo: "Forneça informações",
    enviando: "Enviando...",
    enviarComentario: "Enviar comentário",
    nombres: "Nome(s)",
    apellidos: "Sobrenome(s)",
    comentarAnonimamente: "Comentar anonimamente",
    avisoAnonimo: "Seus dados serão visíveis apenas para a equipe de investigação. Se marcar esta opção, sua contribuição será publicada como Anônimo.",
    escribeComentario: "Escreva seu comentário ou informação relevante...",
    aprobado: "Aprovado (público)",
    interno: "Interno (não público)",
    rechazado: "Rejeitado",
    nacionalidad: "Nacionalidade"
  }
};

const traduccionesValores = {
  genero: {
    masculino: { es: "masculino", en: "male", gn: "kuimbaʼe", pt: "masculino" },
    femenino: { es: "femenino", en: "female", gn: "kuña", pt: "feminino" }
  },
  eyeColor: {
    "marrón": { es: "marrón", en: "brown", gn: "hũ", pt: "castanho" },
    "ámbar": { es: "ámbar", en: "amber", gn: "ambar", pt: "âmbar" },
    "verde": { es: "verde", en: "green", gn: "hovyũ", pt: "verde" },
    "avellana": { es: "avellana", en: "hazel", gn: "avellana", pt: "avelã" },
    "azul": { es: "azul", en: "blue", gn: "hovy", pt: "azul" },
    "gris": { es: "gris", en: "gray", gn: "hũ", pt: "cinza" },
    "otros": { es: "otros", en: "others", gn: "ambue", pt: "outros" }
  },
  hairType: {
    "liso": { es: "liso", en: "straight", gn: "liso", pt: "liso" },
    "ondulado": { es: "ondulado", en: "wavy", gn: "ondulado", pt: "ondulado" },
    "rizado": { es: "rizado", en: "curly", gn: "rizado", pt: "cacheado" },
    "afro": { es: "afro", en: "afro", gn: "afro", pt: "afro" }
  },
  hairColor: {
    "negro": { es: "negro", en: "black", gn: "hũ", pt: "preto" },
    "castaño": { es: "castaño", en: "brown", gn: "kavaju", pt: "castanho" },
    "rubio": { es: "rubio", en: "blond", gn: "sa'yju", pt: "loiro" },
    "pelirrojo": { es: "pelirrojo", en: "redhead", gn: "pytã", pt: "ruivo" },
    "teñido": { es: "teñido", en: "dyed", gn: "teñido", pt: "tingido" },
    "otros": { es: "otros", en: "others", gn: "ambue", pt: "outros" }
  },
  hairLength: {
    "largo": { es: "largo", en: "long", gn: "puku", pt: "longo" },
    "mediano": { es: "mediano", en: "medium", gn: "mbyte", pt: "médio" },
    "corto": { es: "corto", en: "short", gn: "mbyky", pt: "curto" }
  },
  skinColor: {
    "clara": { es: "clara", en: "fair", gn: "sa'y morotĩ", pt: "clara" },
    "trigueña": { es: "trigueña", en: "olive", gn: "trigueña", pt: "morena" },
    "oscura": { es: "oscura", en: "dark", gn: "hũ", pt: "escura" },
    "otros": { es: "otros", en: "others", gn: "ambue", pt: "outras" }
  }
};

function traducirValor(tabla, valor, lang) {
  if (!valor) return textos[lang].noEspecificado;
  if (traduccionesValores[tabla] && traduccionesValores[tabla][valor] && traduccionesValores[tabla][valor][lang]) {
    return traduccionesValores[tabla][valor][lang];
  }
  return valor;
}

// Tabla de traducción de nacionalidades (con banderas)
const NACIONALIDAD_TRAD = {
  Paraguaya: { es: 'Paraguaya', en: 'Paraguayan', gn: 'Paraguayo', pt: 'Paraguaia', flag: '🇵🇾' },
  Argentina: { es: 'Argentina', en: 'Argentinian', gn: 'Argentina', pt: 'Argentina', flag: '🇦🇷' },
  Brasileña: { es: 'Brasileña', en: 'Brazilian', gn: 'Brasilgua', pt: 'Brasileira', flag: '🇧🇷' },
  Boliviana: { es: 'Boliviana', en: 'Bolivian', gn: 'Boliviagua', pt: 'Boliviana', flag: '🇧🇴' },
  Chilena: { es: 'Chilena', en: 'Chilean', gn: 'Chilena', pt: 'Chilena', flag: '🇨🇱' },
  Uruguaya: { es: 'Uruguaya', en: 'Uruguayan', gn: 'Uruguaygua', pt: 'Uruguaia', flag: '🇺🇾' },
  Peruana: { es: 'Peruana', en: 'Peruvian', gn: 'Perúgua', pt: 'Peruana', flag: '🇵🇪' },
  Colombiana: { es: 'Colombiana', en: 'Colombian', gn: 'Colombiagua', pt: 'Colombiana', flag: '🇨🇴' },
  Venezolana: { es: 'Venezolana', en: 'Venezuelan', gn: 'Venezuela', pt: 'Venezuelana', flag: '🇻🇪' },
  Ecuatoriana: { es: 'Ecuatoriana', en: 'Ecuadorian', gn: 'Ekuadorgua', pt: 'Equatoriana', flag: '🇪🇨' },
  Española: { es: 'Española', en: 'Spanish', gn: 'España', pt: 'Espanhola', flag: '🇪🇸' },
  Cubana: { es: 'Cubana', en: 'Cuban', gn: 'Kúbagua', pt: 'Cubana', flag: '🇨🇺' },
  Mexicana: { es: 'Mexicana', en: 'Mexican', gn: 'Méxicogua', pt: 'Mexicana', flag: '🇲🇽' },
  Alemana: { es: 'Alemana', en: 'German', gn: 'Alemaniagua', pt: 'Alemã', flag: '🇩🇪' },
  Italiana: { es: 'Italiana', en: 'Italian', gn: 'Italiagua', pt: 'Italiana', flag: '🇮🇹' }
};

export default function DetalleDenuncia() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", cedula: "", telefono: "", anonimo: true, content: "" });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedImg, setExpandedImg] = useState<string | null>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [pendingComments, setPendingComments] = useState<any[]>([]);
  const [internalComments, setInternalComments] = useState<any[]>([]);
  const [rejectedComments, setRejectedComments] = useState<any[]>([]);
  const commentStatusOptions = [
    { value: 'APROBADO', label: 'Aprobado (público)' },
    { value: 'INTERNO', label: 'Interno (no público)' },
    { value: 'RECHAZADO', label: 'Rechazado' },
  ];
  const { language } = useLanguage();

  useEffect(() => {
    fetch(`/api/denuncias/${id}/publica`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setReport(data.report);
          setComments(data.report.comments || []);
        } else {
          setError(data.error || "No encontrado");
        }
        setLoading(false);
      });
  }, [id]);

  // Obtener comentarios pendientes si es admin
  useEffect(() => {
    if (!isAdmin) return;
    fetch(`/api/denuncias/${id}/comentario?status=PENDIENTE`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPendingComments(data.comments || []);
      });
  }, [id, isAdmin]);

  // Obtener comentarios internos y rechazados si es admin
  useEffect(() => {
    if (!isAdmin) return;
    fetch(`/api/denuncias/${id}/comentario?status=INTERNO`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setInternalComments(data.comments || []);
      });
    fetch(`/api/denuncias/${id}/comentario?status=RECHAZADO`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setRejectedComments(data.comments || []);
      });
  }, [id, isAdmin]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSending(true);
    setSuccessMsg("");
    setError("");
    try {
      const res = await fetch(`/api/denuncias/${id}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccessMsg("¡Comentario enviado! Será visible tras aprobación.");
        setForm({ nombre: "", apellido: "", cedula: "", telefono: "", anonimo: true, content: "" });
      } else {
        setError(data.error || "Error al enviar comentario");
      }
    } catch {
      setError("Error al enviar comentario");
    }
    setSending(false);
  };

  // Funciones de moderación
  const handleModerate = async (commentId: string, action: 'APROBAR_PUBLICO' | 'APROBAR_INTERNO' | 'RECHAZAR' | 'APROBADO' | 'INTERNO' | 'RECHAZADO') => {
    let mappedAction: 'APROBAR_PUBLICO' | 'APROBAR_INTERNO' | 'RECHAZAR';
    if (action === 'APROBADO') mappedAction = 'APROBAR_PUBLICO';
    else if (action === 'INTERNO') mappedAction = 'APROBAR_INTERNO';
    else if (action === 'RECHAZADO') mappedAction = 'RECHAZAR';
    else mappedAction = action;
    const res = await fetch(`/api/denuncias/${id}/comentario/${commentId}/moderar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: mappedAction }),
    });
    const data = await res.json();
    if (!data.ok) return;
    const updated = data.comment;
    // Remover de la lista donde estaba y agregar a la nueva según su nuevo estado
    setPendingComments(prev => prev.filter(c => c.id !== commentId));
    setComments(prev => {
      if (updated.status === 'APROBADO') {
        // Si no está ya, agregarlo
        if (!prev.some(c => c.id === commentId)) return [updated, ...prev];
        return prev.map(c => c.id === commentId ? updated : c);
      } else {
        // Si cambió de estado, removerlo
        return prev.filter(c => c.id !== commentId);
      }
    });
    setInternalComments(prev => {
      if (updated.status === 'INTERNO') {
        if (!prev.some(c => c.id === commentId)) return [updated, ...prev];
        return prev.map(c => c.id === commentId ? updated : c);
      } else {
        return prev.filter(c => c.id !== commentId);
      }
    });
    setRejectedComments(prev => {
      if (updated.status === 'RECHAZADO') {
        if (!prev.some(c => c.id === commentId)) return [updated, ...prev];
        return prev.map(c => c.id === commentId ? updated : c);
      } else {
        return prev.filter(c => c.id !== commentId);
      }
    });
  };

  function getImageUrl(url: string) {
    if (!url) return '';
    return url.startsWith('/uploads/') ? url.replace('/uploads/', '/api/uploads/') : url;
  }

  function EstadoMenu({ current, onChange }: { current: string, onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);
    return (
      <div ref={ref} className="relative inline-block text-left">
        <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 text-xl font-bold px-2 py-0.5 focus:outline-none" onClick={() => setOpen(o => !o)}>
          &#8230;
        </button>
        {open && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {commentStatusOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`block w-full text-left px-4 py-2 text-sm ${current === opt.value ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100'}`}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!report) return null;

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
      {/* Contenido del caso */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
        {/* Galería de fotos públicas */}
        {report.photos && report.photos.filter((f: any) => f.publica).length > 0 ? (
          <div className="flex gap-4 justify-center mb-6 flex-wrap">
            {report.photos.filter((f: any) => f.publica).map((f: any, idx: number) => (
              <img
                key={f.id || idx}
                src={getImageUrl(f.url)}
                alt="Foto del desaparecido"
                className="h-48 w-40 object-cover rounded-lg border shadow-sm bg-gray-100"
                onClick={() => setExpandedImg(f.url)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center mb-6">
            <img src="/src/MAFE.png" alt="Foto principal" className="h-48 w-40 object-cover rounded-lg border shadow-sm bg-gray-100" />
          </div>
        )}
        {/* Modal de imagen expandida */}
        {expandedImg && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setExpandedImg(null)}
          >
            <img
              src={getImageUrl(expandedImg)}
              alt="Foto expandida"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
        {/* Nombre y datos principales */}
        <h1 className="text-3xl font-bold text-center mb-2 mt-2">{report.missingName} {report.missingLastName}</h1>
        {/* Nacionalidad del menor */}
        {report.missingNationality && (
          <div className="text-center text-base text-gray-700 mb-2">
            <span className="font-semibold">{textos[language].nacionalidad || "Nacionalidad"}:</span> {NACIONALIDAD_TRAD[report.missingNationality]?.flag} {NACIONALIDAD_TRAD[report.missingNationality]?.[language] || report.missingNationality}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-8 text-center text-gray-700 mb-4">
          <div>{textos[language].genero} <span className="font-semibold">{traducirValor('genero', report.missingGender, language)}</span></div>
          <div>{textos[language].edad} <span className="font-semibold">{(() => {
            const birth = new Date(report.missingBirthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return age;
          })()} años</span></div>
          <div>{textos[language].fechaDesaparicion} <span className="font-semibold">{new Date(report.createdAt).toLocaleDateString()}</span></div>
        </div>
        {/* Relato público */}
        <div className="mb-6">
          <div className="text-lg font-semibold mb-1 text-center">{textos[language].relatoPublico}</div>
          <div className="bg-gray-50 rounded p-3 text-gray-800 text-center min-h-[48px]">
            {report.relatoPublico || textos[language].sinRelato}
          </div>
        </div>
        {/* Características físicas */}
        <hr className="my-6" />
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2 text-center">{textos[language].caracteristicas}</div>
          <div className="flex justify-center">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-gray-700 text-base text-left">
              <li>{textos[language].colorOjos} {traducirValor('eyeColor', report.eyeColor, language)}</li>
              <li>{textos[language].tipoCabello} {traducirValor('hairType', report.hairType, language)}</li>
              <li>{textos[language].largoCabello} {traducirValor('hairLength', report.hairLength, language)}</li>
              <li>{textos[language].colorCabello} {traducirValor('hairColor', report.hairColor, language)}</li>
              <li>{textos[language].colorPiel} {traducirValor('skinColor', report.skinColor, language)}</li>
              <li>{textos[language].peso} {report.missingWeight ? `${report.missingWeight} kg` : textos[language].noEspecificado}</li>
              <li>{textos[language].estatura} {report.missingHeight ? `${report.missingHeight} cm` : textos[language].noEspecificado}</li>
              {report.missingClothing && <li>{textos[language].ultimaVestimenta} {report.missingClothing}</li>}
              {report.otherFeatures && <li>{textos[language].otrosRasgos} {report.otherFeatures}</li>}
            </ul>
          </div>
        </div>
        <hr className="my-6" />
        {/* Moderación para admin: pendientes primero */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-orange-700">{textos[language].comentariosPendientes}</h2>
            {pendingComments.length === 0 ? (
              <div className="text-gray-500 mb-4">{textos[language].noComentariosPendientes}</div>
            ) : (
              <ul className="mb-4 space-y-2">
                {pendingComments.map((c, i) => (
                  <li key={c.id || i} className="bg-yellow-50 p-3 rounded border shadow-sm relative">
                    <div className="text-gray-800 font-semibold mb-1">{c.anonimo ? textos[language].anonimo : `${c.nombre} ${c.apellido}`}</div>
                    <div className="text-gray-700 whitespace-pre-line">{c.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                    {isAdmin && (c.nombre || c.apellido || c.cedula || c.telefono || c.ip) && (
                      <div className="text-gray-700 text-sm mb-1">
                        {c.nombre && <span>{textos[language].nombre} {c.nombre} </span>}
                        {c.apellido && <span>{textos[language].apellido} {c.apellido} </span>}
                        {c.cedula && <span>{textos[language].cedula} {c.cedula} </span>}
                        {c.telefono && <span>{textos[language].telefono} {c.telefono} </span>}
                        {c.ip && <span>{textos[language].ip} {c.ip} </span>}
                        {c.userAgent && (
                          <div className="text-xs text-gray-500">{textos[language].userAgent} {c.userAgent}</div>
                        )}
                        {c.deviceType && (
                          <div className="text-xs text-gray-500">{textos[language].dispositivo} {c.deviceType}</div>
                        )}
                        {typeof c.isProxy !== 'undefined' && (
                          <div className="text-xs text-gray-500">
                            {textos[language].proxy} {c.isProxy ? 'Sí' : 'No'}
                            {c.isProxy && c.vpnProvider && (
                              <span> {textos[language].proveedor} {c.vpnProvider}</span>
                            )}
                          </div>
                        )}
                        {c.moderatedBy && c.moderatedAt && (
                          <div className="mt-2 text-gray-500 text-xs">
                            {textos[language].moderadoPor} <b>{c.moderatedBy.name}</b>, {new Date(c.moderatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {textos[language].aLas} {new Date(c.moderatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    )}
                    {isAdmin && (
                      <div className="flex gap-2 mt-2 justify-end">
                        <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700" onClick={() => handleModerate(c.id, 'APROBAR_PUBLICO')}>{textos[language].aceptarPublicar}</button>
                        <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" onClick={() => handleModerate(c.id, 'APROBAR_INTERNO')}>{textos[language].aceptarNoPublicar}</button>
                        <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => handleModerate(c.id, 'RECHAZAR')}>{textos[language].rechazar}</button>
                      </div>
                    )}
                    {isAdmin && c.status !== 'PENDIENTE' && (
                      <div className="absolute top-2 right-2">
                        <EstadoMenu current={c.status} onChange={v => handleModerate(c.id, v as any)} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Comentarios aprobados */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">{textos[language].comentariosAprobados}</h2>
          {comments.length === 0 ? (
            <div className="text-gray-500 mb-4">{textos[language].noComentariosPublicos}</div>
          ) : (
            <ul className="mb-4 space-y-2">
              {comments.map((c, i) => (
                <li key={c.id || i} className="bg-gray-50 p-3 rounded border shadow-sm relative">
                  <div className="text-gray-800 font-semibold mb-1">{c.anonimo ? textos[language].anonimo : `${c.nombre} ${c.apellido}`}</div>
                  <div className="text-gray-700 whitespace-pre-line">{c.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                  {isAdmin && (c.nombre || c.apellido || c.cedula || c.telefono || c.ip) && (
                    <div className="text-gray-700 text-sm mb-1">
                      {c.nombre && <span>{textos[language].nombre} {c.nombre} </span>}
                      {c.apellido && <span>{textos[language].apellido} {c.apellido} </span>}
                      {c.cedula && <span>{textos[language].cedula} {c.cedula} </span>}
                      {c.telefono && <span>{textos[language].telefono} {c.telefono} </span>}
                      {c.ip && <span>{textos[language].ip} {c.ip} </span>}
                      {c.userAgent && (
                        <div className="text-xs text-gray-500">{textos[language].userAgent} {c.userAgent}</div>
                      )}
                      {c.deviceType && (
                        <div className="text-xs text-gray-500">{textos[language].dispositivo} {c.deviceType}</div>
                      )}
                      {typeof c.isProxy !== 'undefined' && (
                        <div className="text-xs text-gray-500">
                          {textos[language].proxy} {c.isProxy ? 'Sí' : 'No'}
                          {c.isProxy && c.vpnProvider && (
                            <span> {textos[language].proveedor} {c.vpnProvider}</span>
                          )}
                        </div>
                      )}
                      {c.moderatedBy && c.moderatedAt && (
                        <div className="mt-2 text-gray-500 text-xs">
                          {textos[language].moderadoPor} <b>{c.moderatedBy.name}</b>, {new Date(c.moderatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {textos[language].aLas} {new Date(c.moderatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  )}
                  {isAdmin && c.status !== 'PENDIENTE' && (
                    <div className="absolute top-2 right-2">
                      <EstadoMenu current={c.status} onChange={v => handleModerate(c.id, v as any)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Comentarios internos solo para admin */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">{textos[language].comentariosInternos}</h2>
            {internalComments.length === 0 ? (
              <div className="text-gray-500 mb-4">{textos[language].noComentariosInternos}</div>
            ) : (
              <ul className="mb-4 space-y-2">
                {internalComments.map((c, i) => (
                  <li key={c.id || i} className="bg-blue-50 p-3 rounded border shadow-sm relative">
                    <div className="text-gray-800 font-semibold mb-1">{c.anonimo ? textos[language].anonimo : `${c.nombre} ${c.apellido}`}</div>
                    <div className="text-gray-700 whitespace-pre-line">{c.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                    <div className="text-gray-700 text-sm mb-1">
                      {c.nombre && <span>{textos[language].nombre} {c.nombre} </span>}
                      {c.apellido && <span>{textos[language].apellido} {c.apellido} </span>}
                      {c.cedula && <span>{textos[language].cedula} {c.cedula} </span>}
                      {c.telefono && <span>{textos[language].telefono} {c.telefono} </span>}
                      {c.ip && <span>{textos[language].ip} {c.ip}</span>}
                      {c.userAgent && (
                        <div className="text-xs text-gray-500">{textos[language].userAgent} {c.userAgent}</div>
                      )}
                      {c.deviceType && (
                        <div className="text-xs text-gray-500">{textos[language].dispositivo} {c.deviceType}</div>
                      )}
                      {typeof c.isProxy !== 'undefined' && (
                        <div className="text-xs text-gray-500">
                          {textos[language].proxy} {c.isProxy ? 'Sí' : 'No'}
                          {c.isProxy && c.vpnProvider && (
                            <span> {textos[language].proveedor} {c.vpnProvider}</span>
                          )}
                        </div>
                      )}
                      {c.moderatedBy && c.moderatedAt && (
                        <div className="mt-2 text-gray-500 text-xs">
                          {textos[language].moderadoPor} <b>{c.moderatedBy.name}</b>, {new Date(c.moderatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {textos[language].aLas} {new Date(c.moderatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                    {isAdmin && (c.status !== 'PENDIENTE' && c.status !== 'RECHAZADO') && (
                      <div className="absolute top-2 right-2">
                        <EstadoMenu current={c.status} onChange={v => handleModerate(c.id, v as any)} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Comentarios rechazados solo para admin */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-red-700">{textos[language].comentariosRechazados}</h2>
            {rejectedComments.length === 0 ? (
              <div className="text-gray-500 mb-4">{textos[language].noComentariosRechazados}</div>
            ) : (
              <ul className="mb-4 space-y-2">
                {rejectedComments.map((c, i) => (
                  <li key={c.id || i} className="bg-red-50 p-3 rounded border shadow-sm relative">
                    <div className="text-gray-800 font-semibold mb-1">{c.anonimo ? textos[language].anonimo : `${c.nombre} ${c.apellido}`}</div>
                    <div className="text-gray-700 whitespace-pre-line">{c.content}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                    <div className="text-gray-700 text-sm mb-1">
                      {c.nombre && <span>{textos[language].nombre} {c.nombre} </span>}
                      {c.apellido && <span>{textos[language].apellido} {c.apellido} </span>}
                      {c.cedula && <span>{textos[language].cedula} {c.cedula} </span>}
                      {c.telefono && <span>{textos[language].telefono} {c.telefono} </span>}
                      {c.ip && <span>{textos[language].ip} {c.ip}</span>}
                      {c.userAgent && (
                        <div className="text-xs text-gray-500">{textos[language].userAgent} {c.userAgent}</div>
                      )}
                      {c.deviceType && (
                        <div className="text-xs text-gray-500">{textos[language].dispositivo} {c.deviceType}</div>
                      )}
                      {typeof c.isProxy !== 'undefined' && (
                        <div className="text-xs text-gray-500">
                          {textos[language].proxy} {c.isProxy ? 'Sí' : 'No'}
                          {c.isProxy && c.vpnProvider && (
                            <span> {textos[language].proveedor} {c.vpnProvider}</span>
                          )}
                        </div>
                      )}
                      {c.moderatedBy && c.moderatedAt && (
                        <div className="mt-2 text-gray-500 text-xs">
                          {textos[language].moderadoPor} <b>{c.moderatedBy.name}</b>, {new Date(c.moderatedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} {textos[language].aLas} {new Date(c.moderatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                    {isAdmin && (c.status !== 'PENDIENTE' && c.status !== 'APROBADO') && (
                      <div className="absolute top-2 right-2">
                        <EstadoMenu current={c.status} onChange={v => handleModerate(c.id, v as any)} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Moderación para admin */}
        {!isAdmin && (
          <div className="mb-2">
            <h2 className="text-lg font-semibold mb-2">{textos[language].aportaInfo}</h2>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input name="nombre" value={form.nombre} onChange={handleChange} className="border p-2 rounded" placeholder={textos[language].nombres} />
                <input name="apellido" value={form.apellido} onChange={handleChange} className="border p-2 rounded" placeholder={textos[language].apellidos} />
                <input name="cedula" value={form.cedula} onChange={handleChange} className="border p-2 rounded" placeholder={textos[language].cedula} />
                <input name="telefono" value={form.telefono} onChange={handleChange} className="border p-2 rounded" placeholder={textos[language].telefono} />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-1">
                  <input type="checkbox" name="anonimo" checked={form.anonimo} onChange={handleChange} />
                  {textos[language].comentarAnonimamente}
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">{textos[language].avisoAnonimo}</p>
              </div>
              <textarea name="content" value={form.content} onChange={handleChange} className="border p-2 rounded w-full" rows={3} placeholder={textos[language].escribeComentario} required />
              <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 w-full md:w-auto" disabled={sending}>
                {sending ? textos[language].enviando : textos[language].enviarComentario}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 