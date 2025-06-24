import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { detectDeviceInfo } from 'lib/device-utils';
import { checkProxyOrVPN } from 'lib/proxy-vpn-check';

function generarCodigoDenuncia() {
  const fecha = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DEN-${fecha}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userAgent = req.headers.get('user-agent');
    const { deviceType, isProxy: isProxyLocal } = detectDeviceInfo(userAgent);
    const reporterIp = req.headers.get('x-forwarded-for') || req.ip || '';
    let reporterIsProxy = isProxyLocal;
    let reporterVpnProvider = undefined;
    if (reporterIp) {
      const checked = await checkProxyOrVPN(Array.isArray(reporterIp) ? reporterIp[0] : reporterIp);
      reporterIsProxy = checked.isProxy;
      reporterVpnProvider = checked.vpnProvider;
    }

    // Datos del denunciante
    const reporterName = formData.get('name') as string;
    const reporterLastName = formData.get('lastName') as string;
    const documentType = formData.get('documentType') as string;
    const reporterBirthDate = formData.get('birthDate') as string;
    const reporterMaritalStatus = formData.get('maritalStatus') as string;
    const reporterGender = formData.get('gender') as string;
    const reporterPhone = formData.get('phone') as string;
    const reporterAddress = formData.get('address') as string;
    const reporterLat = formData.get('lat') as string | null;
    const reporterLng = formData.get('lng') as string | null;
    const reporterUserAgent = userAgent || undefined;
    const reporterDeviceType = deviceType;
    const reporterDepartment = formData.get('department') as string | null;
    const reporterNationality = formData.get('nationality') as string;

    // Guardar imágenes de cédula
    const idFrontFile = formData.get('idFront') as File | null;
    const idBackFile = formData.get('idBack') as File | null;
    let idFrontUrl = '';
    let idBackUrl = '';
    if (idFrontFile && idFrontFile.size > 0) {
      const buffer = Buffer.from(await idFrontFile.arrayBuffer());
      const fileName = `idFront_${Date.now()}_${idFrontFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, buffer);
      idFrontUrl = `/uploads/${fileName}`;
    }
    if (idBackFile && idBackFile.size > 0) {
      const buffer = Buffer.from(await idBackFile.arrayBuffer());
      const fileName = `idBack_${Date.now()}_${idBackFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, buffer);
      idBackUrl = `/uploads/${fileName}`;
    }

    // Datos del menor
    const missingName = formData.get('missingName') as string;
    const missingLastName = formData.get('missingLastName') as string;
    const missingDocumentType = formData.get('missingDocumentType') as string | null;
    const missingId = formData.get('missingId') as string | null;
    const missingBirthDate = formData.get('missingBirthDate') as string;
    const missingGender = formData.get('missingGender') as string;
    const missingPhone = formData.get('missingPhone') as string | null;
    const relationship = formData.get('relationship') as string;
    const story = formData.get('story') as string;
    const missingNationality = formData.get('missingNationality') as string;
    // Nuevos campos de características físicas
    const eyeColor = formData.get('eyeColor') as string;
    const hairType = formData.get('hairType') as string;
    const hairLength = formData.get('hairLength') as string;
    const hairColor = formData.get('hairColor') as string;
    const skinColor = formData.get('skinColor') as string;
    const otherFeatures = formData.get('otherFeatures') as string | null;
    const missingWeight = formData.get('missingWeight') as string | null;
    const missingHeight = formData.get('missingHeight') as string | null;

    // Guardar fotos del menor
    const missingPhotosFiles = formData.getAll('missingPhotos') as File[];
    const missingPhotosUrls: string[] = [];
    for (const file of missingPhotosFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `missing_${Date.now()}_${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        await writeFile(filePath, buffer);
        missingPhotosUrls.push(`/uploads/${fileName}`);
      }
    }

    // Generar código único
    const code = generarCodigoDenuncia();

    // Guardar en la base de datos
    const report = await prisma.report.create({
      data: {
        code,
        status: 'PENDING',
        reporterName,
        reporterLastName,
        reporterPhone,
        reporterAddress: formData.get('address') as string || undefined,
        reporterCity: formData.get('city') as string || undefined,
        reporterState: formData.get('state') as string || undefined,
        reporterZipCode: formData.get('zipCode') as string || undefined,
        reporterIdFront: idFrontUrl || undefined,
        reporterIdBack: idBackUrl || undefined,
        reporterIdNumber: formData.get('id') as string,
        reporterIp,
        reporterUserAgent,
        reporterDeviceType,
        reporterIsProxy,
        reporterVpnProvider,
        reporterLatitude: reporterLat ? parseFloat(reporterLat) : undefined,
        reporterLongitude: reporterLng ? parseFloat(reporterLng) : undefined,
        department: reporterDepartment || undefined,
        reporterNationality,
        missingName,
        missingLastName,
        missingBirthDate: new Date(missingBirthDate),
        missingGender,
        missingHeight: missingHeight ? parseFloat(missingHeight) : undefined,
        missingWeight: missingWeight ? parseFloat(missingWeight) : undefined,
        missingClothing: formData.get('missingClothing') as string || undefined,
        missingLastSeen: formData.get('lastSeenDate') ? new Date(formData.get('lastSeenDate') as string) : undefined,
        missingLastLocation: formData.get('missingLastLocation') as string || undefined,
        missingDescription: story,
        missingNationality,
        missingIdNumber: missingId,
        eyeColor,
        hairType,
        hairLength,
        hairColor,
        skinColor,
        otherFeatures,
        relationship,
        userId: 'cmbtjo3bn000030ln4ampbhdo',
      },
    });

    // Guardar las fotos en la tabla Photo como públicas
    if (missingPhotosUrls.length > 0) {
      await prisma.photo.createMany({
        data: missingPhotosUrls.map(url => ({
          url,
          reportId: report.id,
          publica: true,
        })),
      });
    }

    return NextResponse.json({ ok: true, code });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error al guardar la denuncia' }, { status: 500 });
  }
} 