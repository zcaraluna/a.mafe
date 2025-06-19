import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const { id } = params;
    // Eliminar fotos asociadas
    await prisma.alertPhoto.deleteMany({ where: { alertId: id } });
    // Eliminar la alerta
    await prisma.alert.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar la alerta' }, { status: 500 });
  }
} 