import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/[...nextauth]/authOptions';

// GET: Obtener todas las notas internas de una denuncia
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const notes = await prisma.internalNote.findMany({
      where: { reportId: params.id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ ok: true, notes });
  } catch (error) {
    console.error('Error fetching internal notes:', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener las notas' }, { status: 500 });
  }
}

// POST: Crear una nueva nota interna
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ ok: false, error: 'El contenido de la nota es requerido' }, { status: 400 });
    }

    const newNote = await prisma.internalNote.create({
      data: {
        content,
        reportId: params.id,
        userId: session.user.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ ok: true, note: newNote }, { status: 201 });
  } catch (error) {
    console.error('Error creating internal note:', error);
    return NextResponse.json({ ok: false, error: 'Error al crear la nota' }, { status: 500 });
  }
} 