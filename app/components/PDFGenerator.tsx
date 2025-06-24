"use client";
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatDateTime, formatDate } from '../../lib/date-utils';
import QRCode from 'qrcode';

interface PDFGeneratorProps {
  report: any;
  language: string;
}

const textos = {
  es: {
    titulo: "CONSTANCIA DE DENUNCIA",
    subtitulo: "SISTEMA DE BÚSQUEDA DE PERSONAS DESAPARECIDAS",
    codigo: "Código de seguimiento:",
    estado: "Estado de la denuncia:",
    estadoPendiente: "PENDIENTE",
    estadoAprobada: "APROBADA",
    estadoRechazada: "RECHAZADA",
    estadoCerradaViva: "CERRADA - PERSONA ENCONTRADA VIVA",
    estadoCerradaFallecida: "CERRADA - PERSONA HALLADA SIN VIDA",
    datosDenunciante: "1. DATOS DEL DENUNCIANTE",
    datosDesaparecido: "2. DATOS DE LA PERSONA DESAPARECIDA",
    caracteristicas: "3. CARACTERÍSTICAS FÍSICAS",
    relato: "4. RELATO DE LOS HECHOS",
    fotos: "5. FOTOGRAFÍAS ANEXADAS",
    fecha: "Fecha y hora de denuncia:",
    nombres: "Nombres:",
    apellidos: "Apellidos:",
    telefono: "Teléfono:",
    direccion: "Dirección:",
    nacionalidad: "Nacionalidad:",
    fechaNacimiento: "Fecha de nacimiento:",
    genero: "Género:",
    peso: "Peso (aprox.):",
    estatura: "Estatura (aprox.):",
    ultimaVez: "Fecha y hora de última vez visto:",
    colorOjos: "Color de ojos:",
    tipoCabello: "Tipo de cabello:",
    largoCabello: "Largo del cabello:",
    colorCabello: "Color de cabello:",
    colorPiel: "Color de piel:",
    otrosRasgos: "Señas particulares:",
    relacion: "Vínculo con la persona desaparecida:",
    kg: "kg",
    cm: "cm",
    noEspecificado: "No especificado",
    fotosDisponibles: "Fotografías adjuntas en el sistema.",
    verificar: "Verificar autenticidad"
  },
  en: {
    titulo: "PROOF OF REPORT",
    subtitulo: "MISSING PERSONS SEARCH SYSTEM",
    codigo: "Tracking Code:",
    estado: "Report Status:",
    estadoPendiente: "PENDING",
    estadoAprobada: "APPROVED",
    estadoRechazada: "REJECTED",
    estadoCerradaViva: "CLOSED - PERSON FOUND ALIVE",
    estadoCerradaFallecida: "CLOSED - PERSON FOUND DECEASED",
    datosDenunciante: "1. REPORTER'S INFORMATION",
    datosDesaparecido: "2. MISSING PERSON'S INFORMATION",
    caracteristicas: "3. PHYSICAL CHARACTERISTICS",
    relato: "4. STATEMENT OF FACTS",
    fotos: "5. ATTACHED PHOTOGRAPHS",
    fecha: "Date and time of report:",
    nombres: "First Name(s):",
    apellidos: "Last Name(s):",
    telefono: "Phone:",
    direccion: "Address:",
    nacionalidad: "Nationality:",
    fechaNacimiento: "Date of Birth:",
    genero: "Gender:",
    peso: "Weight (approx.):",
    estatura: "Height (approx.):",
    ultimaVez: "Date and time last seen:",
    colorOjos: "Eye Color:",
    tipoCabello: "Hair Type:",
    largoCabello: "Hair Length:",
    colorCabello: "Hair Color:",
    colorPiel: "Skin Color:",
    otrosRasgos: "Distinguishing Marks:",
    relacion: "Relationship to Missing Person:",
    kg: "kg",
    cm: "cm",
    noEspecificado: "Not specified",
    fotosDisponibles: "Photographs attached in the system.",
    verificar: "Verify Authenticity"
  },
  gn: {
    titulo: "KUATIA ÑEMOMBE'U",
    subtitulo: "SISTEMA OHEKÁVA OJEJAVÝVAPE",
    codigo: "Código de seguimiento:",
    estado: "Ñemombe'u reko:",
    estadoPendiente: "OÑEÑEMOÑE'Ĩ",
    estadoAprobada: "OÑEMOÑE'Ĩ",
    estadoRechazada: "OÑEMBOYKE",
    estadoCerradaViva: "OÑEMBOYKE - OJEJUHU OIKÓVA",
    estadoCerradaFallecida: "OÑEMBOYKE - OJEJUHU OMANÓVA",
    datosDenunciante: "1. OJAPÓVA MOMBE'U DATOS",
    datosDesaparecido: "2. OJEJAVÝVA DATOS",
    caracteristicas: "3. RETE REHEGUA",
    relato: "4. OJEHÚVA MOMBE'U",
    fotos: "5. TA'ANGA OÑEMOĨVA",
    fecha: "Ára ha hora oñemombe'u hague:",
    nombres: "Téra:",
    apellidos: "Terajoapy:",
    telefono: "Pumbyry:",
    direccion: "Tenda:",
    nacionalidad: "Tetã:",
    fechaNacimiento: "Arateĩ:",
    genero: "Mba'épa:",
    peso: "Pohyikue (circ.):",
    estatura: "Yvatekue (circ.):",
    ultimaVez: "Ára ha hora ojehecha pahague:",
    colorOjos: "Tesa sa'y:",
    tipoCabello: "Áva rague:",
    largoCabello: "Áva puku:",
    colorCabello: "Áva sa'y:",
    colorPiel: "Pire sa'y:",
    otrosRasgos: "Mba'e ojehechakuaáva:",
    relacion: "Mba'épa ndehegui pe ojejavýva:",
    kg: "kg",
    cm: "cm",
    noEspecificado: "Ndoje'éiri",
    fotosDisponibles: "Ta'anga oñemoĩva sistema-pe.",
    verificar: "Hechakuaa añeteguápa"
  },
  pt: {
    titulo: "COMPROVANTE DE DENÚNCIA",
    subtitulo: "SISTEMA DE BUSCA DE PESSOAS DESAPARECIDAS",
    codigo: "Código de Rastreamento:",
    estado: "Status da Denúncia:",
    estadoPendiente: "PENDENTE",
    estadoAprobada: "APROVADA",
    estadoRechazada: "REJEITADA",
    estadoCerradaViva: "FECHADA - PESSOA ENCONTRADA VIVA",
    estadoCerradaFallecida: "FECHADA - PESSOA ENCONTRADA FALECIDA",
    datosDenunciante: "1. DADOS DO DENUNCIANTE",
    datosDesaparecido: "2. DADOS DA PESSOA DESAPARECIDA",
    caracteristicas: "3. CARACTERÍSTICAS FÍSICAS",
    relato: "4. RELATO DOS FATOS",
    fotos: "5. FOTOGRAFIAS ANEXADAS",
    fecha: "Data e hora da denúncia:",
    nombres: "Nomes:",
    apellidos: "Sobrenomes:",
    telefono: "Telefone:",
    direccion: "Endereço:",
    nacionalidad: "Nacionalidade:",
    fechaNacimiento: "Data de Nascimento:",
    genero: "Gênero:",
    peso: "Peso (aprox.):",
    estatura: "Altura (aprox.):",
    ultimaVez: "Data e hora da última vez visto:",
    colorOjos: "Cor dos Olhos:",
    tipoCabello: "Tipo de Cabelo:",
    largoCabello: "Comprimento do Cabelo:",
    colorCabello: "Cor do Cabelo:",
    colorPiel: "Cor da Pele:",
    otrosRasgos: "Sinais Particulares:",
    relacion: "Relação com a pessoa desaparecida:",
    kg: "kg",
    cm: "cm",
    noEspecificado: "Não especificado",
    fotosDisponibles: "Fotografias anexadas no sistema.",
    verificar: "Verificar Autenticidade"
  }
};

