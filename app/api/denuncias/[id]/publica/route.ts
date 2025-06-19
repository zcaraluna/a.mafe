import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const report = await prisma.report.findFirst({
      where: { id, publicado: true },
      include: {
        photos: true,
        comments: {
          where: { status: 'APROBADO' },
          orderBy: { createdAt: 'desc' },
          include: { moderatedBy: true },
        },
      },
    });
    if (!report) {
      return NextResponse.json({ ok: false, error: 'No encontrado o no publicado' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error interno' }, { status: 500 });
  }
} 