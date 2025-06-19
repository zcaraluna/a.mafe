"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from '../../../components/NavBar';
import Link from "next/link";
import AlertModal from '../../components/AlertModal';
import { useLanguage } from '../../../components/LanguageSelector';

interface Foto {
  url: string;
  publica: boolean;
}

interface AlertData {
  id: string;
  nombre: string;
  apellido: string;
  alias?: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad: string;
  documentoIdentidad?: string;
  departamentos: string[];
  motivo: string;
  motivoOrdenCaptura?: string;
  nivelPeligrosidad: "BAJO" | "MEDIO" | "ALTO" | "EXTREMO";
  relato: string;
  fotos: Foto[];
  publicadaEn?: string;
  publicadaPor?: { name: string; email: string };
  // Características físicas opcionales
  colorOjos?: string;
  colorCabello?: string;
  tipoCabello?: string;
  seniasParticulares?: string;
  altura?: number;
  peso?: number;
}

const MOTIVOS_ALERTA_TRAD = {
  es: [
    "Orden de captura",
    "Fugado de centro penitenciario",
    "Fugado de centro de reclusión (menores de edad)",
    "Fugado de centro de salud mental",
    "Fugado de centro de rehabilitación (adicciones)"
  ],
  en: [
    "Arrest warrant",
    "Escaped from penitentiary",
    "Escaped from juvenile detention center",
    "Escaped from mental health center",
    "Escaped from rehabilitation center (addictions)"
  ],
  gn: [
    "Oñemohenda haguã",
    "Oñesẽ penitenciaríagui",
    "Oñesẽ mitãnguéra reclusión-gui",
    "Oñesẽ salud mental rendágui",
    "Oñesẽ rehabilitación rendágui (vicio)"
  ],
  pt: [
    "Mandado de prisão",
    "Fugiu do presídio",
    "Fugiu do centro de detenção juvenil",
    "Fugiu do centro de saúde mental",
    "Fugiu do centro de reabilitação (dependências)"
  ]
};

const NACIONALIDAD_TRAD = {
  Paraguaya: { es: 'Paraguaya', en: 'Paraguayan', gn: 'Paraguái', pt: 'Paraguaia', flag: '🇵🇾' },
  Argentina: { es: 'Argentina', en: 'Argentinian', gn: 'Argentinagua', pt: 'Argentina', flag: '🇦🇷' },
  Brasilera: { es: 'Brasilera', en: 'Brazilian', gn: 'Brasilgua', pt: 'Brasileira', flag: '🇧🇷' },
  Chilena: { es: 'Chilena', en: 'Chilean', gn: 'Chiligua', pt: 'Chilena', flag: '🇨🇱' },
  Uruguaya: { es: 'Uruguaya', en: 'Uruguayan', gn: 'Uruguaygua', pt: 'Uruguaia', flag: '🇺🇾' },
};

const GENERO_TRAD = {
  masculino: { es: 'masculino', en: 'male', gn: "kuimba'e", pt: 'masculino' },
  femenino: { es: 'femenino', en: 'female', gn: 'kuña', pt: 'feminino' }
};

const PELIGROSIDAD_TRAD = {
  BAJO: { es: 'BAJO', en: 'LOW', gn: 'MICHÎ', pt: 'BAIXO' },
  MEDIO: { es: 'MEDIO', en: 'MEDIUM', gn: 'MBYTÉ', pt: 'MÉDIO' },
  ALTO: { es: 'ALTO', en: 'HIGH', gn: 'YVATÉ', pt: 'ALTO' },
  EXTREMO: { es: 'EXTREMO', en: 'EXTREME', gn: 'TUICHI', pt: 'EXTREMO' }
};

