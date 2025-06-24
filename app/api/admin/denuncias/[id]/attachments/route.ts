import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/[...nextauth]/authOptions';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const attachmentsDir = path.join(process.cwd(), 'private', 'attachments');

// GET: Obtener todos los adjuntos de una denuncia
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const attachments = await prisma.attachment.findMany({
      where: { reportId: params.id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ ok: true, attachments });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ ok: false, error: 'Error al obtener los adjuntos' }, { status: 500 });
  }
}

// POST: Subir un nuevo adjunto
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'Archivo no proporcionado' }, { status: 400 });
    }

    // Asegurarse de que el directorio de adjuntos exista
    await mkdir(attachmentsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\\s/g, '_')}`;
    const filePath = path.join(attachmentsDir, fileName);

    await writeFile(filePath, buffer);

    const newAttachment = await prisma.attachment.create({
      data: {
        fileName: file.name,
        fileUrl: `/api/admin/denuncias/attachments/${fileName}`, // URL de descarga
        fileType: file.type,
        fileSize: file.size,
        reportId: params.id,
        userId: session.user.id
      },
       include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ ok: true, attachment: newAttachment }, { status: 201 });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return NextResponse.json({ ok: false, error: 'Error al subir el archivo' }, { status: 500 });
  }
} 