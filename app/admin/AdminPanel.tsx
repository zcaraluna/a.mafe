'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';
import { signOut } from 'next-auth/react';
import NavBar from '../../components/NavBar';

interface Photo {
  id: string;
  url: string;
}

interface Report {
  id: string;
  code?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CERRADO_VIVA' | 'CERRADO_FALLECIDA';
  reporterName: string;
  reporterLastName: string;
  reporterPhone: string;
  reporterIdFront?: string;
  reporterIdBack?: string;
  reporterIdNumber?: string;
  missingName: string;
  missingLastName: string;
  missingBirthDate: string;
  eyeColor: string;
  hairType: string;
  hairLength: string;
  hairColor: string;
  skinColor: string;
  otherFeatures: string;
  missingPhotos?: string[];
  createdAt: string;
  missingDescription?: string;
  missingLastSeen?: string;
  reporterLatitude?: string;
  reporterLongitude?: string;
  lastSeenDate?: string;
  statusChangedBy?: string;
  statusChangedAt?: string;
  statusChangedByName?: string;
  caseActions?: { id: string; action: string; user?: { name: string }; createdAt: string; note?: string }[];
  missingWeight?: string;
  missingHeight?: string;
  missingGender?: string;
  publicado?: boolean;
  relatoPublico?: string;
  relatoAfiche?: string;
  reporterAddress?: string;
  department?: string;
  reporterIp?: string;
  reporterUserAgent?: string;
  reporterDeviceType?: string;
  reporterIsProxy?: boolean;
  reporterNationality?: string;
  missingNationality?: string;
  reporterVpnProvider?: string;
  photos?: Photo[];
}

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CERRADO_VIVA: 'Cerrada (hallada con vida)',
  CERRADO_FALLECIDA: 'Cerrada (hallada sin vida)',
};
const STATUS_COLORS = {
  PENDING: 'bg-yellow-400 text-white',
  APPROVED: 'bg-green-500 text-white',
  REJECTED: 'bg-red-500 text-white',
  CERRADO_VIVA: 'bg-green-800 text-white',
  CERRADO_FALLECIDA: 'bg-gray-500 text-white',
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

// Componente para el afiche institucional basado en la plantilla HTML
function PosterAfiche({ report, foto, relato, otrosRasgos, ultimaVestimenta, telefonos, posterContactPhones, posterDepartamentoPhone, posterOtherPhone, isCerrado }) {
  // Utilidades para mostrar datos
  const edad = (() => {
    const birth = new Date(report.missingBirthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  })();
  const localizadoMsg = report.missingGender && report.missingGender.toLowerCase().startsWith('f') ? 'LOCALIZADA' : 'LOCALIZADO';
  return (
    <div className="contenedor" style={{
      width: '100%',
      maxWidth: '210mm',
      margin: 'auto',
      padding: 20,
      boxSizing: 'border-box',
      border: '3px solid #d32f2f',
      backgroundColor: '#fff',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='1' fill='%23e0e0e0'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '12px 12px'
    }}>
      {/* Encabezado naranja con logos y texto (alineación perfecta para exportación) */}
      <div
        style={{
          background: 'linear-gradient(to right, #ffcc00, #ff6600)',
          color: 'white',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          marginBottom: 0,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
          <img src="/src/AlertaMAFE.png" alt="Alerta MAFE" style={{ height: '90%', width: 'auto', objectFit: 'contain', display: 'block' }} />
        </div>
      </div>
      <div className="subtitulo" style={{
        backgroundColor: isCerrado ? '#1b8a3a' : '#d32f2f',
        color: 'white',
        fontSize: '20pt',
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold',
        marginTop: 10,
        letterSpacing: 2,
        textShadow: isCerrado ? '0 2px 8px #e6ffe6' : undefined
      }}>
        {isCerrado ? (
          report.missingGender && report.missingGender.toLowerCase().startsWith('f') ? (
            <img src="/src/localizada.png" alt="Localizada" style={{ height: 36, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
          ) : (
            <img src="/src/localizado.png" alt="Localizado" style={{ height: 36, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
          )
        ) : (
          <img src="/src/buscamos.png" alt="Buscamos a" style={{ height: 36, maxWidth: '100%', display: 'block', margin: '0 auto' }} />
        )}
      </div>
      {/* Nombre destacado debajo del recuadro rojo */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '20pt', margin: '18px 0 8px 0', letterSpacing: 1 }}>
        {report.missingName} {report.missingLastName}
      </div>
      <div className="contenido" style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 20 }}>
        <div className="foto" style={{ flex: '0 0 270px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
          {foto ? (
            <img src={foto} alt="Foto de la persona desaparecida" style={{ width: 270, height: 340, objectFit: 'cover', border: '4px solid #d32f2f', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', background: '#fff' }} />
          ) : (
            <div style={{ width: 270, height: 340, background: '#eee', border: '4px solid #d32f2f', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', margin: '0 auto' }}>Sin foto</div>
          )}
        </div>
        <div className="info" style={{ flex: 1.2, fontSize: '12pt', lineHeight: 1.6 }}>
          <p><strong>Edad:</strong> {edad} años</p>
          <p><strong>Nacionalidad:</strong> Paraguaya</p>
          <p><strong>Fecha de extravío:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
          <p><strong>Género:</strong> {report.missingGender}</p>
          <p><strong>Peso:</strong> {report.missingWeight ? `${report.missingWeight} kg` : 'No especificado'}</p>
          <p><strong>Estatura:</strong> {report.missingHeight ? `${report.missingHeight} cm` : 'No especificado'}</p>
          <p><strong>Color de piel:</strong> {report.skinColor || 'No especificado'}</p>
          <p><strong>Cabello:</strong> {`${report.hairLength || ''} ${report.hairType || ''} ${report.hairColor || ''}`.trim() || 'No especificado'}</p>
          <p><strong>Ojos:</strong> {report.eyeColor || 'No especificado'}</p>
          {/* No mostrar vestimenta ni señas particulares si es cerrado */}
          {!isCerrado && <p><strong>Última vestimenta:</strong> {ultimaVestimenta || 'No especificado'}</p>}
          {!isCerrado && <p><strong>Señas particulares:</strong> {otrosRasgos || 'No especificado'}</p>}
        </div>
      </div>
      {/* No mostrar relato si es cerrado */}
      {!isCerrado && (
        <div className="detalle-final" style={{ marginTop: 20, fontSize: '12pt', fontWeight: 'bold' }}>
          {relato || 'Sin relato disponible.'}
        </div>
      )}
      <div className="contacto" style={{ marginTop: 25, backgroundColor: isCerrado ? '#1b8a3a' : '#1976d2', color: 'white', padding: 15, textAlign: 'center', fontSize: '14pt', borderRadius: 6, fontWeight: isCerrado ? 'bold' : undefined }}>
        {isCerrado
          ? 'Gracias a toda la ciudadanía por su colaboración.'
          : (() => {
              let partes = [];
              if (posterContactPhones && posterContactPhones.includes('911')) {
                partes.push('comuníquese al 911');
              }
              if (posterContactPhones && posterContactPhones.includes('departamento') && posterDepartamentoPhone) {
                partes.push(`Llamada o WhatsApp con el Dpto. de Búsqueda y Localización de Personas ${posterDepartamentoPhone}`);
              }
              if (posterContactPhones && posterContactPhones.includes('reporter')) {
                partes.push(`o con ${report.reporterName} ${report.reporterLastName} ${report.reporterPhone}`);
              }
              if (posterContactPhones && posterContactPhones.includes('other') && posterOtherPhone) {
                partes.push(`o al ${posterOtherPhone}`);
              }
              if (partes.length === 0) return '';
              return `Si tiene información, ${partes.join('. ')}.`;
            })()
        }
      </div>
      <div className="footer" style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
        <img src="/src/pn.png" alt="Policía Nacional del Paraguay" style={{ height: 80, width: 'auto', objectFit: 'contain', display: 'inline-block', margin: 0, padding: 0 }} />
        <img src="/src/logo_gobierno-1.png" alt="República del Paraguay" style={{ height: 45, width: 'auto', objectFit: 'contain', display: 'inline-block', margin: 0, padding: 0 }} />
      </div>
    </div>
  );
}

// Utilidad para transformar rutas de imágenes subidas
function getImageUrl(url: string | Photo): string {
  if (!url) return '';
  if (typeof url === 'string') {
    return url.startsWith('/uploads/') ? url.replace('/uploads/', '/api/uploads/') : url;
  }
  return url.url.startsWith('/uploads/') ? url.url.replace('/uploads/', '/api/uploads/') : url.url;
}

export default function AdminPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CERRADO_VIVA' | 'CERRADO_FALLECIDA'>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage] = useState(10);
  const [confirmModal, setConfirmModal] = useState<{ action: string; report: Report } | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [followUpModal, setFollowUpModal] = useState<{ report: Report } | null>(null);
  const [followUpStatus, setFollowUpStatus] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [posterModal, setPosterModal] = useState<{ report: Report } | null>(null);
  const [selectedPosterPhoto, setSelectedPosterPhoto] = useState<Photo | null>(null);
  const [uploadedPosterPhoto, setUploadedPosterPhoto] = useState<string | null>(null);
  const [posterContactPhones, setPosterContactPhones] = useState(['911']);
  const [posterOtherPhone, setPosterOtherPhone] = useState('');
  const [posterDepartamentoPhone, setPosterDepartamentoPhone] = useState('');
  const [posterRelato, setPosterRelato] = useState('');
  const [posterOtrosRasgos, setPosterOtrosRasgos] = useState('');
  const [posterUltimaVestimenta, setPosterUltimaVestimenta] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModal, setCropModal] = useState<{ src: string; onCrop: (cropped: string) => void } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [relatoModal, setRelatoModal] = useState<{ report: Report } | null>(null);
  const [relatoPublico, setRelatoPublico] = useState('');
  const [loadingRelato, setLoadingRelato] = useState(false);
  const [otrosRasgosModal, setOtrosRasgosModal] = useState<null | { report: Report, onConfirm: (vestimenta: string, otros: string) => void }>(null);
  const [otrosVestimenta, setOtrosVestimenta] = useState('');
  const [otrosRasgos, setOtrosRasgos] = useState('');
  const [pendingPublicar, setPendingPublicar] = useState<null | { report: Report }> (null);
  const [fotos, setFotos] = useState<Photo[]>([]);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState<string[]>([]);
  const [nuevasFotos, setNuevasFotos] = useState<File[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedImg, setExpandedImg] = useState<string | null>(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function getCroppedImg(imageSrc, cropPixels) {
    const image = await createImage(imageSrc) as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  }
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', error => reject(error));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }

  useEffect(() => {
    const fetchReports = async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (filter !== 'ALL') {
        params.append('status', filter);
      }
      if (departmentFilter) {
        params.append('department', departmentFilter);
      }
      const res = await fetch(`/api/admin/denuncias?${params.toString()}`);
      const data = await res.json();
      setReports(data.denuncias);
      setTotal(data.total);
    };
    fetchReports();
  }, [currentPage, filter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    if (pendingPublicar) {
      // Simular click en el botón de confirmar publicación
      const btn = document.querySelector('button[data-publicar-confirm]') as HTMLButtonElement | null;
      btn?.click();
      setPendingPublicar(null);
    }
  }, [pendingPublicar]);

  useEffect(() => {
    if (confirmModal && confirmModal.action === 'PUBLICAR') {
      fetch(`/api/admin/denuncias/${confirmModal.report.id}/photos`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setFotos(data.photos);
            setFotosSeleccionadas(data.photos.filter(f => f.publica).map(f => f.id));
          }
        });
      setNuevasFotos([]);
    }
  }, [confirmModal]);

  useEffect(() => {
    setShowTechnicalDetails(false);
  }, [selectedReport]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="w-full bg-blue-900 text-white text-center py-2 text-xl font-bold shadow">
        Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos - Alerta MAFE - Panel de Administración
      </div>

      {/* Filtros y búsqueda */}
      <div className="max-w-5xl mx-auto mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded ${filter==='ALL'?'bg-blue-700 text-white':'bg-white border'}`}>Todas</button>
          <button onClick={() => setFilter('PENDING')} className={`px-4 py-2 rounded ${filter==='PENDING'?'bg-yellow-400 text-white':'bg-white border'}`}>Pendientes</button>
          <button onClick={() => setFilter('APPROVED')} className={`px-4 py-2 rounded ${filter==='APPROVED'?'bg-green-500 text-white':'bg-white border'}`}>Aprobadas</button>
          <button onClick={() => setFilter('REJECTED')} className={`px-4 py-2 rounded ${filter==='REJECTED'?'bg-red-500 text-white':'bg-white border'}`}>Rechazadas</button>
          <button onClick={() => setFilter('CERRADO_VIVA')} className={`px-4 py-2 rounded ${filter==='CERRADO_VIVA'?'bg-green-800 text-white':'bg-white border'}`}>Cerradas (encontradas vivas)</button>
          <button onClick={() => setFilter('CERRADO_FALLECIDA')} className={`px-4 py-2 rounded ${filter==='CERRADO_FALLECIDA'?'bg-gray-500 text-white':'bg-white border'}`}>Cerradas (halladas sin vida)</button>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          className="p-2 border rounded w-full md:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filtro por departamento */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-4 items-center">
          <label className="font-semibold">Filtrar por departamento:</label>
          <select
            value={departmentFilter}
            onChange={e => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="p-2 border rounded"
          >
            <option value="">Todos</option>
            {DEPARTAMENTOS.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de denuncias */}
      <div className="max-w-4xl mx-auto mt-8 mb-24 bg-gray-50 shadow-xl rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3">Denunciante</th>
              <th className="px-5 py-3">Persona desaparecida</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">No hay denuncias</td>
              </tr>
            ) : (
              reports.map(report => (
                <tr
                  key={report.id}
                  className="border-b transition-colors duration-200 hover:bg-blue-50"
                >
                  <td className="px-5 py-3">{report.reporterName} {report.reporterLastName}</td>
                  <td className="px-5 py-3">{report.missingName} {report.missingLastName}</td>
                  <td className="px-5 py-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${STATUS_COLORS[report.status]}`}>
                      {STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors duration-150"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Controles de paginación */}
        <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Panel lateral de detalles */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedReport(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Detalles de la denuncia</h2>
            {/* Mensaje de auditoría arriba del código de denuncia */}
            {(selectedReport.status !== 'PENDING' && (selectedReport.statusChangedByName || selectedReport.statusChangedBy) && selectedReport.statusChangedAt) && (
              <div className={`mb-4 text-sm font-semibold ${['CERRADO_VIVA','CERRADO_FALLECIDA'].includes(selectedReport.status) ? 'text-black' : (selectedReport.status === 'APPROVED' ? 'text-green-700' : 'text-red-700')}`}>
                Denuncia {STATUS_LABELS[selectedReport.status].toUpperCase()} por <b>{selectedReport.statusChangedByName || selectedReport.statusChangedBy}</b> en fecha {new Date(selectedReport.statusChangedAt).toLocaleDateString()} a las {new Date(selectedReport.statusChangedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {selectedReport.code && <div className="mb-2"><b>Código de denuncia:</b> {selectedReport.code}</div>}
            <div className="mb-2"><b>Denunciante:</b> {selectedReport.reporterName} {selectedReport.reporterLastName}</div>
            {selectedReport.reporterNationality && (
              <div className="mb-2"><b>Nacionalidad del denunciante:</b> {selectedReport.reporterNationality}</div>
            )}
            <div className="mb-2"><b>Teléfono:</b> {selectedReport.reporterPhone}</div>
            {selectedReport.reporterIdNumber && (
              <div className="mb-2">
                <b>Cédula del denunciante:</b> {selectedReport.reporterIdNumber}
              </div>
            )}
            {selectedReport.reporterLatitude && selectedReport.reporterLongitude && (
              <button
                className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${selectedReport.reporterLatitude},${selectedReport.reporterLongitude}`;
                  window.open(url, '_blank');
                }}
              >
                Ver domicilio del denunciante
              </button>
            )}
            {selectedReport.reporterAddress && (
              <div className="mb-2"><b>Domicilio:</b> {selectedReport.reporterAddress}</div>
            )}
            {selectedReport.department && (
              <div className="mb-2"><b>Departamento:</b> {selectedReport.department}</div>
            )}
            {/* Fotos de cédula */}
            {(selectedReport.reporterIdFront || selectedReport.reporterIdBack) ? (
              <div className="mb-4">
                <b>Fotos de cédula:</b>
                <div className="flex gap-4 mt-2">
                  {selectedReport.reporterIdFront && (
                    <div>
                      <img 
                        src={getImageUrl(selectedReport.reporterIdFront)} 
                        alt="Cédula frente" 
                        className="h-24 object-contain border rounded cursor-pointer hover:opacity-80" 
                        onClick={() => setExpandedImg(getImageUrl(selectedReport.reporterIdFront))}
                      />
                    </div>
                  )}
                  {selectedReport.reporterIdBack && (
                    <div>
                      <img 
                        src={getImageUrl(selectedReport.reporterIdBack)} 
                        alt="Cédula dorso" 
                        className="h-24 object-contain border rounded cursor-pointer hover:opacity-80" 
                        onClick={() => setExpandedImg(getImageUrl(selectedReport.reporterIdBack))}
                      />
                    </div>
                  )}
                </div>
                <button
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={async () => {
                    if (!selectedReport.id) return;
                    const res = await fetch(`/api/admin/denuncias/${selectedReport.id}/cedula.zip`);
                    if (res.status !== 200) {
                      alert("No hay fotos de cédula para descargar.");
                      return;
                    }
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cedula-${selectedReport.code || 'cedula'}.zip`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  Descargar cédula (.zip)
                </button>
              </div>
            ) : (
              <div className="mb-4 text-gray-500">No hay fotos de cédula disponibles.</div>
            )}
            {/* Datos de la persona desaparecida */}
            <div className="mb-2"><b>Persona desaparecida:</b> {selectedReport.missingName} {selectedReport.missingLastName}</div>
            {selectedReport.missingNationality && (
              <div className="mb-2"><b>Nacionalidad del desaparecido:</b> {selectedReport.missingNationality}</div>
            )}
            <div className="mb-2"><b>Fecha de nacimiento:</b> {new Date(selectedReport.missingBirthDate).toLocaleDateString()}</div>
            <div className="mb-2"><b>Edad:</b> {(() => {
              const birth = new Date(selectedReport.missingBirthDate);
              const today = new Date();
              let age = today.getFullYear() - birth.getFullYear();
              const m = today.getMonth() - birth.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
              return age;
            })()} años</div>
            <div className="mb-2"><b>Género:</b> {selectedReport.missingGender}</div>
            <div className="mb-2"><b>Fecha de denuncia:</b> {new Date(selectedReport.createdAt).toLocaleDateString()}</div>
            {selectedReport.missingLastSeen && (
              <div className="mb-2"><b>Visto por última vez:</b> {new Date(selectedReport.missingLastSeen).toLocaleDateString()}</div>
            )}
            <div className="mb-2"><b>Color de ojos:</b> {selectedReport.eyeColor}</div>
            <div className="mb-2"><b>Tipo de cabello:</b> {selectedReport.hairType}</div>
            <div className="mb-2"><b>Largo de cabello:</b> {selectedReport.hairLength}</div>
            <div className="mb-2"><b>Color de cabello:</b> {selectedReport.hairColor}</div>
            <div className="mb-2"><b>Color de piel:</b> {selectedReport.skinColor}</div>
            <div className="mb-2"><b>Peso:</b> {selectedReport.missingWeight ? `${selectedReport.missingWeight} kg` : 'No especificado'}</div>
            <div className="mb-2"><b>Estatura:</b> {selectedReport.missingHeight ? `${selectedReport.missingHeight} cm` : 'No especificado'}</div>
            {selectedReport.otherFeatures && <div className="mb-2"><b>Otras características:</b> {selectedReport.otherFeatures}</div>}
            {/* Relato de la denuncia */}
            {selectedReport.missingDescription && (
              <div className="mb-4">
                <b>Relato de la denuncia:</b>
                <div className="text-gray-800 whitespace-pre-line mt-1">{selectedReport.missingDescription}</div>
              </div>
            )}
            {/* Fotos del desaparecido */}
            {selectedReport.photos && selectedReport.photos.length > 0 ? (
              <div className="mb-4">
                <b>Fotos del desaparecido:</b>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedReport.photos.map((photo, i) => (
                    <div key={i} className="relative">
                      <img
                        src={getImageUrl(photo)}
                        alt={`Foto ${i + 1}`}
                        className={`h-24 w-24 object-cover border rounded cursor-pointer ${selectedPosterPhoto === photo ? 'border-blue-500 border-2' : ''}`}
                        onClick={() => setSelectedPosterPhoto(photo)}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={async () => {
                    if (!selectedReport.id) return;
                    const res = await fetch(`/api/admin/denuncias/${selectedReport.id}/fotos.zip`);
                    if (res.status !== 200) {
                      alert("No hay fotos del desaparecido para descargar.");
                      return;
                    }
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedReport.code || 'fotos'}.zip`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  Descargar todas las fotos
                </button>
              </div>
            ) : (
              <div className="mb-4 text-gray-500">No hay fotos disponibles</div>
            )}
            {/* Historial de acciones */}
            {selectedReport.caseActions && selectedReport.caseActions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-base mb-2">Historial de acciones</h3>
                <ul className="space-y-2">
                  {selectedReport.caseActions.map(action => (
                    <li key={action.id} className="border rounded p-2 bg-gray-50">
                      <div><b>Acción:</b> {action.action}</div>
                      <div><b>Usuario:</b> {action.user?.name || '(desconocido)'}</div>
                      <div><b>Fecha:</b> {new Date(action.createdAt).toLocaleString()}</div>
                      {action.note && <div><b>Nota interna:</b> {action.note}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Acciones según estado */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 w-full">
              {selectedReport.status === 'PENDING' && (
                <>
                  <button className="min-w-[160px] py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'APPROVED', report: selectedReport })}>
                    Aprobar
                  </button>
                  <button className="min-w-[160px] py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'REJECTED', report: selectedReport })}>
                    Rechazar
                  </button>
                  <button className="min-w-[160px] py-3 px-4 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setShowTechnicalDetails((prev) => !prev)}>
                    {showTechnicalDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
                  </button>
                </>
              )}
              {selectedReport.status === 'APPROVED' && (
                <>
                  <button className="min-w-[160px] py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setFollowUpModal({ report: selectedReport })}>
                    Cerrar caso
                  </button>
                  <button className="min-w-[160px] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => {
                    setPosterModal({ report: selectedReport });
                    setSelectedPosterPhoto(selectedReport.photos && selectedReport.photos[0] ? selectedReport.photos[0] : null);
                    setUploadedPosterPhoto(null);
                    setPosterContactPhones(['911']);
                  }}>
                    Crear afiche
                  </button>
                  {!selectedReport.publicado ? (
                    <button className="min-w-[160px] py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'PUBLICAR', report: selectedReport })}>
                      Publicar caso
                    </button>
                  ) : (
                    <button className="min-w-[160px] py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'DESPUBLICAR', report: selectedReport })}>
                      Retirar publicación
                    </button>
                  )}
                  <button className="min-w-[160px] py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => {
                    setRelatoModal({ report: selectedReport });
                    setRelatoPublico(selectedReport.relatoPublico || '');
                  }}>
                    Editar relato público
                  </button>
                  <button className="min-w-[160px] py-3 px-4 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setShowTechnicalDetails((prev) => !prev)}>
                    {showTechnicalDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
                  </button>
                </>
              )}
              {(selectedReport.status === 'CERRADO_VIVA' || selectedReport.status === 'CERRADO_FALLECIDA') && (
                <>
                  <button className="min-w-[160px] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => {
                    setPosterModal({ report: selectedReport });
                    setSelectedPosterPhoto(selectedReport.photos && selectedReport.photos[0] ? selectedReport.photos[0] : null);
                    setUploadedPosterPhoto(null);
                    setPosterContactPhones(['911']);
                  }}>
                    Crear afiche
                  </button>
                  {!selectedReport.publicado ? (
                    <button className="min-w-[160px] py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'PUBLICAR', report: selectedReport })}>
                      Publicar caso
                    </button>
                  ) : (
                    <button className="min-w-[160px] py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setConfirmModal({ action: 'DESPUBLICAR', report: selectedReport })}>
                      Retirar publicación
                    </button>
                  )}
                  <button className="min-w-[160px] py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => {
                    setRelatoModal({ report: selectedReport });
                    setRelatoPublico(selectedReport.relatoPublico || '');
                  }}>
                    Editar relato público
                  </button>
                  <button className="min-w-[160px] py-3 px-4 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setShowTechnicalDetails((prev) => !prev)}>
                    {showTechnicalDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
                  </button>
                </>
              )}
              {selectedReport.status === 'REJECTED' && (
                <button className="min-w-[160px] py-3 px-4 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-md transition-all" onClick={() => setShowTechnicalDetails((prev) => !prev)}>
                  {showTechnicalDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
                </button>
              )}
            </div>
            {showTechnicalDetails && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
                <h3 className="font-semibold mb-2">Detalles técnicos:</h3>
                {selectedReport.reporterIp && <p><b>IP:</b> {selectedReport.reporterIp}</p>}
                {selectedReport.reporterUserAgent && <p><b>User Agent:</b> {selectedReport.reporterUserAgent}</p>}
                {selectedReport.reporterDeviceType && <p><b>Dispositivo:</b> {selectedReport.reporterDeviceType}</p>}
                {typeof selectedReport.reporterIsProxy !== 'undefined' && <p><b>Proxy/VPN:</b> {selectedReport.reporterIsProxy ? 'Sí' : 'No'}</p>}
                {selectedReport.reporterVpnProvider && <p><b>Proveedor VPN:</b> {selectedReport.reporterVpnProvider}</p>}
              </div>
            )}
            <button className="mt-2 w-full bg-gray-700 text-white py-3 rounded-xl shadow-md hover:bg-gray-900 text-lg font-semibold transition-all" onClick={() => setSelectedReport(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {/* Modal de confirmación */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            <h3 className="text-xl font-bold mb-4 text-center">
              {confirmModal.action === 'APPROVED' ? 'Confirmar aprobación'
                : confirmModal.action === 'REJECTED' ? 'Confirmar rechazo'
                : confirmModal.action === 'PUBLICAR' ? 'Confirmar publicación'
                : confirmModal.action === 'DESPUBLICAR' ? 'Confirmar retiro de publicación'
                : ''}
            </h3>
            <p className="mb-4 text-gray-700">
              {confirmModal.action === 'APPROVED' ? '¿Estás seguro de aprobar esta denuncia?\n\nAntes de continuar, recuerda que debes seguir el protocolo de actuación:\n- Lee detenidamente el caso.\n- Contacta con la persona denunciante antes de aprobar o rechazar la denuncia.'
                : confirmModal.action === 'REJECTED' ? '¿Estás seguro de rechazar esta denuncia?\n\nAntes de continuar, recuerda que debes seguir el protocolo de actuación:\n- Lee detenidamente el caso.\n- Contacta con la persona denunciante antes de aprobar o rechazar la denuncia.'
                : confirmModal.action === 'PUBLICAR' ? '¿Estás seguro de publicar este caso? El afiche y los datos seleccionados serán visibles para la ciudadanía.'
                : confirmModal.action === 'DESPUBLICAR' ? '¿Estás seguro de retirar la publicación de este caso? El caso dejará de estar visible para la ciudadanía, pero permanecerá en el sistema.'
                : ''}
            </p>
            {confirmModal.action === 'PUBLICAR' && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Fotos del desaparecido:</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {fotos.map(foto => (
                      <div key={foto.id} className="flex flex-col items-center">
                        <img src={getImageUrl(foto)} alt="Foto" className="h-20 w-20 object-cover border rounded" />
                        <label className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            checked={fotosSeleccionadas.includes(foto.id)}
                            onChange={e => {
                              setFotosSeleccionadas(sel =>
                                e.target.checked
                                  ? [...sel, foto.id]
                                  : sel.filter(id => id !== foto.id)
                              );
                            }}
                          />
                          <span className="ml-1 text-xs">Mostrar en la web</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setNuevasFotos(Array.from(e.target.files || []))}
                  />
                  {nuevasFotos.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {nuevasFotos.length} foto(s) seleccionada(s) para subir
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Última vestimenta</label>
                  <input type="text" className="w-full border rounded p-2" value={otrosVestimenta} onChange={e => setOtrosVestimenta(e.target.value)} placeholder="Ej: remera azul, jeans..." />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Otros rasgos característicos</label>
                  <input type="text" className="w-full border rounded p-2" value={otrosRasgos} onChange={e => setOtrosRasgos(e.target.value)} placeholder="Ej: cicatriz, tatuaje..." />
                </div>
              </>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmModal(null)}
                disabled={loadingAction}
              >
                Cancelar
              </button>
              <button
                className={confirmModal.action === 'APPROVED' ? 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
                  : confirmModal.action === 'REJECTED' ? 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
                  : confirmModal.action === 'PUBLICAR' ? 'bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
                  : 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'}
                disabled={loadingAction}
                onClick={async () => {
                  setLoadingAction(true);
                  const { report, action } = confirmModal;
                  let res;
                  let updatedReport = null;
                  if (action === 'PUBLICAR') {
                    // 1. Subir nuevas fotos si hay
                    if (nuevasFotos.length > 0) {
                      const formData = new FormData();
                      nuevasFotos.forEach(f => formData.append('photos', f));
                      await fetch(`/api/admin/denuncias/${report.id}/photos`, {
                        method: 'POST',
                        body: formData,
                      });
                    }
                    // 2. Actualizar publica de todas las fotos
                    await fetch(`/api/admin/denuncias/${report.id}/photos`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(fotos.map(f => ({ id: f.id, publica: fotosSeleccionadas.includes(f.id) }))),
                    });
                    // 3. Actualizar campos antes de publicar
                    await fetch(`/api/admin/denuncias/${report.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ missingClothing: otrosVestimenta, otherFeatures: otrosRasgos, relatoPublico, relatoAfiche: posterRelato })
                    });
                    res = await fetch(`/api/admin/denuncias/${report.id}/publicar`, { method: 'PATCH' });
                    if (res.ok) {
                      const data = await res.json();
                      updatedReport = data.report;
                    }
                  } else if (action === 'DESPUBLICAR') {
                    res = await fetch(`/api/admin/denuncias/${report.id}/despublicar`, { method: 'PATCH' });
                    if (res.ok) {
                      const data = await res.json();
                      updatedReport = data.report;
                    }
                  } else {
                    // Mantener lógica existente para aprobar/rechazar
                    res = await fetch(`/api/admin/denuncias/${report.id}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: action })
                    });
                  }
                  setLoadingAction(false);
                  setConfirmModal(null);
                  if (res && res.ok) {
                    if (action === 'PUBLICAR' || action === 'DESPUBLICAR') {
                      // Actualizar selectedReport y reports sin cerrar el panel
                      if (updatedReport) {
                        setSelectedReport(prev => prev && prev.id === updatedReport.id ? { ...prev, publicado: updatedReport.publicado } : prev);
                        setReports(prev => prev.map(r => r.id === updatedReport.id ? { ...r, publicado: updatedReport.publicado } : r));
                      }
                    } else {
                      setSelectedReport(null);
                    }
                    // Refresca la lista
                    const params = new URLSearchParams({
                      page: currentPage.toString(),
                      limit: itemsPerPage.toString(),
                    });
                    const data = await (await fetch(`/api/admin/denuncias?${params.toString()}`)).json();
                    setReports(data.denuncias);
                    setTotal(data.total);
                  } else {
                    alert('Error al actualizar la denuncia');
                  }
                }}
                data-publicar-confirm={confirmModal.action === 'PUBLICAR' ? true : undefined}
              >
                {confirmModal.action === 'PUBLICAR' ? 'Confirmar y publicar' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de seguimiento */}
      {followUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
            <h3 className="text-xl font-bold mb-4 text-center">Seguimiento y cierre de caso</h3>
            <div className="mb-4">
              <label className="block font-semibold mb-2">¿Cómo se cierra el caso?</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="finalStatus" value="CERRADO_VIVA" checked={followUpStatus === 'CERRADO_VIVA'} onChange={() => setFollowUpStatus('CERRADO_VIVA')} />
                  Persona encontrada viva
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="finalStatus" value="CERRADO_FALLECIDA" checked={followUpStatus === 'CERRADO_FALLECIDA'} onChange={() => setFollowUpStatus('CERRADO_FALLECIDA')} />
                  Persona hallada sin vida
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Nota interna (opcional)</label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={followUpNote}
                onChange={e => setFollowUpNote(e.target.value)}
                placeholder="Agrega detalles relevantes para el historial interno..."
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => { setFollowUpModal(null); setFollowUpStatus(''); setFollowUpNote(''); }}
                disabled={loadingFollowUp}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={!followUpStatus || loadingFollowUp}
                onClick={async () => {
                  setLoadingFollowUp(true);
                  // PATCH al endpoint de seguimiento/cierre
                  const res = await fetch(`/api/admin/denuncias/${followUpModal.report.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: followUpStatus, note: followUpNote })
                  });
                  setLoadingFollowUp(false);
                  setFollowUpModal(null);
                  setFollowUpStatus('');
                  setFollowUpNote('');
                  if (res.ok) {
                    setSelectedReport(null);
                    // Refresca la lista
                    const params = new URLSearchParams({
                      page: currentPage.toString(),
                      limit: itemsPerPage.toString(),
                    });
                    const data = await (await fetch(`/api/admin/denuncias?${params.toString()}`)).json();
                    setReports(data.denuncias);
                    setTotal(data.total);
                  }
                }}
              >
                Confirmar cierre
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de afiche */}
      {posterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Previsualización del afiche</h3>
            {/* Selección de foto */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Elige una de las fotos subidas:</div>
              <div className="flex gap-2 flex-wrap">
                {posterModal.report.photos && posterModal.report.photos.length > 0 ? (
                  posterModal.report.photos.map((photo, i) => (
                    <div key={i} className="relative">
                      <img
                        src={getImageUrl(photo)}
                        alt={`Foto ${i + 1}`}
                        className={`h-24 w-24 object-cover border rounded cursor-pointer ${selectedPosterPhoto === photo ? 'border-blue-500 border-2' : ''}`}
                        onClick={() => setSelectedPosterPhoto(photo)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No hay fotos disponibles.</div>
                )}
              </div>
            </div>
            {/* Opción para subir una fotografía manualmente */}
            <div className="mt-4">
              <div className="font-semibold mb-2">O sube una fotografía manualmente:</div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      setCropModal({
                        src: result,
                        onCrop: (cropped) => {
                          setUploadedPosterPhoto(cropped);
                          setSelectedPosterPhoto(null);
                          setCropModal(null);
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                className="text-blue-600 underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Subir foto
              </button>
              {uploadedPosterPhoto && (
                <div className="mt-2">
                  <img src={getImageUrl(uploadedPosterPhoto)} alt="Foto subida" className="h-24 w-24 object-cover border rounded" />
                </div>
              )}
            </div>
            {/* Modal de crop manual */}
            {cropModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative">
                  <h3 className="text-xl font-bold mb-4 text-center">Crop de imagen</h3>
                  <div className="relative h-64 w-full">
                    <Cropper
                      image={cropModal.src}
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 4}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  {/* Control de zoom */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={e => setZoom(Number(e.target.value))}
                      className="w-48"
                    />
                    <span className="text-sm">{zoom.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => setCropModal(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      onClick={async () => {
                        if (croppedAreaPixels) {
                          const croppedImage = await getCroppedImg(cropModal.src, croppedAreaPixels) as string;
                          cropModal.onCrop(croppedImage);
                        }
                      }}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Edición de relato y rasgos físicos */}
            <div className="mb-6">
              <div className="font-semibold mb-1 mt-0">Rasgos físicos:</div>
              <div className="mb-1">Peso: <b>{posterModal.report.missingWeight ? `${posterModal.report.missingWeight} kg` : 'No especificado'}</b></div>
              <div className="mb-1">Estatura: <b>{posterModal.report.missingHeight ? `${posterModal.report.missingHeight} cm` : 'No especificado'}</b></div>
              <div className="mb-1">Color de ojos: <b>{posterModal.report.eyeColor || 'No especificado'}</b></div>
              <div className="mb-1">Tipo de cabello: <b>{posterModal.report.hairType || 'No especificado'}</b></div>
              <div className="mb-1">Largo de cabello: <b>{posterModal.report.hairLength || 'No especificado'}</b></div>
              <div className="mb-1">Color de cabello: <b>{posterModal.report.hairColor || 'No especificado'}</b></div>
              <div className="mb-1">Color de piel: <b>{posterModal.report.skinColor || 'No especificado'}</b></div>
              <div className="mb-1">Otros rasgos físicos: <input type="text" className="border rounded p-1 ml-2" value={posterOtrosRasgos} onChange={e => setPosterOtrosRasgos(e.target.value)} placeholder="Ej: cicatriz, tatuaje..." style={{ width: 220 }} /></div>
              <div className="mb-1">Última vestimenta: <input type="text" className="border rounded p-1 ml-2" value={posterUltimaVestimenta} onChange={e => setPosterUltimaVestimenta(e.target.value)} placeholder="Ej: remera azul, jeans..." style={{ width: 220 }} /></div>
            </div>
            <div className="mb-6">
              <div className="font-semibold mb-1">Relato para el afiche:</div>
              <textarea className="w-full border rounded p-2" rows={4} value={posterRelato} onChange={e => setPosterRelato(e.target.value)} placeholder="Redacta el relato que aparecerá en el afiche institucional..." />
            </div>
            {/* Teléfonos de contacto: solo mostrar si NO es cerrado */}
            {(() => {
              const isCerrado = posterModal.report.status === 'CERRADO_VIVA' || posterModal.report.status === 'CERRADO_FALLECIDA';
              return !isCerrado && (
                <div className="mb-4">
                  <div className="font-semibold mb-1">Teléfonos de contacto:</div>
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={posterContactPhones.includes('reporter')} onChange={e => {
                      setPosterContactPhones(phones => e.target.checked ? [...phones, 'reporter'] : phones.filter(p => p !== 'reporter'));
                    }} />
                    Número del denunciante: <span className="font-mono">{posterModal.report.reporterPhone}</span>
                  </label>
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={posterContactPhones.includes('other')} onChange={e => {
                      setPosterContactPhones(phones => e.target.checked ? [...phones, 'other'] : phones.filter(p => p !== 'other'));
                    }} />
                    Otro número:
                    <input type="text" className="border rounded p-1 ml-2" value={posterOtherPhone} onChange={e => setPosterOtherPhone(e.target.value)} placeholder="Ingrese otro número" style={{ width: 140 }} />
                  </label>
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={posterContactPhones.includes('departamento')} onChange={e => {
                      setPosterContactPhones(phones => e.target.checked ? [...phones, 'departamento'] : phones.filter(p => p !== 'departamento'));
                    }} />
                    Dpto. Búsqueda y Localización:
                    <input type="text" className="border rounded p-1 ml-2" value={posterDepartamentoPhone} onChange={e => setPosterDepartamentoPhone(e.target.value)} placeholder="Número del Dpto." style={{ width: 140 }} />
                  </label>
                  <label className="flex items-center gap-2 mb-1">
                    <input type="checkbox" checked={posterContactPhones.includes('911')} onChange={e => {
                      setPosterContactPhones(phones => e.target.checked ? [...phones, '911'] : phones.filter(p => p !== '911'));
                    }} />
                    911
                  </label>
                </div>
              );
            })()}
            {/* Previsualización del afiche */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Previsualización del afiche:</div>
              <div id="poster-preview">
                <PosterAfiche
                  report={posterModal.report}
                  foto={getImageUrl(uploadedPosterPhoto || selectedPosterPhoto || '')}
                  relato={posterRelato}
                  otrosRasgos={posterOtrosRasgos}
                  ultimaVestimenta={posterUltimaVestimenta}
                  telefonos={posterContactPhones.map(tipo => {
                    if (tipo === 'reporter') return posterModal.report.reporterPhone;
                    if (tipo === 'other') return posterOtherPhone;
                    if (tipo === 'departamento') return posterDepartamentoPhone;
                    if (tipo === '911') return '911';
                    return null;
                  }).filter(Boolean)}
                  posterContactPhones={posterContactPhones}
                  posterDepartamentoPhone={posterDepartamentoPhone}
                  posterOtherPhone={posterOtherPhone}
                  isCerrado={posterModal.report.status === 'CERRADO_VIVA' || posterModal.report.status === 'CERRADO_FALLECIDA'}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setPosterModal(null)}
              >
                Cancelar
              </button>
              {/* Botones de descarga JPG/PDF */}
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                disabled={!selectedPosterPhoto && !uploadedPosterPhoto}
                onClick={async () => {
                  const poster = document.getElementById('poster-preview');
                  if (!poster) return;
                  const canvas = await html2canvas(poster, { scale: 2 });
                  const imgData = canvas.toDataURL('image/jpeg', 1.0);
                  // Descargar JPG
                  const link = document.createElement('a');
                  link.href = imgData;
                  link.download = `afiche-${posterModal.report.missingName}.jpg`;
                  link.click();
                }}
              >
                Descargar JPG
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={!selectedPosterPhoto && !uploadedPosterPhoto}
                onClick={async () => {
                  const poster = document.getElementById('poster-preview');
                  if (!poster) return;
                  const canvas = await html2canvas(poster, { scale: 3, useCORS: true });
                  const imgData = canvas.toDataURL('image/png', 1.0);
                  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                  const pageWidth = 595;
                  const pageHeight = 842;
                  const imgWidth = canvas.width;
                  const imgHeight = canvas.height;
                  const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                  const finalWidth = imgWidth * scale;
                  const finalHeight = imgHeight * scale;
                  const x = (pageWidth - finalWidth) / 2;
                  const y = (pageHeight - finalHeight) / 2;
                  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
                  pdf.save(`afiche-${posterModal.report.missingName}.pdf`);
                }}
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de relato público */}
      {relatoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Editar relato público</h3>
            <textarea
              className="w-full border rounded p-3 mb-4"
              rows={6}
              value={relatoPublico}
              onChange={e => setRelatoPublico(e.target.value)}
              placeholder="Redacta el relato público que será visible en el afiche y la página pública..."
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setRelatoModal(null)}
                disabled={loadingRelato}
              >
                Cancelar
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                disabled={loadingRelato || !relatoPublico.trim()}
                onClick={async () => {
                  setLoadingRelato(true);
                  const res = await fetch(`/api/admin/denuncias/${relatoModal.report.id}/relato`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ relatoPublico }),
                  });
                  setLoadingRelato(false);
                  if (res.ok) {
                    setRelatoModal(null);
                    // Refresca el reporte seleccionado y la lista
                    const params = new URLSearchParams({
                      page: currentPage.toString(),
                      limit: itemsPerPage.toString(),
                    });
                    const data = await (await fetch(`/api/admin/denuncias?${params.toString()}`)).json();
                    setReports(data.denuncias);
                    // Actualiza el relato en el panel abierto
                    setSelectedReport(prev => prev && prev.id === relatoModal.report.id ? { ...prev, relatoPublico } : prev);
                  } else {
                    alert('Error al guardar el relato público');
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de imagen expandida */}
      {expandedImg && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]"
          onClick={() => setExpandedImg(null)}
        >
          <img 
            src={expandedImg} 
            alt="Imagen expandida" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setExpandedImg(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}