import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    console.log('DEBUG DATABASE_URL (despublicar):', process.env.DATABASE_URL);
    const report = await prisma.report.update({
      where: { id },
      data: { publicado: false },
    });
    console.log('DEBUG resultado update despublicar:', report);
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudo retirar la publicación del caso' }, { status: 500 });
  }
} 