const CARACTERISTICAS_TRAD = {
  colorOjos: {
    'marrón': { es: 'marrón', en: 'brown', gn: 'hovyũ', pt: 'castanho' },
    'ámbar': { es: 'ámbar', en: 'amber', gn: 'ambar', pt: 'âmbar' },
    'verde': { es: 'verde', en: 'green', gn: 'hovy', pt: 'verde' },
    'avellana': { es: 'avellana', en: 'hazel', gn: 'avellana', pt: 'avelã' },
    'azul': { es: 'azul', en: 'blue', gn: 'hovy', pt: 'azul' },
    'gris': { es: 'gris', en: 'gray', gn: 'hũsa\'yju', pt: 'cinza' },
    'otros': { es: 'otros', en: 'other', gn: 'ambue', pt: 'outros' }
  },
  colorCabello: {
    'negro': { es: 'negro', en: 'black', gn: 'hũ', pt: 'preto' },
    'castaño': { es: 'castaño', en: 'brown', gn: 'kuarahy\'ã', pt: 'castanho' },
    'rubio': { es: 'rubio', en: 'blonde', gn: 'sa\'yju', pt: 'loiro' },
    'pelirrojo': { es: 'pelirrojo', en: 'redhead', gn: 'pytã', pt: 'ruivo' },
    'teñido': { es: 'teñido', en: 'dyed', gn: 'teñido', pt: 'tingido' },
    'otros': { es: 'otros', en: 'other', gn: 'ambue', pt: 'outros' }
  },
  tipoCabello: {
    'liso': { es: 'liso', en: 'straight', gn: 'karape', pt: 'liso' },
    'ondulado': { es: 'ondulado', en: 'wavy', gn: 'ondulado', pt: 'ondulado' },
    'rizado': { es: 'rizado', en: 'curly', gn: 'rizado', pt: 'encaracolado' },
    'afro': { es: 'afro', en: 'afro', gn: 'afro', pt: 'afro' }
  }
};

const textos = {
  es: {
    alias: "Alias:",
    genero: "Género:",
    edad: "Edad:",
    nacimiento: "Nacimiento:",
    nacionalidad: "Nacionalidad:",
    documento: "Documento:",
    departamentos: "Departamentos:",
    motivo: "Motivo:",
    nivelPeligrosidad: "Nivel de peligrosidad:",
    relato: "Relato:",
    caracteristicas: "Características físicas:",
    colorOjos: "Color de ojos:",
    colorCabello: "Color de cabello:",
    tipoCabello: "Tipo de cabello:",
    estatura: "Estatura:",
    peso: "Peso:",
    senias: "Señas particulares:",
    publicadoPor: "Publicado por:",
    fechaPublicacion: "Fecha de publicación:",
    editar: "Editar alerta",
    eliminar: "Eliminar alerta",
    confirmarEliminar: "¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.",
    nDesconocido: "Desconocido",
    nNA: "N/A"
  },
  en: {
    alias: "Alias:",
    genero: "Gender:",
    edad: "Age:",
    nacimiento: "Birth:",
    nacionalidad: "Nationality:",
    documento: "Document:",
    departamentos: "Departments:",
    motivo: "Reason:",
    nivelPeligrosidad: "Danger level:",
    relato: "Story:",
    caracteristicas: "Physical features:",
    colorOjos: "Eye color:",
    colorCabello: "Hair color:",
    tipoCabello: "Hair type:",
    estatura: "Height:",
    peso: "Weight:",
    senias: "Distinguishing marks:",
    publicadoPor: "Published by:",
    fechaPublicacion: "Publication date:",
    editar: "Edit alert",
    eliminar: "Delete alert",
    confirmarEliminar: "Are you sure you want to delete this publication? This action cannot be undone.",
    nDesconocido: "Unknown",
    nNA: "N/A"
  },
  gn: {
    alias: "Alias:",
    genero: "Mba'ekuaa:",
    edad: "Ary:",
    nacimiento: "Aramboty:",
    nacionalidad: "Tetãgua:",
    documento: "Kuatiarogue:",
    departamentos: "Departamento:",
    motivo: "Motivo:",
    nivelPeligrosidad: "Peligrosidad rehegua:",
    relato: "Mombe'u:",
    caracteristicas: "Mba'e ojehechaukáva:",
    colorOjos: "Tesa sa'y:",
    colorCabello: "Akãra'anga sa'y:",
    tipoCabello: "Akãra'anga:",
    estatura: "Yvate:",
    peso: "Pohýi:",
    senias: "Señas particulares:",
    publicadoPor: "Omoherakuãva:",
    fechaPublicacion: "Arange:",
    editar: "Mboheko pyahu",
    eliminar: "Mboguete alerta",
    confirmarEliminar: "¿Erepa reipota mboguete ko publicación? Ko mba'e ndaikatúi oñemohenda jey.",
    nDesconocido: "Ndaha'éi ojekuaáva",
    nNA: "N/A"
  },
  pt: {
    alias: "Apelido:",
    genero: "Gênero:",
    edad: "Idade:",
    nacimiento: "Nascimento:",
    nacionalidad: "Nacionalidade:",
    documento: "Documento:",
    departamentos: "Departamentos:",
    motivo: "Motivo:",
    nivelPeligrosidad: "Nível de perigo:",
    relato: "Relato:",
    caracteristicas: "Características físicas:",
    colorOjos: "Cor dos olhos:",
    colorCabello: "Cor do cabelo:",
    tipoCabello: "Tipo de cabelo:",
    estatura: "Altura:",
    peso: "Peso:",
    senias: "Sinais particulares:",
    publicadoPor: "Publicado por:",
    fechaPublicacion: "Data de publicação:",
    editar: "Editar alerta",
    eliminar: "Excluir alerta",
    confirmarEliminar: "Tem certeza de que deseja excluir esta publicação? Esta ação não pode ser desfeita.",
    nDesconocido: "Desconhecido",
    nNA: "N/A"
  }
};

