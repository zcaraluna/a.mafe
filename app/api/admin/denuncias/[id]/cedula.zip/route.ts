import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';
import path from 'path';
import { readFile } from 'fs/promises';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

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
        reporterIdFront: true,
        reporterIdBack: true,
      },
    });
    if (!report || (!report.reporterIdFront && !report.reporterIdBack)) {
      return new Response('No hay fotos de cédula para esta denuncia', { status: 404 });
    }
    const zip = new JSZip();
    if (report.reporterIdFront) {
      const filePath = path.join(process.cwd(), 'public', report.reporterIdFront);
      const fileData = await readFile(filePath);
      zip.file('cedula_frente' + path.extname(report.reporterIdFront), fileData);
    }
    if (report.reporterIdBack) {
      const filePath = path.join(process.cwd(), 'public', report.reporterIdBack);
      const fileData = await readFile(filePath);
      zip.file('cedula_dorso' + path.extname(report.reporterIdBack), fileData);
    }
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    return new Response(zipContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="cedula-${report.code || 'cedula'}.zip"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error al generar el zip', { status: 500 });
  }
} 