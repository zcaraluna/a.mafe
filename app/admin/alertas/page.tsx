"use client";

import NavBar from '../../../components/NavBar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AlertModal from '../../components/AlertModal';

function getImageUrl(url: string) {
  if (!url) return '';
  const timestamp = Date.now();
  if (url.startsWith('/uploads/')) {
    return `${url.replace('/uploads/', '/api/uploads/')}?t=${timestamp}`;
  }
  return url;
}

export default function AdminAlertas() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const res = await fetch('/api/admin/alertas');
      const data = await res.json();
      if (data.ok) setAlertas(data.alertas || []);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (data: any) => {
    try {
      const formData = new FormData();
      
      // Agregar campos básicos
      Object.keys(data).forEach(key => {
        if (key !== 'fotos') {
          formData.append(key, data[key]);
        }
      });

      if (data.fotoPrincipal) {
        formData.append('fotoPrincipal', data.fotoPrincipal);
      }

      // Agregar fotos
      if (data.fotos) {
        Array.from(data.fotos).forEach((file: File) => {
          formData.append('fotos', file);
        });
      }

      const res = await fetch('/api/admin/alertas', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAlertas();
      } else {
        alert('Error al crear la alerta');
      }
    } catch (error) {
      console.error('Error al crear alerta:', error);
      alert('Error al crear la alerta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Gestión de alertas</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold"
          >
            + Nueva alerta
          </button>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-12">Cargando alertas...</div>
        ) : alertas.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No hay alertas registradas.</div>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Departamentos</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((alerta) => (
                <tr key={alerta.id} className="border-b last:border-b-0">
                  <td className="p-3 font-semibold">{alerta.nombre}</td>
                  <td className="p-3">{alerta.estado}</td>
                  <td className="p-3 text-sm">{alerta.departamentos?.join(', ')}</td>
                  <td className="p-3">
                    <Link href={`/admin/alertas/${alerta.id}`} className="text-blue-700 hover:underline font-semibold">Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAlert}
      />
    </div>
  );
} 