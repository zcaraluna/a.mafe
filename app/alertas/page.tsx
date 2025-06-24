"use client";

import NavBar from '../../components/NavBar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AlertModal from '../components/AlertModal';
import { useLanguage } from '../../components/LanguageSelector';

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

const textos = {
  es: {
    titulo: "Alertas activas",
    nuevaAlerta: "+ Nueva alerta",
    buscar: "Buscar por nombre o apellido...",
    todosMotivos: "Todos los motivos",
    todosDepartamentos: "Todos los departamentos",
    cargando: "Cargando alertas...",
    noAlertas: "No hay alertas activas en este momento.",
    motivo: "Motivo:",
    departamentos: "Departamentos:",
    relato: "Relato:",
    verPerfil: "Ver perfil",
  },
  en: {
    titulo: "Active alerts",
    nuevaAlerta: "+ New alert",
    buscar: "Search by name or surname...",
    todosMotivos: "All reasons",
    todosDepartamentos: "All departments",
    cargando: "Loading alerts...",
    noAlertas: "There are no active alerts at this time.",
    motivo: "Reason:",
    departamentos: "Departments:",
    relato: "Story:",
    verPerfil: "View profile",
  },
  gn: {
    titulo: "Oñemomarandu oĩva",
    nuevaAlerta: "+ Ñemomarandu pyahu",
    buscar: "Eheka héra térã abizape...",
    todosMotivos: "Motivo opaichagua",
    todosDepartamentos: "Departamento opaichagua",
    cargando: "Oñemyanyhẽ ñemomarandu...",
    noAlertas: "Ndaipóri ñemomarandu oĩva ko'ágã.",
    motivo: "Motivo:",
    departamentos: "Departamento:",
    relato: "Mombe'u:",
    verPerfil: "Hecha perfil",
  },
  pt: {
    titulo: "Alertas ativas",
    nuevaAlerta: "+ Nova alerta",
    buscar: "Buscar por nome ou sobrenome...",
    todosMotivos: "Todos os motivos",
    todosDepartamentos: "Todos os departamentos",
    cargando: "Carregando alertas...",
    noAlertas: "Não há alertas ativas no momento.",
    motivo: "Motivo:",
    departamentos: "Departamentos:",
    relato: "Relato:",
    verPerfil: "Ver perfil",
  }
};

const DEPARTAMENTOS = [
  "Asunción",
  "Concepción",
  "San Pedro",
  "Cordillera",
  "Guairá",
  "Caaguazú",
  "Caazapá",
  "Itapúa",
  "Misiones",
  "Paraguarí",
  "Alto Paraná",
  "Central",
  "Ñeembucú",
  "Amambay",
  "Canindeyú",
  "Presidente Hayes",
  "Alto Paraguay",
  "Boquerón"
];

const MOTIVOS_ALERTA = [
  "Orden de captura",
  "Fugado de centro penitenciario",
  "Fugado de centro de reclusión (menores de edad)",
  "Fugado de centro de salud mental",
  "Fugado de centro de rehabilitación (adicciones)"
];

function getImageUrl(url: string) {
  if (!url) return '';
  const timestamp = Date.now();
  if (url.startsWith('/uploads/')) {
    return `${url.replace('/uploads/', '/api/uploads/')}?t=${timestamp}`;
  }
  return url;
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [search, setSearch] = useState('');
  const PAGE_SIZE = 6;
  const { language } = useLanguage();

  const fetchAlertas = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (motivo) params.set('motivo', motivo);
    if (departamento) params.set('departamento', departamento);
    if (search) params.set('search', search);
    fetch(`/api/alertas?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setAlertas(data.alertas || []);
          setTotal(data.total || 0);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlertas();
    // eslint-disable-next-line
  }, [page, motivo, departamento]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.user?.role === 'ADMIN') setIsAdmin(true);
      });
  }, []);

  const handleCreateAlert = async (data: any) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'departamentos') {
          formData.append('departamentos', JSON.stringify(data.departamentos));
        } else if (key !== 'fotos' && key !== 'fotoPrincipalIndex') {
          formData.append(key, data[key]);
        }
      });
      if (data.fotos) {
        Array.from(data.fotos).forEach((file: File) => {
          formData.append('fotos', file);
        });
      }
      if (typeof data.fotoPrincipalIndex === 'number' && data.fotos && data.fotos[data.fotoPrincipalIndex]) {
        formData.append('fotoPrincipalIndex', data.fotoPrincipalIndex);
      }
      const res = await fetch('/api/admin/alertas', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setIsModalOpen(false);
        setPage(1);
        fetchAlertas();
      } else {
        alert('Error al crear la alerta');
      }
    } catch (error) {
      alert('Error al crear la alerta');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-[90vh] bg-gray-50">
      <NavBar />
      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-48 mb-6 mt-16">
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
      <main className="max-w-4xl mx-auto px-4 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-900">{textos[language].titulo}</h1>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold"
            >
              {textos[language].nuevaAlerta}
            </button>
          )}
        </div>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={textos[language].buscar}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="p-2 border rounded w-full md:w-1/3"
          />
          <select
            value={motivo}
            onChange={e => { setMotivo(e.target.value); setPage(1); }}
            className="p-2 border rounded w-full md:w-1/4"
          >
            <option value="">{textos[language].todosMotivos}</option>
            {MOTIVOS_ALERTA.map((m, idx) => (
              <option key={m} value={m}>{MOTIVOS_ALERTA_TRAD[language][idx]}</option>
            ))}
          </select>
          <select
            value={departamento}
            onChange={e => { setDepartamento(e.target.value); setPage(1); }}
            className="p-2 border rounded w-full md:w-1/4"
          >
            <option value="">{textos[language].todosDepartamentos}</option>
            {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12">{textos[language].cargando}</div>
        ) : alertas.length === 0 ? (
          <div className="text-center text-gray-500 py-12">{textos[language].noAlertas}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alertas.map(alerta => (
                <Link key={alerta.id} href={`/alertas/${alerta.id}`} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row hover:shadow-lg transition cursor-pointer items-stretch">
                  <div className="flex-shrink-0 flex justify-center items-center md:items-start md:justify-start">
                    <img
                      src={getImageUrl(alerta.fotoPrincipal || '/src/MAFE.png')}
                      alt="Foto de la persona buscada"
                      className="h-40 w-32 md:h-48 md:w-40 object-cover rounded border bg-gray-100 mb-4 md:mb-0 md:mr-6 shadow-md"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-2xl font-bold text-blue-900 leading-tight">{alerta.nombre} {alerta.apellido}</div>
                      {alerta.alias && <div className="text-sm text-gray-500 mb-1">Alias: {alerta.alias}</div>}
                      <div className="text-sm text-gray-700 mt-1">{textos[language].motivo} <span className="font-semibold">{(() => {
                        const idx = MOTIVOS_ALERTA.indexOf(alerta.motivo);
                        return idx !== -1 ? MOTIVOS_ALERTA_TRAD[language][idx] : alerta.motivo;
                      })()}</span></div>
                      <div className="text-xs text-gray-500 mt-1 mb-2">{textos[language].departamentos} {Array.isArray(alerta.departamentos) ? alerta.departamentos.join(', ') : alerta.departamentos}</div>
                      <div className="text-gray-700 text-sm line-clamp-2 mb-2">{textos[language].relato} {alerta.relato}</div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <span className="text-blue-700 font-semibold hover:underline">{textos[language].verPerfil} &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >{i + 1}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >Siguiente</button>
            </div>
          </>
        )}
      </main>
      {isAdmin && (
        <AlertModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAlert}
        />
      )}
    </div>
  );
} 