const PDFField = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <div style={{ marginBottom: '8px' }}>
    <p style={{ margin: 0, fontSize: '10px', color: '#555', fontWeight: 'bold' }}>{label}</p>
    <p style={{ margin: 0, fontSize: '12px', color: '#000' }}>{value || textos.es.noEspecificado}</p>
  </div>
);

export default function PDFGenerator({ report, language }: PDFGeneratorProps) {
  const pdfPage1Ref = useRef<HTMLDivElement>(null);
  const pdfPage2Ref = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const t = textos[language as keyof typeof textos] || textos.es;

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t.estadoPendiente;
      case 'APPROVED':
        return t.estadoAprobada;
      case 'REJECTED':
        return t.estadoRechazada;
      case 'CERRADO_VIVA':
        return t.estadoCerradaViva;
      case 'CERRADO_FALLECIDA':
        return t.estadoCerradaFallecida;
      default:
        return status;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#fbbf24'; // yellow-400
      case 'APPROVED':
        return '#10b981'; // green-500
      case 'REJECTED':
        return '#ef4444'; // red-500
      case 'CERRADO_VIVA':
        return '#065f46'; // green-800
      case 'CERRADO_FALLECIDA':
        return '#6b7280'; // gray-500
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    if (report?.code) {
      const url = `${window.location.origin}/denuncias/codigo?codigo=${report.code}`;
      QRCode.toDataURL(url, { errorCorrectionLevel: 'H', width: 200 }, (err, url) => {
        if (err) return;
        setQrCodeUrl(url);
      });
    }
  }, [report?.code]);

  const generatePDF = async () => {
    if (!pdfPage1Ref.current) return;
    setIsGenerating(true);

    try {
      // Esperar a que las imágenes en ambos contenedores se carguen
      const images1 = pdfPage1Ref.current?.querySelectorAll('img') || [];
      const images2 = pdfPage2Ref.current?.querySelectorAll('img') || [];
      const allImages = [...Array.from(images1), ...Array.from(images2)];
      await Promise.all(
        allImages.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; 
          });
        })
      );
      await new Promise(r => setTimeout(r, 100));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const footerHeight = 40;
      
      // --- Parte 1: Generar primera página ---
      const canvas1 = await html2canvas(pdfPage1Ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData1 = canvas1.toDataURL('image/png');
      const imgHeight1 = (canvas1.height * pdfWidth) / canvas1.width;
      pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, imgHeight1);
      let pageNum = 1;

      // --- Parte 2: Generar páginas subsecuentes (Relato + Fotos) ---
      if (report.missingDescription && pdfPage2Ref.current) {
        const canvas2 = await html2canvas(pdfPage2Ref.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
        const imgData2 = canvas2.toDataURL('image/png');
        const imgHeight2 = (canvas2.height * pdfWidth) / canvas2.width;
        
        const topMargin = 15; // Margen superior para páginas 2 en adelante
        const subsequentPageContentHeight = pdfHeight - footerHeight - topMargin;
        
        let yCanvas = 0;
        while (yCanvas < imgHeight2) {
          pdf.addPage();
          pageNum++;
          pdf.addImage(imgData2, 'PNG', 0, topMargin - yCanvas, pdfWidth, imgHeight2);
          yCanvas += subsequentPageContentHeight;
        }
      }
      
      // --- Pie de página para todas las páginas ---
      for (let i = 1; i <= pageNum; i++) {
        pdf.setPage(i);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pdfHeight - footerHeight, pdfWidth, footerHeight, 'F');
        pdf.setDrawColor(0);
        pdf.line(15, pdfHeight - footerHeight, pdfWidth - 15, pdfHeight - footerHeight);
        if (qrCodeUrl) {
          pdf.addImage(qrCodeUrl, 'PNG', 15, pdfHeight - 37, 30, 30);
          pdf.setFontSize(9);
          pdf.text(t.verificar, 15 + 15, pdfHeight - 5, { align: 'center' });
        }
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        const footerTextX = pdfWidth - 15;
        const footerTextY = pdfHeight - 10;
        pdf.text(`Documento generado el ${formatDateTime(new Date())}`, footerTextX, footerTextY, { align: 'right' });
        pdf.text('Sistema de Búsqueda de Personas Desaparecidas - República del Paraguay', footerTextX, footerTextY - 5, { align: 'right' });
      }
      
      pdf.save(`constancia_${report.code}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para obtener la URL correcta de la imagen
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // Asegurarse de que la URL apunte al endpoint de la API
    return url.startsWith('/') ? `/api${url}` : url;
  };

  const pdfStyles: React.CSSProperties = {
    width: '210mm',
    padding: '15mm',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    color: 'black',
    boxSizing: 'border-box'
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? '🔄 Generando PDF...' : '📄 Descargar Constancia en PDF'}
      </button>

      {/* Contenedor del PDF: movido fuera de la pantalla para permitir la carga de imágenes */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {/* Contenido de la Página 1 */}
        <div ref={pdfPage1Ref} style={pdfStyles}>
          {/* Encabezado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
            <img src="/src/pn.png" alt="Policía Nacional" style={{ height: '70px' }} />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{t.titulo}</h1>
              <p style={{ margin: 0, fontSize: '12px' }}>{t.subtitulo}</p>
            </div>
            <img src="/src/logo_gobierno-1.png" alt="Gobierno del Paraguay" style={{ height: '45px' }} />
          </div>
           {/* Código y fecha */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
            <p><strong>{t.codigo}</strong> {report.code}</p>
            <p><strong>{t.fecha}</strong> {formatDateTime(report.createdAt)}</p>
          </div>
          
          {/* Estado de la denuncia */}
          {report.status && (
            <div style={{ 
              marginTop: '15px', 
              padding: '8px 12px', 
              backgroundColor: getStatusColor(report.status), 
              color: 'white', 
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              <strong>{t.estado}</strong> {getStatusText(report.status)}
            </div>
          )}
           {/* Secciones de datos P1 */}
          <div style={{ marginTop: '20px' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{t.datosDenunciante}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <PDFField label={t.nombres} value={report.reporterName} />
                <PDFField label={t.apellidos} value={report.reporterLastName} />
                <PDFField label={t.telefono} value={report.reporterPhone} />
                <PDFField label={t.direccion} value={report.reporterAddress} />
                <PDFField label={t.nacionalidad} value={report.reporterNationality} />
              </div>
            </div>
            <div style={{ marginTop: '20px'  }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{t.datosDesaparecido}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <PDFField label={t.nombres} value={report.missingName} />
                <PDFField label={t.apellidos} value={report.missingLastName} />
                <PDFField label={t.fechaNacimiento} value={formatDate(report.missingBirthDate)} />
                <PDFField label={t.genero} value={report.missingGender} />
                <PDFField label={t.nacionalidad} value={report.missingNationality} />
                <PDFField label={t.relacion} value={report.relationship} />
                <PDFField label={t.ultimaVez} value={formatDate(report.missingLastSeen)} />
              </div>
            </div>
            <div style={{ marginTop: '20px'  }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{t.caracteristicas}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                <PDFField label={t.estatura} value={report.missingHeight ? `${report.missingHeight} ${t.cm}` : undefined} />
                <PDFField label={t.peso} value={report.missingWeight ? `${report.missingWeight} ${t.kg}` : undefined} />
                <PDFField label={t.colorPiel} value={report.skinColor} />
                <PDFField label={t.colorOjos} value={report.eyeColor} />
                <PDFField label={t.colorCabello} value={report.hairColor} />
                <PDFField label={t.largoCabello} value={report.hairLength} />
                <PDFField label={t.tipoCabello} value={report.hairType} />
                <PDFField label={t.otrosRasgos} value={report.otherFeatures} />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la Página 2 en adelante */}
        {report.missingDescription && (
          <div ref={pdfPage2Ref} style={pdfStyles}>
            <div style={{ marginTop: '0' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{t.relato}</h2>
              <div 
                style={{ fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: report.missingDescription }}
              />
            </div>
            {report.photos && report.photos.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>{t.fotos}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
                  {report.photos.map((photo: any, index: number) => (
                    <div key={photo.id || index} style={{ textAlign: 'center' }}>
                      <img 
                        src={getImageUrl(photo.url)}
                        alt={`Foto ${index + 1}`}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid #eee', borderRadius: '4px' }}
                        crossOrigin="anonymous"
                      />
                      <p style={{fontSize: '10px', color: '#555', marginTop: '5px'}}>Foto {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Previsualización visible en la página */}
      <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
          {/* Encabezado */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.titulo}</h1>
            <p className="text-lg text-gray-600">
              {t.codigo} <span className="font-mono font-bold text-blue-700">{report.code}</span>
            </p>
            <p className="text-sm text-gray-500">
              {t.fecha} {formatDateTime(report.createdAt)}
            </p>
            {/* Estado de la denuncia en la previsualización */}
            {report.status && (
              <div className="mt-4 inline-block px-4 py-2 rounded-lg text-white font-semibold" 
                   style={{ backgroundColor: getStatusColor(report.status) }}>
                {t.estado} {getStatusText(report.status)}
              </div>
            )}
          </div>
          {/* Secciones de datos (simplificado para la previsualización) */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.datosDenunciante}</h2>
            <p>{report.reporterName} {report.reporterLastName}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.datosDesaparecido}</h2>
            <p>{report.missingName} {report.missingLastName}</p>
          </div>
           {report.photos && report.photos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.fotos}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {report.photos.slice(0, 4).map((photo: any, index: number) => (
                  <div key={photo.id} className="text-center">
                    <img src={getImageUrl(photo.url)} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded border" />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
} 