import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Lista de nacionalidades (ejemplo con algunas, deberías incluir todas)
const NACIONALIDADES = [
  "Paraguaya",
  "Argentina",
  "Brasileña",
  "Boliviana",
  "Chilena",
  "Colombiana",
  "Ecuatoriana",
  "Peruana",
  "Uruguaya",
  "Venezolana",
  // ... agregar todas las nacionalidades
];

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

const MOTIVOS_ORDEN_CAPTURA = [
  "Abuso sexual en niños",
  "Incumplimiento del deber alimentario",
  "Homicidio",
  "Amenaza",
  "Violencia familiar",
  "Maltrato infantil",
  "Otros"
];

const alertSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  alias: z.string().optional(),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  genero: z.enum(['masculino', 'femenino'], { required_error: 'El género es requerido' }),
  nacionalidad: z.string().min(1, 'La nacionalidad es requerida'),
  documentoIdentidad: z.string().optional(),
  departamentos: z.array(z.string()).min(1, 'Seleccione al menos un departamento'),
  motivo: z.string().min(1, 'El motivo es requerido'),
  motivoOrdenCaptura: z.string().optional(),
  nivelPeligrosidad: z.enum(['BAJO', 'MEDIO', 'ALTO', 'EXTREMO']),
  relato: z.string().min(50, 'El relato debe tener al menos 50 caracteres'),
  fotos: z.any(),
  altura: z.string().optional(),
  peso: z.string().optional(),
  colorOjos: z.string().optional(),
  colorCabello: z.string().optional(),
  tipoCabello: z.string().optional(),
  seniasParticulares: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlertFormData) => void;
  initialData?: Partial<AlertFormData & { fotosExistentes?: { url: string; id: string }[] }>;
}

function getImageUrl(url: string) {
  if (!url) return '';
  const timestamp = Date.now();
  if (url.startsWith('/uploads/')) {
    return `${url.replace('/uploads/', '/api/uploads/')}?t=${timestamp}`;
  }
  return url;
}

