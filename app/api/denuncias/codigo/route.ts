import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get('codigo');
  
  console.log('🔍 Endpoint alternativo de código llamado con:', codigo);
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
  
  if (!codigo) {
    return NextResponse.json({ ok: false, error: 'Código no proporcionado' }, { status: 400 });
  }
  
  try {
    console.log('🔎 Buscando denuncia con código:', codigo);

    const report = await prisma.report.findFirst({
      where: {
        code: codigo
      },
      select: {
        id: true,
        code: true,
        status: true,
        reporterName: true,
        reporterLastName: true,
        reporterPhone: true,
        reporterAddress: true,
        reporterNationality: true,
        reporterIdFront: true,
        reporterIdBack: true,
        reporterIdNumber: true,
        missingName: true,
        missingLastName: true,
        missingBirthDate: true,
        missingGender: true,
        missingNationality: true,
        missingIdNumber: true,
        missingWeight: true,
        missingHeight: true,
        missingLastSeen: true,
        missingDescription: true,
        eyeColor: true,
        hairType: true,
        hairLength: true,
        hairColor: true,
        skinColor: true,
        otherFeatures: true,
        relationship: true,
        createdAt: true,
        photos: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        comments: {
          where: {
            status: 'APROBADO'
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    console.log('📊 Resultado de búsqueda:', report ? 'Encontrado' : 'No encontrado');
    if (report) {
      console.log('📸 Fotos encontradas:', report.photos?.length || 0);
      console.log('💬 Comentarios encontrados:', report.comments?.length || 0);
      console.log('📋 Estado de la denuncia:', report.status);
    }

    if (!report) {
      console.log('❌ Denuncia no encontrada');
      return NextResponse.json({ ok: false, error: 'Denuncia no encontrada' }, { status: 404 });
    }

    console.log('✅ Denuncia encontrada, enviando respuesta');
    
    // Crear respuesta con headers de cache control para desarrollo
    const response = NextResponse.json({ ok: true, report });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('💥 Error en endpoint alternativo de código:', error);
    return NextResponse.json({ ok: false, error: 'Error interno del servidor' }, { status: 500 });
  }
} 