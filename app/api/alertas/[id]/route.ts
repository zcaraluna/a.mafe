import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    const alerta = await prisma.alert.findUnique({
      where: { id },
      include: {
        fotos: true,
        publicadaPor: isAdmin ? { select: { name: true, email: true } } : false,
      },
    });
    if (!alerta) {
      return NextResponse.json({ ok: false, error: 'No encontrada' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, alerta });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
}

// Función auxiliar para limpiar URLs
function cleanUrl(url: string): string {
  // Remover el prefijo /api si existe
  let cleaned = url.replace(/^\/api/, '');
  // Remover el timestamp si existe
  cleaned = cleaned.replace(/\?t=\d+$/, '');
  return cleaned;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const formData = await req.formData();
    console.log('FormData recibido:', Object.fromEntries(formData.entries()));
    
    // Extraer campos básicos
    const data: any = {};
    for (const key of [
      'nombre', 'apellido', 'alias', 'fechaNacimiento', 'genero', 'nacionalidad', 'documentoIdentidad',
      'motivo', 'motivoOrdenCaptura', 'nivelPeligrosidad', 'relato', 'altura', 'peso', 'colorOjos', 'colorCabello', 'tipoCabello', 'seniasParticulares',
    ]) {
      if (formData.has(key)) data[key] = formData.get(key);
    }
    if (formData.has('departamentos')) {
      const departamentosRaw = formData.get('departamentos');
      data.departamentos = typeof departamentosRaw === 'string' ? JSON.parse(departamentosRaw) : [];
    }
    
    // Convertir fechaNacimiento a ISO-8601 si existe
    if (data.fechaNacimiento) {
      data.fechaNacimiento = new Date(data.fechaNacimiento).toISOString();
    }
    
    // Convertir altura y peso a número si existen
    if (data.altura) data.altura = parseFloat(data.altura);
    if (data.peso) data.peso = parseFloat(data.peso);

    // Manejar fotos existentes
    let fotosExistentes: { url: string; id: string }[] = [];
    if (formData.has('fotosExistentes')) {
      const fotosExistentesRaw = formData.get('fotosExistentes');
      fotosExistentes = typeof fotosExistentesRaw === 'string' ? JSON.parse(fotosExistentesRaw) : [];
      // Limpiar las URLs de las fotos existentes
      fotosExistentes = fotosExistentes.map(foto => ({
        ...foto,
        url: cleanUrl(foto.url)
      }));
      console.log('Fotos existentes (URLs limpiadas):', fotosExistentes);
    }

    // Procesar nuevas fotos
    const files = formData.getAll('fotos');
    const nuevasFotosUrls: string[] = [];
    
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileName = `${uniqueSuffix}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'alertas', fileName);
        await writeFile(filePath, buffer);
        const fotoUrl = `/uploads/alertas/${fileName}`;
        nuevasFotosUrls.push(fotoUrl);
        
        // Crear la nueva foto en la base de datos
        await prisma.alertPhoto.create({
          data: {
            url: fotoUrl,
            alertId: id,
            publica: false
          }
        });
      }
    }

    // Determinar la foto principal
    let nuevaFotoPrincipalUrl = null;
    const fotoPrincipalUrl = formData.get('fotoPrincipalUrl');
    const fotoPrincipalIndex = formData.get('fotoPrincipalIndex');

    if (fotoPrincipalUrl) {
      nuevaFotoPrincipalUrl = cleanUrl(String(fotoPrincipalUrl));
    } else if (fotoPrincipalIndex !== null && fotoPrincipalIndex !== undefined && !isNaN(Number(fotoPrincipalIndex))) {
      nuevaFotoPrincipalUrl = nuevasFotosUrls[Number(fotoPrincipalIndex)] || null;
    }

    // Si no se especificó una nueva foto principal, mantener la actual
    if (!nuevaFotoPrincipalUrl) {
      const alertaActual = await prisma.alert.findUnique({ where: { id } });
      nuevaFotoPrincipalUrl = alertaActual?.fotoPrincipal || null;
    }

    // Actualizar la alerta con los datos básicos y la foto principal
    await prisma.alert.update({
      where: { id },
      data: {
        ...data,
        fotoPrincipal: nuevaFotoPrincipalUrl,
      },
    });

    // Obtener todas las fotos actuales en la BD
    const fotosEnBD = await prisma.alertPhoto.findMany({ where: { alertId: id } });
    console.log('Fotos en BD antes de procesar:', fotosEnBD);

    // Eliminar fotos que ya no están en fotosExistentes
    const urlsExistentes = fotosExistentes.map(f => f.url);
    for (const foto of fotosEnBD) {
      const fotoUrlLimpia = cleanUrl(foto.url);
      if (!urlsExistentes.includes(fotoUrlLimpia) && !nuevasFotosUrls.includes(foto.url)) {
        console.log('Eliminando foto:', foto.url);
        await prisma.alertPhoto.delete({ where: { id: foto.id } });
      }
    }

    // Actualizar el estado 'publica' de todas las fotos
    const todasLasFotos = await prisma.alertPhoto.findMany({ where: { alertId: id } });
    for (const foto of todasLasFotos) {
      const fotoUrlLimpia = cleanUrl(foto.url);
      const esPublica = fotoUrlLimpia === nuevaFotoPrincipalUrl;
      console.log(`Actualizando foto ${foto.url} - publica: ${esPublica}`);
      await prisma.alertPhoto.update({
        where: { id: foto.id },
        data: { publica: esPublica },
      });
    }

    // Obtener la alerta actualizada con todas sus fotos
    const alertaActualizada = await prisma.alert.findUnique({
      where: { id },
      include: { fotos: true },
    });

    return NextResponse.json({ ok: true, alerta: alertaActualizada });
  } catch (error: any) {
    console.error('Error PATCH alerta:', error);
    return NextResponse.json({ ok: false, error: error?.message || 'Error interno' }, { status: 500 });
  }
} 