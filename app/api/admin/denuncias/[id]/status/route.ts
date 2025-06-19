import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/authOptions';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    console.log('SESSION:', JSON.stringify(session, null, 2));
    if (!session || !session.user || !session.user.id) {
      console.log('NO AUTH');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { status, note } = body;
    console.log('STATUS:', status);
    // Acciones válidas
    const validStatuses = ['APPROVED', 'REJECTED', 'CERRADO_VIVA', 'CERRADO_FALLECIDA'];
    if (!validStatuses.includes(status)) {
      console.log('ESTADO INVALIDO');
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }
    // Actualiza el estado del reporte
    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        status,
        statusChangedBy: session.user.id,
        statusChangedAt: new Date(),
      },
    });
    // Registra la acción en el historial
    await prisma.caseAction.create({
      data: {
        reportId: params.id,
        userId: session.user.id,
        action: status,
        note: note || null,
      },
    });
    console.log('UPDATED:', updated);
    return NextResponse.json({ ok: true, report: updated });
  } catch (error) {
    console.error('ERROR PATCH:', error);
    return NextResponse.json({ error: 'Error al actualizar el estado' }, { status: 500 });
  }
} 