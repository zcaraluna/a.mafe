import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;
  const status = searchParams.get('status');
  const department = searchParams.get('department');

  // Construir filtro dinámico
  const where: any = {};
  if (
    status &&
    ['PENDING', 'APPROVED', 'REJECTED', 'CERRADO_VIVA', 'CERRADO_FALLECIDA'].includes(status)
  ) {
    where.status = status;
  }
  if (department) {
    where.department = department;
  }

  try {
    const [total, denuncias] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          code: true,
          status: true,
          createdAt: true,
          reporterName: true,
          reporterLastName: true,
          reporterPhone: true,
          reporterIdFront: true,
          reporterIdBack: true,
          missingName: true,
          missingLastName: true,
          missingBirthDate: true,
          missingGender: true,
          eyeColor: true,
          hairType: true,
          hairLength: true,
          hairColor: true,
          skinColor: true,
          otherFeatures: true,
          missingDescription: true,
          missingLastSeen: true,
          missingWeight: true,
          missingHeight: true,
          publicado: true,
          photos: { select: { url: true } },
          statusChangedAt: true,
          statusChangedByUser: { select: { name: true } },
          caseActions: {
            orderBy: { createdAt: 'asc' },
            select: {
              id: true,
              action: true,
              note: true,
              createdAt: true,
              user: { select: { name: true } }
            }
          },
          reporterAddress: true,
          reporterLatitude: true,
          reporterLongitude: true,
          reporterIdNumber: true,
          department: true,
          reporterIp: true,
          reporterUserAgent: true,
          reporterDeviceType: true,
          reporterIsProxy: true,
          reporterVpnProvider: true,
        },
      })
    ]);
    // Mapear las fotos del desaparecido a missingPhotos (array de strings) y el nombre del usuario admin
    const mapped = denuncias.map(d => ({
      ...d,
      missingPhotos: Array.isArray(d.photos) ? d.photos.map((p) => p.url) : [],
      statusChangedByName: d.statusChangedByUser?.name || null,
      statusChangedAt: d.statusChangedAt || null,
      caseActions: d.caseActions || [],
    }));
    return NextResponse.json({ total, denuncias: mapped });
  } catch (error) {
    console.error('ERROR GET /api/admin/denuncias:', error);
    return NextResponse.json({ total: 0, denuncias: [], error: 'Error interno del servidor' }, { status: 500 });
  }
} 