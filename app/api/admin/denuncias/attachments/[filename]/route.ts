import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/[...nextauth]/authOptions';
import path from 'path';
import { promises as fs } from 'fs';
import { lookup } from 'mime-types';

const attachmentsDir = path.join(process.cwd(), 'private', 'attachments');

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse(null, { status: 401, statusText: 'No autorizado' });
  }

  try {
    const { filename } = params;
    const filePath = path.join(attachmentsDir, filename);

    // Validar que el path no intente salirse del directorio de adjuntos
    if (path.dirname(filePath) !== attachmentsDir) {
        return new NextResponse(null, { status: 403, statusText: 'Acceso prohibido' });
    }

    const stat = await fs.stat(filePath);
    const file = await fs.readFile(filePath);

    const contentType = lookup(filePath) || 'application/octet-stream';

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Content-Disposition': `attachment; filename="${filename}"`
      },
    });

  } catch (error: any) {
    if (error.code === 'ENOENT') {
        console.error('Archivo no encontrado:', params.filename);
        return new NextResponse(null, { status: 404, statusText: 'Archivo no encontrado' });
    }
    console.error('Error al servir archivo adjunto:', error);
    return new NextResponse(null, { status: 500, statusText: 'Error interno del servidor' });
  }
} 