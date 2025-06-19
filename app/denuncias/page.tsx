"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from '../../components/NavBar';
import { useLanguage } from '../../components/LanguageSelector';

const textos = {
  es: {
    buscar: "Buscar por nombre...",
    todosDepartamentos: "Todos los departamentos",
    cargando: "Cargando casos...",
    noResultados: "No se encontraron casos que coincidan con los criterios de búsqueda.",
    departamento: "Departamento:",
    ultimaVezVisto: "Última vez visto:",
    verDetalles: "Ver detalles"
  },
  en: {
    buscar: "Search by name...",
    todosDepartamentos: "All departments",
    cargando: "Loading cases...",
    noResultados: "No cases found matching the search criteria.",
    departamento: "Department:",
    ultimaVezVisto: "Last seen:",
    verDetalles: "View details"
  },
  gn: {
    buscar: "Eheka héra rupive...",
    todosDepartamentos: "Departamento opaichagua",
    cargando: "Oñemyanyhẽ casos...",
    noResultados: "Ndaipóri casos oĩva umi jeheka rehegua.",
    departamento: "Departamento:",
    ultimaVezVisto: "Ojehecha pahague:",
    verDetalles: "Hecha mba'ete"
  },
  pt: {
    buscar: "Buscar por nome...",
    todosDepartamentos: "Todos os departamentos",
    cargando: "Carregando casos...",
    noResultados: "Nenhum caso encontrado com os critérios de busca.",
    departamento: "Departamento:",
    ultimaVezVisto: "Visto pela última vez:",
    verDetalles: "Ver detalhes"
  }
};

export default function DenunciasPublicadas() {
  const { language } = useLanguage();
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    fetch("/api/denuncias/publicadas")
      .then((res) => res.json())
      .then((data) => {
        setDenuncias(data.denuncias || []);
        setLoading(false);
      });
  }, []);

  const filteredDenuncias = denuncias.filter(denuncia => {
    const matchesSearch = 
      denuncia.missingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.missingLastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || denuncia.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(denuncias.map(d => d.department).filter(Boolean)));

  function getImageUrl(url: string) {
    if (!url) return '';
    return url.startsWith('/uploads/') ? url.replace('/uploads/', '/api/uploads/') : url;
  }

  const t = textos[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-32 sm:h-48 mb-4 sm:mb-6">
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder={t.buscar}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">{t.todosDepartamentos}</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4">{t.cargando}</p>
            </div>
          ) : filteredDenuncias.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl">{t.noResultados}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredDenuncias.map((denuncia) => {
                const portada = denuncia.photos?.find(f => f.publica);
                return (
                  <div key={denuncia.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={portada ? getImageUrl(portada.url) : "/src/MAFE.png"}
                        alt={denuncia.missingName}
                        className="w-full h-48 sm:h-64 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg sm:text-xl font-bold text-center mb-2">
                        {denuncia.missingName} {denuncia.missingLastName}
                      </h2>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-semibold">{t.departamento}</span> {denuncia.department || 'No especificado'}</p>
                        <p><span className="font-semibold">{t.ultimaVezVisto}</span> {new Date(denuncia.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link 
                        href={`/denuncias/${denuncia.id}`}
                        className="mt-4 block w-full bg-blue-700 text-white text-center px-4 py-2 rounded hover:bg-blue-800 transition text-sm sm:text-base"
                      >
                        {t.verDetalles}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 