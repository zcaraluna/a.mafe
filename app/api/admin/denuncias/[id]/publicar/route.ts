import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    console.log('DEBUG DATABASE_URL (publicar):', process.env.DATABASE_URL);
    const report = await prisma.report.update({
      where: { id },
      data: { publicado: true },
    });
    console.log('DEBUG resultado update publicar:', report);
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudo publicar el caso' }, { status: 500 });
  }
} 