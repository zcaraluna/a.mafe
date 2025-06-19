import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { CommentStatus } from '@prisma/client';
import { detectDeviceInfo } from 'lib/device-utils';
import { checkProxyOrVPN } from 'lib/proxy-vpn-check';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.ip || '';
    const userAgent = req.headers.get('user-agent');
    const { deviceType, isProxy: isProxyLocal } = detectDeviceInfo(userAgent);
    let isProxy = isProxyLocal;
    let vpnProvider = undefined;
    if (ip) {
      const checked = await checkProxyOrVPN(Array.isArray(ip) ? ip[0] : ip);
      isProxy = checked.isProxy;
      vpnProvider = checked.vpnProvider;
    }
    const { nombre, apellido, cedula, telefono, anonimo, content } = body;
    if (!content || typeof content !== 'string' || content.length < 5) {
      return NextResponse.json({ ok: false, error: 'El comentario es demasiado corto.' }, { status: 400 });
    }
    const comment = await prisma.comment.create({
      data: {
        reportId: id,
        content,
        ip: Array.isArray(ip) ? ip[0] : ip,
        userAgent: userAgent || undefined,
        deviceType,
        isProxy,
        vpnProvider,
        nombre: nombre || null,
        apellido: apellido || null,
        cedula: cedula || null,
        telefono: telefono || null,
        anonimo: !!anonimo,
        status: CommentStatus.PENDIENTE,
      }
    });
    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Error al guardar el comentario' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as CommentStatus | null;
    let where: any = { reportId: id };
    if (status) {
      where.status = status;
    } else {
      where.status = CommentStatus.APROBADO;
    }
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { moderatedBy: true },
    });
    return NextResponse.json({ ok: true, comments });
  } catch (error) {
    return NextResponse.json({ ok: false, comments: [], error: 'Error al obtener comentarios' }, { status: 500 });
  }
} 