import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { CommentStatus } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../auth/[...nextauth]/authOptions';

export async function PATCH(req: NextRequest, { params }: { params: { id: string, commentId: string } }) {
  const { commentId } = params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
    }
    const { action } = await req.json();
    let status: CommentStatus;
    if (action === 'APROBAR_PUBLICO') status = CommentStatus.APROBADO;
    else if (action === 'APROBAR_INTERNO') status = CommentStatus.INTERNO;
    else if (action === 'RECHAZAR') status = CommentStatus.RECHAZADO;
    else return NextResponse.json({ ok: false, error: 'Acción inválida' }, { status: 400 });
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        status,
        moderatedById: session.user.id,
        moderatedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error al moderar el comentario' }, { status: 500 });
  }
} 