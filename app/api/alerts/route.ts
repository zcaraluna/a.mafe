import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    const alerts = await prisma.alert.findMany({
      include: {
        fotos: true,
        publicadaPor: isAdmin ? true : false,
      },
    });

    // Si no es admin, eliminar los campos sensibles
    const sanitizedAlerts = alerts.map(alert => {
      if (!isAdmin) {
        const { publicadaPorId, publicadaPor, publicadaEn, ...sanitizedAlert } = alert;
        return sanitizedAlert;
      }
      return alert;
    });

    return NextResponse.json(sanitizedAlerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return NextResponse.json(
      { error: 'Error al obtener alertas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const alert = await prisma.alert.create({
      data: {
        ...data,
        publicadaPorId: session.user.id,
        publicadaEn: new Date(),
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error al crear alerta:', error);
    return NextResponse.json(
      { error: 'Error al crear alerta' },
      { status: 500 }
    );
  }
} 