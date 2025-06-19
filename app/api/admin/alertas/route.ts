import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { prisma } from '../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NivelPeligrosidad } from '@prisma/client';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const alertas = await prisma.alert.findMany({
      include: {
        fotos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ ok: true, alertas });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return NextResponse.json(
      { error: 'Error al obtener alertas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Iniciando creación de alerta');
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      console.log('Usuario no autorizado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    console.log('FormData recibido:', Object.fromEntries(formData.entries()));
    
    // Asegurar que el directorio de uploads existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'alertas');
    console.log('Directorio de uploads:', uploadDir);
    if (!existsSync(uploadDir)) {
      console.log('Creando directorio de uploads');
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Procesar fotos
    const fotos = formData.getAll('fotos') as File[];
    console.log('Número de fotos recibidas:', fotos.length);
    const fotoUrls: string[] = [];

    for (const foto of fotos) {
      console.log('Procesando foto:', foto.name);
      const bytes = await foto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Crear nombre único para el archivo
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${foto.name}`;
      const filepath = join(uploadDir, filename);
      
      try {
        console.log('Guardando archivo en:', filepath);
        await writeFile(filepath, buffer);
        const fotoUrl = `/uploads/alertas/${filename}`;
        console.log('URL de la foto:', fotoUrl);
        fotoUrls.push(fotoUrl);
      } catch (error) {
        console.error('Error al guardar archivo:', error);
        return NextResponse.json(
          { error: 'Error al guardar las fotos' },
          { status: 500 }
        );
      }
    }

    // Determinar la foto principal por índice
    let fotoPrincipalUrl = '';
    const fotoPrincipalIndex = formData.get('fotoPrincipalIndex');
    console.log('Índice de foto principal:', fotoPrincipalIndex);
    if (fotoPrincipalIndex !== null && fotoPrincipalIndex !== undefined && !isNaN(Number(fotoPrincipalIndex))) {
      fotoPrincipalUrl = fotoUrls[Number(fotoPrincipalIndex)] || '';
    } else if (fotoUrls.length > 0) {
      fotoPrincipalUrl = fotoUrls[0];
    }
    console.log('URL de foto principal:', fotoPrincipalUrl);

    // Crear alerta
    console.log('Creando alerta en la base de datos');
    const alerta = await prisma.alert.create({
      data: {
        nombre: formData.get('nombre') as string,
        apellido: formData.get('apellido') as string,
        alias: formData.get('alias') as string,
        fechaNacimiento: new Date(formData.get('fechaNacimiento') as string),
        genero: formData.get('genero') as string,
        nacionalidad: formData.get('nacionalidad') as string,
        documentoIdentidad: formData.get('documentoIdentidad') as string,
        nivelPeligrosidad: formData.get('nivelPeligrosidad') as any,
        departamentos: JSON.parse(formData.get('departamentos') as string),
        motivo: formData.get('motivo') as string,
        motivoOrdenCaptura: formData.get('motivoOrdenCaptura') as string,
        relato: formData.get('relato') as string,
        altura: formData.get('altura') ? parseFloat(formData.get('altura') as string) : null,
        peso: formData.get('peso') ? parseFloat(formData.get('peso') as string) : null,
        colorOjos: formData.get('colorOjos') as string,
        colorCabello: formData.get('colorCabello') as string,
        tipoCabello: formData.get('tipoCabello') as string,
        seniasParticulares: formData.get('seniasParticulares') as string,
        publicadaPorId: session.user.id,
        publicadaEn: new Date(),
        fotoPrincipal: fotoPrincipalUrl,
        fotos: {
          create: fotoUrls.map((url) => ({
            url,
            publica: url === fotoPrincipalUrl,
          }))
        }
      },
      include: {
        fotos: true
      }
    });
    console.log('Alerta creada exitosamente:', alerta.id);

    return NextResponse.json({ ok: true, alerta });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    return NextResponse.json(
      { error: 'Error al crear alerta' },
      { status: 500 }
    );
  }
} 