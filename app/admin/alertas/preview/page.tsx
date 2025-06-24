'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '../../../../lib/date-utils';

interface PreviewData {
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
  nivelPeligrosidad: 'BAJO' | 'MEDIO' | 'ALTO' | 'EXTREMO';
  relato: string;
  fotos: string[];
}

function getImageUrl(url: string) {
  if (!url) return '';
  const timestamp = Date.now();
  if (url.startsWith('/uploads/')) {
    return `${url.replace('/uploads/', '/api/uploads/')}?t=${timestamp}`;
  }
  return url;
}

export default function AlertPreview() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('alertPreview');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Asegurarse de que las URLs de las fotos incluyan el timestamp
      if (data.fotos) {
        data.fotos = data.fotos.map((url: string) => getImageUrl(url));
      }
      setPreviewData(data);
    } else {
      router.push('/admin/alertas');
    }
  }, [router]);

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Previsualización de Alerta</h1>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información personal */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="mt-1">{previewData.nombre} {previewData.apellido}</p>
                </div>
                
                {previewData.alias && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Alias</label>
                    <p className="mt-1">{previewData.alias}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                  <p className="mt-1">{formatDateTime(previewData.fechaNacimiento)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Género</label>
                  <p className="mt-1 capitalize">{previewData.genero}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Nacionalidad</label>
                  <p className="mt-1">{previewData.nacionalidad}</p>
                </div>

                {previewData.documentoIdentidad && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Documento de Identidad</label>
                    <p className="mt-1">{previewData.documentoIdentidad}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Departamentos</label>
                <div className="flex flex-wrap gap-2">
                  {previewData.departamentos.map(depto => (
                    <span
                      key={depto}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {depto}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información de la alerta */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Detalles de la Alerta</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Motivo</label>
                  <p className="mt-1">{previewData.motivo}</p>
                </div>

                {previewData.motivoOrdenCaptura && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Motivo de Orden de Captura</label>
                    <p className="mt-1">{previewData.motivoOrdenCaptura}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600">Nivel de Peligrosidad</label>
                  <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getNivelPeligrosidadColor(previewData.nivelPeligrosidad)}`}>
                    {previewData.nivelPeligrosidad}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Relato</label>
                  <p className="mt-1 whitespace-pre-wrap">{previewData.relato}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Fotos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {previewData.fotos.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 