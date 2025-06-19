import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const motivo = searchParams.get('motivo') || undefined;
    const departamento = searchParams.get('departamento') || undefined;
    const search = searchParams.get('search') || undefined;
    const PAGE_SIZE = 6;
    const where: any = { estado: 'ACTIVA' };
    if (motivo) where.motivo = motivo;
    if (departamento) where.departamentos = { has: departamento };
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } }
      ];
    }
    const total = await prisma.alert.count({ where });
    const alertas = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { fotos: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    return NextResponse.json({ ok: true, alertas, total, page, pageSize: PAGE_SIZE });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'No se pudieron obtener las alertas' }, { status: 500 });
  }
} 