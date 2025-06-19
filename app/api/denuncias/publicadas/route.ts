import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log('DEBUG DATABASE_URL:', process.env.DATABASE_URL);
    const denuncias = await prisma.report.findMany({
      where: { publicado: true },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
      },
    });
    console.log('DEBUG denuncias publicadas encontradas:', denuncias.length);
    return NextResponse.json({ ok: true, denuncias });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudieron obtener los casos publicados' }, { status: 500 });
  }
} 