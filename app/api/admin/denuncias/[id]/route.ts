import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    console.log('PATCH body recibido:', body);
    // Solo permitir actualizar campos específicos
    const allowedFields = [
      'missingLastSeen',
      'otherFeatures',
      'missingClothing',
      'eyeColor',
      'hairType',
      'hairLength',
      'hairColor',
      'skinColor',
      'missingWeight',
      'missingHeight',
    ];
    const data: any = {};
    for (const key of allowedFields) {
      if (key in body) data[key] = body[key];
    }
    console.log('PATCH data a actualizar:', data);
    // Permitir actualizar fechas correctamente
    if (data.missingLastSeen && typeof data.missingLastSeen === 'string') {
      data.missingLastSeen = new Date(data.missingLastSeen);
    }
    const report = await prisma.report.update({
      where: { id },
      data,
    });
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudo actualizar la denuncia' }, { status: 500 });
  }
} 