export default function AlertModal({ isOpen, onClose, onSubmit, initialData }: AlertModalProps) {
  const router = useRouter();
  const [edad, setEdad] = useState<number | null>(null);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>([]);
  const [showMotivoOrdenCaptura, setShowMotivoOrdenCaptura] = useState(false);
  const [nacionalidadSearch, setNacionalidadSearch] = useState('');
  const [filteredNacionalidades, setFilteredNacionalidades] = useState<string[]>([]);
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);
  const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null);
  const [fotosExistentes, setFotosExistentes] = useState<{ url: string; id: string }[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      nacionalidad: 'Paraguaya',
      nivelPeligrosidad: 'MEDIO'
    }
  });

  const motivo = watch('motivo');

  useEffect(() => {
    setShowMotivoOrdenCaptura(motivo === 'Orden de captura');
  }, [motivo]);

  useEffect(() => {
    const fechaNacimiento = watch('fechaNacimiento');
    if (fechaNacimiento) {
      const hoy = new Date();
      const fechaNac = new Date(fechaNacimiento);
      let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
      const mesActual = hoy.getMonth();
      const mesNacimiento = fechaNac.getMonth();
      
      if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
        edadCalculada--;
      }
      
      setEdad(edadCalculada);
    }
  }, [watch('fechaNacimiento')]);

  useEffect(() => {
    const filtered = NACIONALIDADES.filter(n => 
      n.toLowerCase().includes(nacionalidadSearch.toLowerCase())
    );
    setFilteredNacionalidades(filtered);
  }, [nacionalidadSearch]);

  useEffect(() => {
    const files = watch('fotos');
    if (files && files.length > 0) {
      // Limpiar URLs anteriores para evitar memory leaks
      previewFotos.forEach(url => URL.revokeObjectURL(url));
      
      const urls = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setPreviewFotos(urls);

      // Cleanup function
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviewFotos([]);
    }
  }, [watch('fotos')]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        fechaNacimiento: initialData.fechaNacimiento ? new Date(initialData.fechaNacimiento).toISOString().slice(0,10) : '',
        nacionalidad: initialData.nacionalidad || 'Paraguaya',
        documentoIdentidad: initialData.documentoIdentidad ? String(initialData.documentoIdentidad) : '',
        motivoOrdenCaptura: initialData.motivoOrdenCaptura ? String(initialData.motivoOrdenCaptura) : '',
        fotos: undefined
      });
      setSelectedDepartamentos(initialData.departamentos || []);
      setValue('departamentos', initialData.departamentos || []);
      setFotosExistentes(initialData.fotosExistentes || []);
      if ('fotoPrincipal' in initialData && initialData.fotoPrincipal) {
        setFotoPrincipal(String(initialData.fotoPrincipal));
      } else if (initialData.fotosExistentes && initialData.fotosExistentes.length > 0) {
        setFotoPrincipal(initialData.fotosExistentes[0].url);
      } else {
        setFotoPrincipal(null);
      }
      setNacionalidadSearch('');
    }

    // Cleanup function
    return () => {
      previewFotos.forEach(url => URL.revokeObjectURL(url));
    };
  }, [initialData, reset, setValue]);

  const handleDepartamentoChange = (departamento: string) => {
    setSelectedDepartamentos(prev => {
      let newValue;
      if (prev.includes(departamento)) {
        newValue = prev.filter(d => d !== departamento);
      } else {
        newValue = [...prev, departamento];
      }
      setValue('departamentos', newValue, { shouldValidate: true });
      return newValue;
    });
  };

  const handlePreview = async (data: AlertFormData) => {
    const fotosArray = data.fotos && typeof data.fotos[Symbol.iterator] === 'function'
      ? Array.from(data.fotos).map((file: File) => URL.createObjectURL(file))
      : [];
    const previewData = {
      ...data,
      departamentos: selectedDepartamentos,
      fotos: fotosArray
    };
    sessionStorage.setItem('alertPreview', JSON.stringify(previewData));
    window.open('/admin/alertas/preview', '_blank');
  };

  const onSubmitForm = (data: AlertFormData) => {
    const files = data.fotos;
    const hayFotosNuevas = files && files.length > 0;
    const hayFotosExistentes = fotosExistentes && fotosExistentes.length > 0;
    if (!hayFotosNuevas && !hayFotosExistentes) {
      alert('Se requiere al menos una foto');
      return;
    }

    let fotoPrincipalIndex = null;
    let fotoPrincipalUrl = null;
    
    if (fotoPrincipal) {
      // Primero buscar en fotos nuevas
      const idxNueva = previewFotos.findIndex((url) => url === fotoPrincipal);
      if (idxNueva !== -1) {
        fotoPrincipalIndex = idxNueva;
      } else {
        // Si no está en las nuevas, debe ser una existente
        fotoPrincipalUrl = fotoPrincipal;
      }
    } else if (hayFotosNuevas) {
      // Si no se seleccionó foto principal pero hay fotos nuevas, usar la primera
      fotoPrincipalIndex = 0;
    } else if (hayFotosExistentes) {
      // Si no hay fotos nuevas pero hay existentes, usar la primera existente
      fotoPrincipalUrl = fotosExistentes[0].url;
    }

    const dataConPrincipal = {
      ...data,
      motivoOrdenCaptura: data.motivo === 'Orden de captura' ? data.motivoOrdenCaptura : '',
      departamentos: selectedDepartamentos,
      fotosExistentes,
      fotoPrincipalIndex,
      fotoPrincipalUrl,
    };

    onSubmit(dataConPrincipal);
    
    // Limpiar el formulario y estados
    reset();
    setSelectedDepartamentos([]);
    setEdad(null);
    setFotoPrincipal(null);
    previewFotos.forEach(url => URL.revokeObjectURL(url));
    setPreviewFotos([]);
    setNacionalidadSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">{initialData ? 'Editar Alerta' : 'Nueva Alerta'}</h2>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Datos básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nombres *</label>
              <input
                {...register('nombre')}
                className="w-full p-2 border rounded"
                placeholder="Nombres"
              />
              {errors.nombre && (
                <span className="text-red-500 text-sm">{typeof errors.nombre.message === 'string' ? errors.nombre.message : ''}</span>
              )}
            </div>
            
            <div>
              <label className="block mb-2">Apellidos *</label>
              <input
                {...register('apellido')}
                className="w-full p-2 border rounded"
                placeholder="Apellidos"
              />
              {errors.apellido && (
                <span className="text-red-500 text-sm">{typeof errors.apellido.message === 'string' ? errors.apellido.message : ''}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2">Alias (opcional)</label>
            <input
              {...register('alias')}
              className="w-full p-2 border rounded"
              placeholder="Alias separados por comas"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Fecha de Nacimiento *</label>
              <input
                type="date"
                {...register('fechaNacimiento')}
                className="w-full p-2 border rounded"
              />
              {errors.fechaNacimiento && (
                <span className="text-red-500 text-sm">{typeof errors.fechaNacimiento.message === 'string' ? errors.fechaNacimiento.message : ''}</span>
              )}
              {edad !== null && (
                <span className="text-sm text-gray-600">Edad: {edad} años</span>
              )}
            </div>

            <div>
              <label className="block mb-2">Género *</label>
              <select
                {...register('genero')}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
              {errors.genero && (
                <span className="text-red-500 text-sm">{typeof errors.genero.message === 'string' ? errors.genero.message : ''}</span>
              )}
            </div>
          </div>

          {/* Nacionalidad con búsqueda */}
          <div>
            <label className="block mb-2">Nacionalidad</label>
            <div className="relative">
              <input
                type="text"
                value={watch('nacionalidad') || ''}
                onChange={(e) => {
                  setValue('nacionalidad', e.target.value, { shouldValidate: true });
                  setNacionalidadSearch(e.target.value);
                }}
                onBlur={() => {
                  const match = NACIONALIDADES.find(n => n.toLowerCase() === (watch('nacionalidad') || '').toLowerCase());
                  if (match) {
                    setValue('nacionalidad', match, { shouldValidate: true });
                    setNacionalidadSearch('');
                  }
                  setTimeout(() => setFilteredNacionalidades([]), 100);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredNacionalidades.length > 0) {
                    setValue('nacionalidad', filteredNacionalidades[0], { shouldValidate: true });
                    setNacionalidadSearch('');
                    setFilteredNacionalidades([]);
                    e.preventDefault();
                  }
                }}
                className="w-full p-2 border rounded"
                placeholder="Buscar nacionalidad..."
                autoComplete="off"
              />
              {filteredNacionalidades.length > 0 && nacionalidadSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {filteredNacionalidades.map(nacionalidad => (
                    <div
                      key={nacionalidad}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => {
                        setValue('nacionalidad', nacionalidad, { shouldValidate: true });
                        setNacionalidadSearch(nacionalidad);
                        setFilteredNacionalidades([]);
                      }}
                    >
                      {nacionalidad}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="hidden"
              {...register('nacionalidad')}
            />
            {errors.nacionalidad && (
              <span className="text-red-500 text-sm">{typeof errors.nacionalidad.message === 'string' ? errors.nacionalidad.message : ''}</span>
            )}
          </div>

          {/* Documento de identidad */}
          <div>
            <label className="block mb-2">Documento de Identidad (opcional)</label>
            <input
              {...register('documentoIdentidad')}
              className="w-full p-2 border rounded"
              placeholder="Número de documento"
            />
          </div>

          {/* Departamentos */}
          <div>
            <label className="block mb-2">Departamentos *</label>
            <div className="grid grid-cols-3 gap-2">
              {DEPARTAMENTOS.map(depto => (
                <label key={depto} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDepartamentos.includes(depto)}
                    onChange={() => {
                      handleDepartamentoChange(depto);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{depto}</span>
                </label>
              ))}
            </div>
            {errors.departamentos && (
              <span className="text-red-500 text-sm">{typeof errors.departamentos.message === 'string' ? errors.departamentos.message : ''}</span>
            )}
          </div>

          {/* Motivo */}
          <div>
            <label className="block mb-2">Motivo de la Alerta *</label>
            <select
              {...register('motivo')}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione</option>
              {MOTIVOS_ALERTA.map(motivo => (
                <option key={motivo} value={motivo}>{motivo}</option>
              ))}
            </select>
            {errors.motivo && (
              <span className="text-red-500 text-sm">{typeof errors.motivo.message === 'string' ? errors.motivo.message : ''}</span>
            )}
          </div>

          {/* Motivo de Orden de Captura */}
          {showMotivoOrdenCaptura && (
            <div>
              <label className="block mb-2">Motivo de la Orden de Captura *</label>
              <select
                {...register('motivoOrdenCaptura')}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione</option>
                {MOTIVOS_ORDEN_CAPTURA.map(motivo => (
                  <option key={motivo} value={motivo}>{motivo}</option>
                ))}
              </select>
              {errors.motivoOrdenCaptura && (
                <span className="text-red-500 text-sm">{typeof errors.motivoOrdenCaptura.message === 'string' ? errors.motivoOrdenCaptura.message : ''}</span>
              )}
            </div>
          )}

          {/* Nivel de Peligrosidad */}
          <div>
            <label className="block mb-2">Nivel de Peligrosidad *</label>
            <select
              {...register('nivelPeligrosidad')}
              className="w-full p-2 border rounded"
            >
              <option value="BAJO">Bajo</option>
              <option value="MEDIO">Medio</option>
              <option value="ALTO">Alto</option>
              <option value="EXTREMO">Extremo</option>
            </select>
            {errors.nivelPeligrosidad && (
              <span className="text-red-500 text-sm">{typeof errors.nivelPeligrosidad.message === 'string' ? errors.nivelPeligrosidad.message : ''}</span>
            )}
          </div>

          {/* Relato */}
          <div>
            <label className="block mb-2">Relato *</label>
            <textarea
              {...register('relato')}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Describa los detalles relevantes..."
            />
            {errors.relato && (
              <span className="text-red-500 text-sm">{typeof errors.relato.message === 'string' ? errors.relato.message : ''}</span>
            )}
          </div>

          {/* Características físicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Estatura (cm)</label>
              <input {...register('altura')} className="w-full p-2 border rounded" placeholder="Ej: 170" type="number" min="0" />
            </div>
            <div>
              <label className="block mb-2">Peso (kg)</label>
              <input {...register('peso')} className="w-full p-2 border rounded" placeholder="Ej: 70" type="number" min="0" />
            </div>
            <div>
              <label className="block mb-2">Color de ojos</label>
              <select {...register('colorOjos')} className="w-full p-2 border rounded">
                <option value="">Seleccione</option>
                <option value="marrón">Marrón</option>
                <option value="ámbar">Ámbar</option>
                <option value="verde">Verde</option>
                <option value="avellana">Avellana</option>
                <option value="azul">Azul</option>
                <option value="gris">Gris</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Color de cabello</label>
              <select {...register('colorCabello')} className="w-full p-2 border rounded">
                <option value="">Seleccione</option>
                <option value="negro">Negro</option>
                <option value="castaño">Castaño</option>
                <option value="rubio">Rubio</option>
                <option value="pelirrojo">Pelirrojo</option>
                <option value="teñido">Teñido</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Tipo de cabello</label>
              <select {...register('tipoCabello')} className="w-full p-2 border rounded">
                <option value="">Seleccione</option>
                <option value="liso">Liso</option>
                <option value="ondulado">Ondulado</option>
                <option value="rizado">Rizado</option>
                <option value="afro">Afro</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Señas particulares</label>
              <textarea {...register('seniasParticulares')} className="w-full p-2 border rounded" placeholder="Describa señas particulares..." rows={2} />
            </div>
          </div>

          {/* Fotos con previsualización y selección de principal */}
          <div>
            <label className="block mb-2">Fotos *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('fotos')}
              className="w-full p-2 border rounded"
            />
            {previewFotos.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Nuevas fotos seleccionadas:</div>
                <div className="flex gap-2 flex-wrap">
                  {previewFotos.map((url, idx) => (
                    <div key={url} className="relative group">
                      <img 
                        src={url} 
                        alt="Foto nueva" 
                        className={`h-24 w-20 object-cover rounded border-2 ${fotoPrincipal === url ? 'border-blue-600' : 'border-gray-300'} cursor-pointer`}
                        onClick={() => setFotoPrincipal(url)}
                      />
                      {fotoPrincipal === url && (
                        <span className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">Principal</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.fotos && (
              <span className="text-red-500 text-sm">{typeof errors.fotos.message === 'string' ? errors.fotos.message : ''}</span>
            )}
          </div>

          {/* Fotos existentes (solo en edición) */}
          {fotosExistentes.length > 0 && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Fotos actuales:</div>
              <div className="flex gap-2 flex-wrap">
                {fotosExistentes.map((foto, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={getImageUrl(foto.url)}
                      alt={`Foto ${idx + 1}`}
                      className={`h-24 w-24 object-cover rounded cursor-pointer ${fotoPrincipal === foto.url ? 'ring-4 ring-indigo-500' : ''}`}
                      onClick={() => setFotoPrincipal(foto.url)}
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => {
                        setFotosExistentes(fotosExistentes.filter(f => f.id !== foto.id));
                        if (fotoPrincipal === foto.url) {
                          setFotoPrincipal(null);
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => handlePreview(watch())}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Previsualizar
            </button>
            <button
              type="button"
              onClick={() => { setNacionalidadSearch(''); onClose(); }}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
            >
              {initialData ? 'Guardar cambios' : 'Crear alerta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 