function getImageUrl(url: string) {
  if (!url) return '';
  const timestamp = Date.now();
  if (url.startsWith('/uploads/')) {
    return `${url.replace('/uploads/', '/api/uploads/')}?t=${timestamp}`;
  }
  return url;
}

export default function AlertaPerfil() {
  const params = useParams();
  const [alerta, setAlerta] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { language } = useLanguage();

  const fetchAlertaData = async () => {
    try {
      const res = await fetch(`/api/alertas/${params.id}`);
      const data = await res.json();
      if (data.alerta && data.alerta.fotos) {
        data.alerta.fotos = data.alerta.fotos.map((foto: any) => ({
          ...foto,
          url: getImageUrl(foto.url)
        }));
        if (data.alerta.fotoPrincipal) {
          data.alerta.fotoPrincipal = getImageUrl(data.alerta.fotoPrincipal);
        }
      }
      setAlerta(data.alerta);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar la alerta:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertaData();
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.user?.role === 'ADMIN') setIsAdmin(true);
      });
  }, [params.id]);

  if (loading || !alerta) {
    return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  }

  const edad = (() => {
    if (!alerta.fechaNacimiento) return null;
    const hoy = new Date();
    const fechaNac = new Date(alerta.fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  })();

  const getNivelPeligrosidadColor = (nivel: string) => {
    switch (nivel) {
      case 'BAJO':
        return 'bg-green-100 text-green-800';
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'ALTO':
        return 'bg-orange-100 text-orange-800';
      case 'EXTREMO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Galería de fotos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {alerta.fotos.map((foto, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={foto.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => setModalImg(foto.url)}
              />
            </div>
          ))}
        </div>
        {/* Modal de imagen ampliada */}
        {modalImg && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
            <img src={modalImg} alt="Foto ampliada" className="max-h-[90vh] max-w-[90vw] rounded-lg border-4 border-white shadow-2xl" />
          </div>
        )}
        {/* Nombre y datos principales */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-900 mb-1 uppercase">{alerta.nombre} {alerta.apellido}</h1>
          {alerta.alias && <div className="text-gray-500 text-base mb-2 italic">{textos[language].alias} {alerta.alias}</div>}
          <div className="text-gray-700 text-lg mb-1">
            {alerta.genero && <span>{textos[language].genero} {GENERO_TRAD[alerta.genero]?.[language] || alerta.genero}</span>}
            {edad !== null && <span> &nbsp;|&nbsp; {textos[language].edad} {edad}</span>}
            {alerta.fechaNacimiento && <span> &nbsp;|&nbsp; {textos[language].nacimiento} {new Date(alerta.fechaNacimiento).toLocaleDateString()}</span>}
          </div>
          <div className="text-gray-700 text-base mb-1">
            {alerta.nacionalidad && (
              <span>
                {textos[language].nacionalidad} {NACIONALIDAD_TRAD[alerta.nacionalidad]
                  ? `${NACIONALIDAD_TRAD[alerta.nacionalidad].flag} ${NACIONALIDAD_TRAD[alerta.nacionalidad][language]}`
                  : alerta.nacionalidad}
              </span>
            )}
            {alerta.documentoIdentidad && <span> &nbsp;|&nbsp; {textos[language].documento} {alerta.documentoIdentidad}</span>}
          </div>
          <div className="text-gray-700 text-base mb-1">
            {alerta.departamentos && <span>{textos[language].departamentos} {Array.isArray(alerta.departamentos) ? alerta.departamentos.join(', ') : alerta.departamentos}</span>}
          </div>
          <div className="text-gray-700 text-base mb-1">
            <span>{textos[language].motivo} <span className="font-semibold">{(() => {
              const idx = MOTIVOS_ALERTA_TRAD['es'].indexOf(alerta.motivo);
              if (idx !== -1) return MOTIVOS_ALERTA_TRAD[language][idx];
              const idx2 = MOTIVOS_ALERTA_TRAD[language].indexOf(alerta.motivo);
              return idx2 !== -1 ? MOTIVOS_ALERTA_TRAD[language][idx2] : alerta.motivo;
            })()}</span></span>
            {alerta.motivo === MOTIVOS_ALERTA_TRAD['es'][0] && alerta.motivoOrdenCaptura && (
              <span> &nbsp;|&nbsp; {alerta.motivoOrdenCaptura}</span>
            )}
          </div>
          {/* Badge de nivel de peligrosidad */}
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getNivelPeligrosidadColor(alerta.nivelPeligrosidad)}`}>{textos[language].nivelPeligrosidad} {PELIGROSIDAD_TRAD[alerta.nivelPeligrosidad]?.[language] || alerta.nivelPeligrosidad}</span>
          </div>
        </div>
        {/* Relato */}
        <div className="bg-gray-100 rounded p-4 mb-4">
          <div className="font-semibold mb-1">{textos[language].relato}</div>
          <div className="whitespace-pre-line text-gray-800">{alerta.relato}</div>
        </div>
        {/* Características físicas si existen */}
        {(alerta.colorOjos || alerta.colorCabello || alerta.tipoCabello || alerta.seniasParticulares || alerta.altura || alerta.peso) && (
          <div className="bg-gray-50 border rounded p-4 mb-4">
            <div className="font-semibold mb-2">{textos[language].caracteristicas}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alerta.colorOjos && <div><b>{textos[language].colorOjos}</b> {CARACTERISTICAS_TRAD.colorOjos[alerta.colorOjos]?.[language] || alerta.colorOjos}</div>}
              {alerta.colorCabello && <div><b>{textos[language].colorCabello}</b> {CARACTERISTICAS_TRAD.colorCabello[alerta.colorCabello]?.[language] || alerta.colorCabello}</div>}
              {alerta.tipoCabello && <div><b>{textos[language].tipoCabello}</b> {CARACTERISTICAS_TRAD.tipoCabello[alerta.tipoCabello]?.[language] || alerta.tipoCabello}</div>}
              {alerta.altura && <div><b>{textos[language].estatura}</b> {alerta.altura} cm</div>}
              {alerta.peso && <div><b>{textos[language].peso}</b> {alerta.peso} kg</div>}
              {alerta.seniasParticulares && <div className="md:col-span-2"><b>{textos[language].senias}</b> {alerta.seniasParticulares}</div>}
            </div>
          </div>
        )}
        {/* Publicación y acciones */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
          <div>
            {isAdmin && (
              <div className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{textos[language].publicadoPor}</span> {alerta.publicadaPor?.name || textos[language].nDesconocido} ({alerta.publicadaPor?.email || textos[language].nNA})<br />
                <span className="font-semibold">{textos[language].fechaPublicacion}</span> {alerta.publicadaEn ? new Date(alerta.publicadaEn).toLocaleString() : textos[language].nNA}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {/* Botón Editar alerta solo para admin */}
            {isAdmin && (
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold text-center"
                onClick={() => setEditModalOpen(true)}
              >
                {textos[language].editar}
              </button>
            )}
            {/* Botón Eliminar Publicación solo para admin */}
            {isAdmin && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold text-center"
                onClick={async () => {
                  if (!window.confirm(textos[language].confirmarEliminar)) return;
                  try {
                    const res = await fetch(`/api/admin/alertas/${alerta.id}`, { method: 'DELETE' });
                    if (res.ok) {
                      alert('Publicación eliminada correctamente');
                      window.location.href = '/alertas';
                    } else {
                      alert('Error al eliminar la publicación');
                    }
                  } catch (err) {
                    alert('Error al eliminar la publicación');
                  }
                }}
              >
                {textos[language].eliminar}
              </button>
            )}
          </div>
        </div>
        {/* Comentarios y otras secciones pueden ir aquí en el futuro */}
      </div>
      {/* Modal de edición */}
      {isAdmin && alerta && (
        <AlertModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={{
            ...alerta,
            genero: alerta.genero === 'masculino' || alerta.genero === 'femenino' ? alerta.genero : undefined,
            fotosExistentes: (alerta.fotos || []).map((f, idx) => ({ url: f.url, id: String(idx) })),
            fechaNacimiento: alerta.fechaNacimiento,
            departamentos: alerta.departamentos,
            motivoOrdenCaptura: alerta.motivoOrdenCaptura,
            colorOjos: alerta.colorOjos,
            colorCabello: alerta.colorCabello,
            tipoCabello: alerta.tipoCabello,
            seniasParticulares: alerta.seniasParticulares,
            altura: alerta.altura ? String(alerta.altura) : undefined,
            peso: alerta.peso ? String(alerta.peso) : undefined,
          }}
          onSubmit={async (data) => {
            const formData = new FormData();
            
            // Campos básicos
            for (const key of [
              'nombre', 'apellido', 'alias', 'fechaNacimiento', 'genero', 'nacionalidad',
              'documentoIdentidad', 'motivo', 'motivoOrdenCaptura', 'nivelPeligrosidad',
              'relato', 'altura', 'peso', 'colorOjos', 'colorCabello', 'tipoCabello',
              'seniasParticulares'
            ]) {
              if (data[key as keyof typeof data]) {
                formData.append(key, String(data[key as keyof typeof data]));
              }
            }

            // Departamentos
            formData.append('departamentos', JSON.stringify(data.departamentos));

            // Fotos nuevas
            if (data.fotos && data.fotos.length > 0) {
              Array.from(data.fotos).forEach((file) => {
                if (file instanceof File) {
                  formData.append('fotos', file);
                }
              });
            }

            // Fotos existentes
            const fotosExistentes = (data as any).fotosExistentes || [];
            formData.append('fotosExistentes', JSON.stringify(
              fotosExistentes.map((f: any) => ({
                url: f.url.replace(/\?t=\d+$/, ''), // Remover timestamp
                id: f.id
              }))
            ));

            // Foto principal
            if ((data as any).fotoPrincipalIndex !== undefined) {
              formData.append('fotoPrincipalIndex', String((data as any).fotoPrincipalIndex));
            }
            if ((data as any).fotoPrincipalUrl) {
              const url = (data as any).fotoPrincipalUrl.replace(/\?t=\d+$/, ''); // Remover timestamp
              formData.append('fotoPrincipalUrl', url);
            }

            try {
              const res = await fetch(`/api/alertas/${alerta.id}`, {
                method: 'PATCH',
                body: formData,
              });

              if (!res.ok) {
                const errorText = await res.text();
                console.error('Error al actualizar la alerta:', errorText);
                alert('Error al actualizar la alerta: ' + errorText);
                return;
              }

              // Refrescar datos de la alerta
              await fetchAlertaData();
              setEditModalOpen(false);
            } catch (err) {
              console.error('Excepción al actualizar la alerta:', err);
              alert('Error al actualizar la alerta: ' + err);
            }
          }}
        />
      )}
    </div>
  );
} 