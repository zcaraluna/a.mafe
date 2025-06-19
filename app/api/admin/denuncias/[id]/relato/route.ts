import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { relatoPublico } = await req.json();
    if (!relatoPublico || typeof relatoPublico !== 'string' || relatoPublico.length < 10) {
      return NextResponse.json({ ok: false, error: 'El relato público es demasiado corto.' }, { status: 400 });
    }
    const report = await prisma.report.update({
      where: { id },
      data: { relatoPublico },
    });
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudo actualizar el relato público' }, { status: 500 });
  }
} 