import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const formData = await req.formData();
    const files = formData.getAll('photos') as File[];
    const createdPhotos = [];
    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `photo_${Date.now()}_${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        await writeFile(filePath, buffer);
        const url = `/uploads/${fileName}`;
        const photo = await prisma.photo.create({
          data: { url, reportId: id, publica: false },
        });
        createdPhotos.push(photo);
      }
    }
    return NextResponse.json({ ok: true, photos: createdPhotos });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error al subir fotos' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    // body: [{ id: string, publica: boolean }]
    if (!Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: 'Formato inválido' }, { status: 400 });
    }
    const updates = await Promise.all(body.map(async (item) => {
      return prisma.photo.update({
        where: { id: item.id, reportId: id },
        data: { publica: !!item.publica },
      });
    }));
    return NextResponse.json({ ok: true, photos: updates });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error al actualizar fotos' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const photos = await prisma.photo.findMany({
      where: { reportId: id },
      select: { id: true, url: true, publica: true }
    });
    return NextResponse.json({ ok: true, photos });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error al obtener fotos' }, { status: 500 });
  }
} 