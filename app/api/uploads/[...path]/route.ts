import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Unir la ruta recibida para obtener el nombre del archivo
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...params.path);
    
    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Archivo no encontrado:', filePath);
      return new NextResponse(null, { status: 404 });
    }

    // Leer el archivo
    const file = await fs.readFile(filePath);
    
    // Detectar el tipo de archivo
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    // Crear la respuesta con los headers adecuados
    const response = new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    return response;
  } catch (error) {
    console.error('Error al servir archivo:', error);
    return new NextResponse(null, { status: 500 });
  }
} 