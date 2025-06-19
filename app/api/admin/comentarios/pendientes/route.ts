import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }
  const comentarios = await prisma.comment.findMany({
    where: { status: 'PENDIENTE' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reportId: true,
      createdAt: true,
      report: {
        select: {
          missingName: true,
          missingLastName: true,
        }
      }
    }
  });
  return NextResponse.json({ ok: true, count: comentarios.length, comentarios });
} 