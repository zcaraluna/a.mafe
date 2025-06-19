import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';
import path from 'path';
import { readFile } from 'fs/promises';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../api/auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new Response("No autorizado", { status: 401 });
  }
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: {
        code: true,
        photos: { select: { url: true } },
      },
    });
    const photoUrls = report?.photos?.map(p => p.url) || [];
    if (!report || photoUrls.length === 0) {
      return new Response('No hay fotos para esta denuncia', { status: 404 });
    }
    const zip = new JSZip();
    for (const url of photoUrls) {
      const filePath = path.join(process.cwd(), 'public', url);
      console.log('Intentando leer archivo de foto:', filePath);
      try {
        const fileData = await readFile(filePath);
        const fileName = path.basename(url);
        zip.file(fileName, fileData);
      } catch (err) {
        console.error('No se pudo leer el archivo:', filePath, err);
      }
    }
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    return new Response(zipContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${report.code || 'fotos'}.zip"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error al generar el zip', { status: 500 });
  }
} 