'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import './globals.css'
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import { useLanguage } from '../components/LanguageSelector';
import LegalModal from './components/LegalModal';

const reporterSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  documentType: z.enum(['', 'CEDULA DE IDENTIDAD', 'PASAPORTE'], { required_error: 'Seleccione el tipo de documento' }),
  id: z.string().min(5, 'El número de documento debe tener entre 5 y 16 caracteres').max(16, 'El número de documento debe tener entre 5 y 16 caracteres'),
  birthDate: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, 'Debes ser mayor de 18 años'),
  maritalStatus: z.string(),
  gender: z.string(),
  phone: z.string().min(10, 'Número de teléfono inválido'),
  address: z.string().min(5, 'Dirección requerida'),
  idFront: z.any(),
  idBack: z.any(),
  department: z.string().min(1, 'Seleccione un departamento'),
  nationality: z.string().min(1, 'Seleccione una nacionalidad'),
});

const missingSchema = z.object({
  missingName: z.string().min(2, 'El nombre es requerido'),
  missingLastName: z.string().min(2, 'El apellido es requerido'),
  missingDocumentType: z.enum(['', 'CEDULA DE IDENTIDAD', 'PASAPORTE']).optional(),
  missingId: z.string().min(5, 'El número de documento debe tener entre 5 y 16 caracteres').max(16, 'El número de documento debe tener entre 5 y 16 caracteres').optional(),
  missingBirthDate: z.string(),
  missingGender: z.string(),
  missingPhone: z.string().optional(),
  eyeColor: z.string().min(1, 'Seleccione un color de ojos'),
  hairType: z.string().min(1, 'Seleccione un tipo de cabello'),
  hairLength: z.string().min(1, 'Seleccione el largo de cabello'),
  hairColor: z.string().min(1, 'Seleccione un color de cabello'),
  skinColor: z.string().min(1, 'Seleccione un color de piel'),
  otherFeatures: z.string().optional(),
  missingPhotos: z
    .any()
    .refine(
      (files) => files && files.length >= 4,
      'Se requieren al menos 4 fotos'
    ),
  relationship: z.string().min(2, 'Debe especificar el relacionamiento con el menor'),
  story: z.string().min(50, 'El relato debe tener al menos 50 caracteres'),
  lastSeenDate: z.string().min(1, 'La fecha es requerida'),
  acceptLegal: z.boolean().optional(),
  missingWeight: z.string().min(1, 'El peso es requerido'),
  missingHeight: z.string().min(1, 'La estatura es requerida'),
  missingNationality: z.string().min(1, 'Seleccione una nacionalidad'),
});

const MapaFormulario = dynamic(() => import('./components/MapaFormulario'), { ssr: false });

const DEPARTAMENTOS = [
  "Asunción",
  "Concepción",
  "San Pedro",
  "Cordillera",
  "Guairá",
  "Caaguazú",
  "Caazapá",
  "Itapúa",
  "Misiones",
  "Paraguarí",
  "Alto Paraná",
  "Central",
  "Ñeembucú",
  "Amambay",
  "Canindeyú",
  "Presidente Hayes",
  "Alto Paraguay",
  "Boquerón"
];

const NACIONALIDADES = [
  { es: "Paraguaya", en: "Paraguayan", gn: "Paraguayo", pt: "Paraguaia" },
  { es: "Argentina", en: "Argentinian", gn: "Argentina", pt: "Argentina" },
  { es: "Brasileña", en: "Brazilian", gn: "Brasilgua", pt: "Brasileira" },
  { es: "Boliviana", en: "Bolivian", gn: "Boliviagua", pt: "Boliviana" },
  { es: "Chilena", en: "Chilean", gn: "Chilena", pt: "Chilena" },
  { es: "Uruguaya", en: "Uruguayan", gn: "Uruguaygua", pt: "Uruguaia" },
  { es: "Peruana", en: "Peruvian", gn: "Perúgua", pt: "Peruana" },
  { es: "Colombiana", en: "Colombian", gn: "Colombiagua", pt: "Colombiana" },
  { es: "Venezolana", en: "Venezuelan", gn: "Venezuela", pt: "Venezuelana" },
  { es: "Ecuatoriana", en: "Ecuadorian", gn: "Ekuadorgua", pt: "Equatoriana" },
  { es: "Española", en: "Spanish", gn: "España", pt: "Espanhola" },
  { es: "Cubana", en: "Cuban", gn: "Kúbagua", pt: "Cubana" },
  { es: "Mexicana", en: "Mexican", gn: "Méxicogua", pt: "Mexicana" },
  { es: "Alemana", en: "German", gn: "Alemaniagua", pt: "Alemã" },
  { es: "Italiana", en: "Italian", gn: "Italiagua", pt: "Italiana" }
];

function generarCodigoDenuncia() {
  const fecha = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DEN-${fecha}-${random}`;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const router = useRouter();
  
  const reporterForm = useForm({
    resolver: zodResolver(reporterSchema),
    defaultValues: {
      name: '',
      lastName: '',
      documentType: '',
      id: '',
      birthDate: '',
      maritalStatus: '',
      gender: '',
      phone: '',
      address: '',
      department: '',
      nationality: ''
    }
  });
  
  const missingForm = useForm({
    resolver: zodResolver(missingSchema),
    defaultValues: {
      missingName: '',
      missingLastName: '',
      missingDocumentType: '',
      missingId: '',
      missingBirthDate: '',
      missingGender: '',
      missingPhone: '',
      eyeColor: '',
      hairType: '',
      hairLength: '',
      hairColor: '',
      skinColor: '',
      otherFeatures: '',
      relationship: '',
      story: '',
      lastSeenDate: '',
      acceptLegal: false,
      missingWeight: '',
      missingHeight: '',
      missingNationality: ''
    }
  });

  const { language } = useLanguage();

  // Resetear formularios al cargar la página
  useEffect(() => {
    reporterForm.reset();
    missingForm.reset();
    setStep(1);
    
    // Limpiar los inputs de tipo file
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: HTMLInputElement) => {
      input.value = '';
    });
  }, []);

  // Función para hacer scroll al inicio
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const textos = {
    es: {
      titulo: "Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos",
      subtitulo: "Alerta MAFE",
      datosDenunciante: "Datos del Denunciante",
      nombres: "Nombres",
      apellidos: "Apellidos",
      tipoDocumento: "Tipo de documento",
      seleccione: "Seleccione",
      cedula: "Cédula de Identidad",
      pasaporte: "Pasaporte",
      numeroDocumento: "Número de documento",
      fechaNacimiento: "Fecha de nacimiento",
      estadoCivil: "Estado civil",
      soltero: "Soltero/a",
      casado: "Casado/a",
      divorciado: "Divorciado/a",
      viudo: "Viudo/a",
      sexo: "Sexo",
      masculino: "Masculino",
      femenino: "Femenino",
      otro: "Otro",
      telefono: "Número de teléfono",
      domicilio: "Domicilio",
      direccion: "Dirección",
      departamento: "Departamento",
      usarUbicacion: "Usar mi ubicación actual",
      ubicacionNoSoportada: "La geolocalización no está soportada por este navegador.",
      ubicacionNoObtenida: "No se pudo obtener la ubicación: ",
      latitud: "Latitud",
      longitud: "Longitud",
      fotoCedulaFrente: "Foto de cédula (frente)",
      fotoCedulaDorso: "Foto de cédula (dorso)",
      continuar: "Continuar",
      datosDesaparecido: "Datos de la Persona Desaparecida",
      tipoDocumentoOpcional: "Tipo de documento (opcional)",
      numeroDocumentoOpcional: "Número de documento (opcional)",
      telefonoOpcional: "Número de teléfono (opcional)",
      relacion: "Relacionamiento con el menor",
      hijo: "Es mi hijo/a",
      hermano: "Es mi hermano/a",
      sobrino: "Es mi sobrino/a",
      primo: "Es mi primo/a",
      nieto: "Es mi nieto/a",
      otroRelacion: "Otro",
      vistoUltimaVez: "Visto por última vez (fecha)",
      peso: "Peso (kg):",
      estatura: "Estatura (cm):",
      colorOjos: "Color de ojos",
      marron: "Marrón",
      ambar: "Ámbar",
      verde: "Verde",
      avellana: "Avellana",
      azul: "Azul",
      gris: "Gris",
      otros: "Otros",
      tipoCabello: "Tipo de cabello",
      liso: "Liso",
      ondulado: "Ondulado",
      rizado: "Rizado",
      afro: "Afro",
      largoCabello: "Largo de cabello",
      largo: "Largo",
      mediano: "Mediano",
      corto: "Corto",
      colorCabello: "Color de cabello",
      negro: "Negro",
      castano: "Castaño",
      rubio: "Rubio",
      pelirrojo: "Pelirrojo",
      tenido: "Teñido",
      colorPiel: "Color de piel",
      clara: "Clara",
      media: "Media",
      morena: "Morena",
      oscura: "Oscura",
      otrasCaracteristicas: "Otras características relevantes",
      placeholderOtrasCaracteristicas: "Describa otras características físicas relevantes (tatuajes, cicatrices, etc.)",
      fotosMenor: "Fotografías del menor (mínimo 4)",
      relatoDesaparicion: "Relato de la desaparición",
      placeholderRelato: "Describa brevemente cómo ocurrió la desaparición",
      aceptarLegal: "Debes aceptar para continuar.",
      enviarDenuncia: "Enviar Denuncia",
      ingresar: "Ingresar (solo personal autorizado)",
      leyendaLegal: `Declaro haber leído y acepto que, según el <b>Código Penal Paraguayo (Ley 1160/97)</b>:<br />
        <i>
          Artículo 289.- Denuncia falsa<br />
          El que a sabiendas y con el fin de provocar o hacer continuar un procedimiento contra otro:<br />
          1. le atribuyera falsamente, ante autoridad o funcionario competente para recibir denuncias, haber realizado un hecho antijurídico o violado un deber proveniente de un cargo público;<br />
          2. le atribuyera públicamente una de las conductas señaladas en el numeral anterior; o<br />
          3. simulara pruebas contra él,<br />
          será castigado con pena privativa de libertad de hasta cinco años o con multa.
        </i>`,
      nacionalidad: "Nacionalidad",
      minimo4Fotos: "Debe subir al menos 4 fotografías del desaparecido",
    },
    en: {
      titulo: "System for Reporting Missing Children and Adolescents",
      subtitulo: "MAFE Alert",
      datosDenunciante: "Reporter Information",
      nombres: "First Name(s)",
      apellidos: "Last Name(s)",
      tipoDocumento: "Document Type",
      seleccione: "Select",
      cedula: "National ID",
      pasaporte: "Passport",
      numeroDocumento: "Document Number",
      fechaNacimiento: "Date of Birth",
      estadoCivil: "Marital Status",
      soltero: "Single",
      casado: "Married",
      divorciado: "Divorced",
      viudo: "Widowed",
      sexo: "Gender",
      masculino: "Male",
      femenino: "Female",
      otro: "Other",
      telefono: "Phone Number",
      domicilio: "Address",
      direccion: "Address",
      departamento: "Department",
      usarUbicacion: "Use my current location",
      ubicacionNoSoportada: "Geolocation is not supported by this browser.",
      ubicacionNoObtenida: "Could not get location: ",
      latitud: "Latitude",
      longitud: "Longitude",
      fotoCedulaFrente: "ID Photo (front)",
      fotoCedulaDorso: "ID Photo (back)",
      continuar: "Continue",
      datosDesaparecido: "Missing Person Information",
      tipoDocumentoOpcional: "Document Type (optional)",
      numeroDocumentoOpcional: "Document Number (optional)",
      telefonoOpcional: "Phone Number (optional)",
      relacion: "Relationship to the minor",
      hijo: "My son/daughter",
      hermano: "My brother/sister",
      sobrino: "My nephew/niece",
      primo: "My cousin",
      nieto: "My grandchild",
      otroRelacion: "Other",
      vistoUltimaVez: "Last seen (date)",
      peso: "Weight (kg):",
      estatura: "Height (cm):",
      colorOjos: "Eye Color",
      marron: "Brown",
      ambar: "Amber",
      verde: "Green",
      avellana: "Hazel",
      azul: "Blue",
      gris: "Gray",
      otros: "Other",
      tipoCabello: "Hair Type",
      liso: "Straight",
      ondulado: "Wavy",
      rizado: "Curly",
      afro: "Afro",
      largoCabello: "Hair Length",
      largo: "Long",
      mediano: "Medium",
      corto: "Short",
      colorCabello: "Hair Color",
      negro: "Black",
      castano: "Brown",
      rubio: "Blonde",
      pelirrojo: "Redhead",
      tenido: "Dyed",
      colorPiel: "Skin Color",
      clara: "Light",
      media: "Medium",
      morena: "Tan",
      oscura: "Dark",
      otrasCaracteristicas: "Other relevant features",
      placeholderOtrasCaracteristicas: "Describe other relevant physical features (tattoos, scars, etc.)",
      fotosMenor: "Photos of the minor (minimum 4)",
      relatoDesaparicion: "Disappearance Story",
      placeholderRelato: "Briefly describe how the disappearance happened",
      aceptarLegal: "You must accept to continue.",
      enviarDenuncia: "Submit Report",
      ingresar: "Login (authorized personnel only)",
      leyendaLegal: `I declare that I have read and accept that, according to the <b>Paraguayan Penal Code (Law 1160/97)</b>:<br />
        <i>
          Article 289.- False report<br />
          Whoever knowingly and with the intention of causing or continuing a procedure against another:<br />
          1. falsely attributes to him, before an authority or official competent to receive complaints, having committed an unlawful act or violated a duty arising from a public office;<br />
          2. publicly attributes to him one of the behaviors indicated in the previous numeral; or<br />
          3. simulates evidence against him,<br />
          shall be punished with imprisonment for up to five years or a fine.
        </i>`,
      nacionalidad: "Nationality",
      minimo4Fotos: "You must upload at least 4 photographs of the missing person",
    },
    gn: {
      titulo: "Mitã'i, mitãkuña ha mitãrusukuéra ndoguerekóiha rehegua momarandu",
      subtitulo: "MAFE Ñemomarandu",
      datosDenunciante: "Omoñe'ẽva rehegua marandu",
      nombres: "Téra",
      apellidos: "Héra",
      tipoDocumento: "Kuatiarogue Mba'e",
      seleccione: "Eiporavo",
      cedula: "Cédula Paraguaya",
      pasaporte: "Pasaporte",
      numeroDocumento: "Kuatiarogue número",
      fechaNacimiento: "Aramboty ára",
      estadoCivil: "Tekoporã",
      soltero: "Menda'ỹva",
      casado: "Oñemenda",
      divorciado: "Oñemenda ha ojeheja",
      viudo: "Iména/imenarõ omanóva",
      sexo: "Mba'ekuaa",
      masculino: "Kuimba'e",
      femenino: "Kuña",
      otro: "Ambue",
      telefono: "Pumbyry número",
      domicilio: "Óga renda",
      direccion: "Óga renda",
      departamento: "Departamento",
      usarUbicacion: "Eipuru che rendaguã",
      ubicacionNoSoportada: "Ko explorador ndoguerekói geolocalización rehegua.",
      ubicacionNoObtenida: "Ndaikatúi ojuhu rendaguã: ",
      latitud: "Latitúd",
      longitud: "Longitúd",
      fotoCedulaFrente: "Cédula ra'anga (tenonde)",
      fotoCedulaDorso: "Cédula ra'anga (tapykuépe)",
      continuar: "Ehepyme'ẽ",
      datosDesaparecido: "Ndoguerekóiha rehegua marandu",
      tipoDocumentoOpcional: "Kuatiarogue Mba'e (opcional)",
      numeroDocumentoOpcional: "Kuatiarogue número (opcional)",
      telefonoOpcional: "Pumbyry número (opcional)",
      relacion: "Mba'éichapa oñemomba'e mitã rehe",
      hijo: "Che ra'y/rajy",
      hermano: "Che ryke'y/che joyke'y",
      sobrino: "Che sobrino/a",
      primo: "Che primo/a",
      nieto: "Che nieto/a",
      otroRelacion: "Ambue",
      vistoUltimaVez: "Ojehecha pahague (ára)",
      peso: "Pohýi (kg):",
      estatura: "Yvate (cm):",
      colorOjos: "Tesa sa'y",
      marron: "Hovyũ",
      ambar: "Ambar",
      verde: "Hovy",
      avellana: "Avellana",
      azul: "Hovy",
      gris: "Hũsa'yju",
      otros: "Ambue",
      tipoCabello: "Akãra'anga",
      liso: "Karape",
      ondulado: "Ondulado",
      rizado: "Rizado",
      afro: "Afro",
      largoCabello: "Akãra'anga pukukue",
      largo: "Puku",
      mediano: "Mbyte",
      corto: "Mbyky",
      colorCabello: "Akãra'anga sa'y",
      negro: "Hũ",
      castano: "Kuarahy'ã",
      rubio: "Sa'yju",
      pelirrojo: "Pytã",
      tenido: "Teñido",
      colorPiel: "Pire sa'y",
      clara: "Sa'yju",
      media: "Mbyte",
      morena: "Morotĩ",
      oscura: "Hũ",
      otrasCaracteristicas: "Ambue mba'e ojehechaukáva",
      placeholderOtrasCaracteristicas: "Ehai ambue mba'e ojehechaukáva (tatua, jaryi, etc.)",
      fotosMenor: "Mitã ra'anga (mínimo 4)",
      relatoDesaparicion: "Ojehúva rehegua mombe'u",
      placeholderRelato: "Ehai mba'éichapa ojehu",
      aceptarLegal: "Tekotevẽ eñemoneĩ hag̃ua.",
      enviarDenuncia: "Emomarandu",
      ingresar: "Eike (tembiapo rehegua)",
      leyendaLegal: `Ahechauka aikuaaha ha aime añe'ẽme'ẽvo, Paraguái Léi 1160/97 he'iháicha:<br />
        <i>
          Artículo 289.- Ñemomarandu japu<br />
          Oimeraẽva oikuaáva ha oipota ojapo térã oheja ojejapo peteĩ mba'e rehe:<br />
          1. omombe'u japu peteĩ mba'e vai rehe, autoridad-pe térã funcionario-pe;
          2. omombe'u japu público-pe;
          3. ojapo japu mba'e rechaukaha,
          oñehepyme'ẽta 5 ary peve térã multa rehe.
        </i>`,
      nacionalidad: "Tetãgua",
      minimo4Fotos: "Tekotevẽ emoĩ 4 ta'anga ndoguerekóiva rehegua",
    },
    pt: {
      titulo: "Sistema de Denúncia de Crianças e Adolescentes Desaparecidos",
      subtitulo: "Alerta MAFE",
      datosDenunciante: "Dados do Denunciante",
      nombres: "Nome(s)",
      apellidos: "Sobrenome(s)",
      tipoDocumento: "Tipo de documento",
      seleccione: "Selecione",
      cedula: "Cédula de Identidade",
      pasaporte: "Passaporte",
      numeroDocumento: "Número do documento",
      fechaNacimiento: "Data de nascimento",
      estadoCivil: "Estado civil",
      soltero: "Solteiro(a)",
      casado: "Casado(a)",
      divorciado: "Divorciado(a)",
      viudo: "Viúvo(a)",
      sexo: "Sexo",
      masculino: "Masculino",
      femenino: "Feminino",
      otro: "Outro",
      telefono: "Número de telefone",
      domicilio: "Endereço",
      direccion: "Endereço",
      departamento: "Departamento",
      usarUbicacion: "Usar minha localização atual",
      ubicacionNoSoportada: "Este navegador não suporta geolocalização.",
      ubicacionNoObtenida: "Não foi possível obter a localização: ",
      latitud: "Latitude",
      longitud: "Longitude",
      fotoCedulaFrente: "Foto da cédula (frente)",
      fotoCedulaDorso: "Foto da cédula (verso)",
      continuar: "Continuar",
      datosDesaparecido: "Dados da Pessoa Desaparecida",
      tipoDocumentoOpcional: "Tipo de documento (opcional)",
      numeroDocumentoOpcional: "Número do documento (opcional)",
      telefonoOpcional: "Número de telefone (opcional)",
      relacion: "Relação com o menor",
      hijo: "Meu filho(a)",
      hermano: "Meu irmão(ã)",
      sobrino: "Meu sobrinho(a)",
      primo: "Meu primo(a)",
      nieto: "Meu neto(a)",
      otroRelacion: "Outro",
      vistoUltimaVez: "Visto pela última vez (data)",
      peso: "Peso (kg):",
      estatura: "Altura (cm):",
      colorOjos: "Cor dos olhos",
      marron: "Castanho",
      ambar: "Âmbar",
      verde: "Verde",
      avellana: "Avelã",
      azul: "Azul",
      gris: "Cinza",
      otros: "Outros",
      tipoCabello: "Tipo de cabelo",
      liso: "Liso",
      ondulado: "Ondulado",
      rizado: "Encaracolado",
      afro: "Afro",
      largoCabello: "Comprimento do cabelo",
      largo: "Longo",
      mediano: "Médio",
      corto: "Curto",
      colorCabello: "Cor do cabelo",
      negro: "Preto",
      castano: "Castanho",
      rubio: "Loiro",
      pelirrojo: "Ruivo",
      tenido: "Tingido",
      colorPiel: "Cor da pele",
      clara: "Clara",
      media: "Média",
      morena: "Morena",
      oscura: "Escura",
      otrasCaracteristicas: "Outras características relevantes",
      placeholderOtrasCaracteristicas: "Descreva outras características físicas relevantes (tatuagens, cicatrizes, etc.)",
      fotosMenor: "Fotos do menor (mínimo 4)",
      relatoDesaparicion: "Relato do desaparecimento",
      placeholderRelato: "Descreva brevemente como ocorreu o desaparecimento",
      aceptarLegal: "Você deve aceitar para continuar.",
      enviarDenuncia: "Enviar Denúncia",
      ingresar: "Entrar (apenas pessoal autorizado)",
      leyendaLegal: `Declaro que li e aceito que, de acordo com o <b>Código Penal Paraguaio (Lei 1160/97)</b>:<br />
        <i>
          Artigo 289.- Denúncia falsa<br />
          Quem, sabendo e com a intenção de provocar ou fazer continuar um procedimento contra outro:<br />
          1. atribuir falsamente, perante autoridade ou funcionário competente para receber denúncias, ter cometido um ato ilícito ou violado um dever decorrente de cargo público;<br />
          2. atribuir publicamente a ele uma das condutas indicadas no número anterior; ou<br />
          3. simular provas contra ele,<br />
          será punido com prisão de até cinco anos ou multa.
        </i>`,
      nacionalidad: "Nacionalidade",
      minimo4Fotos: "Você deve enviar pelo menos 4 fotografias da pessoa desaparecida",
    }
  };

  const onSubmitReporter = async (data: any) => {
    setStep(2);
    scrollToTop();
  };

  const onSubmitMissing = async (data: any) => {
    const isValid = await missingForm.trigger();
    if (!isValid) {
      return;
    }
    if (!data.missingPhotos || data.missingPhotos.length < 4) {
      alert(textos[language].minimo4Fotos);
      return;
    }
    setStep(3);
    scrollToTop();
  };

  const handleFinalSubmit = async () => {
    const isValid = await missingForm.trigger();
    if (!isValid) {
      return;
    }
    setShowLegalModal(true);
  };

  const handleGoBack = () => {
    const formData = missingForm.getValues();
    setStep(1);
    scrollToTop();
    // Preservar los valores del formulario
    setTimeout(() => {
      Object.entries(formData).forEach(([key, value]) => {
        missingForm.setValue(key as keyof typeof formData, value, { shouldValidate: false });
      });
    }, 0);
  };

  const handleLegalAccept = async () => {
    setShowLegalModal(false);
    try {
      const formData = new FormData();
      // Datos del denunciante
      Object.entries(reporterForm.getValues()).forEach(([key, value]) => {
        if (key === 'idFront' || key === 'idBack') {
          if (value && value[0]) formData.append(key, value[0]);
        } else {
          formData.append(key, value as string);
        }
      });
      if (location) {
        formData.append('lat', location[0].toString());
        formData.append('lng', location[1].toString());
      }
      // Datos del menor
      Object.entries(missingForm.getValues()).forEach(([key, value]) => {
        if (key === 'missingPhotos') {
          if (value && (value as FileList).length > 0) {
            Array.from(value as FileList).forEach((file: File) => formData.append('missingPhotos', file));
          }
        } else {
          formData.append(key, value as string);
        }
      });
      // Enviar a la API
      const res = await fetch('/api/denuncias', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.ok) {
        router.push(`/confirmacion?codigo=${result.code}`);
      } else {
        alert('Error al enviar la denuncia. Intente nuevamente.');
      }
    } catch (error) {
      alert('Error al enviar la denuncia. Intente nuevamente.');
    }
  };

  return (
    <>
      <NavBar />
      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-32 sm:h-48 mb-4 sm:mb-6">
        <img
          src="/src/Gobierno_del_Paraguay_Palacio.jpg"
          alt="Gobierno del Paraguay"
          className="w-full h-32 sm:h-48 object-cover"
        />
        <img
          src="/src/pn.png"
          alt="Policía Nacional"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-20 sm:h-28 w-auto"
          style={{ zIndex: 10 }}
        />
      </div>
      {/* CONTENIDO PRINCIPAL */}
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center px-2">
              {textos[language].titulo}
            </h1>
            <img src="/src/MAFE.png" alt="MAFE" className="h-16 sm:h-20 rounded-full mb-2 mt-2 shadow" />
            <h2 className="text-lg sm:text-xl font-bold text-center">
              {textos[language].subtitulo}
            </h2>
          </div>

          {step === 1 ? (
            <form onSubmit={reporterForm.handleSubmit(onSubmitReporter)} className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                {textos[language].datosDenunciante}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">{textos[language].nombres}</label>
                  <input
                    {...reporterForm.register('name')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].nombres}
                  />
                  {reporterForm.formState.errors.name && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.name.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].apellidos}</label>
                  <input
                    {...reporterForm.register('lastName')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].apellidos}
                  />
                  {reporterForm.formState.errors.lastName && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.lastName.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].tipoDocumento}</label>
                  <select {...reporterForm.register('documentType')} className="w-full p-2 border rounded" defaultValue="">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="CEDULA DE IDENTIDAD">{textos[language].cedula}</option>
                    <option value="PASAPORTE">{textos[language].pasaporte}</option>
                  </select>
                  {reporterForm.formState.errors.documentType && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.documentType.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].numeroDocumento}</label>
                  <input
                    {...reporterForm.register('id')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].numeroDocumento}
                  />
                  {reporterForm.formState.errors.id && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.id.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].fechaNacimiento}</label>
                  <input
                    type="date"
                    {...reporterForm.register('birthDate')}
                    className="w-full p-2 border rounded"
                  />
                  {reporterForm.formState.errors.birthDate && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.birthDate.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].estadoCivil}</label>
                  <select {...reporterForm.register('maritalStatus')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="soltero">{textos[language].soltero}</option>
                    <option value="casado">{textos[language].casado}</option>
                    <option value="divorciado">{textos[language].divorciado}</option>
                    <option value="viudo">{textos[language].viudo}</option>
                  </select>
                  {reporterForm.formState.errors.maritalStatus && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.maritalStatus.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].nacionalidad || "Nacionalidad"}</label>
                  <select
                    {...reporterForm.register('nationality', { required: true })}
                    className="w-full p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="">{textos[language].seleccione}</option>
                    {NACIONALIDADES.map(n => (
                      <option key={n.es} value={n.es}>{n[language]}</option>
                    ))}
                    <option value="otro">{textos[language].otro}</option>
                  </select>
                  {reporterForm.formState.errors.nationality && (
                    <span className="text-red-500 text-sm">{textos[language].seleccione} {textos[language].nacionalidad || "nacionalidad"}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].sexo}</label>
                  <select {...reporterForm.register('gender')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="masculino">{textos[language].masculino}</option>
                    <option value="femenino">{textos[language].femenino}</option>
                  </select>
                  {reporterForm.formState.errors.gender && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.gender.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].telefono}</label>
                  <input
                    {...reporterForm.register('phone')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].telefono}
                  />
                  {reporterForm.formState.errors.phone && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.phone.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].domicilio}</label>
                  <input
                    {...reporterForm.register('address')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].direccion}
                  />
                  {reporterForm.formState.errors.address && (
                    <span className="text-red-500 text-sm">{reporterForm.formState.errors.address.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].departamento}</label>
                  <select
                    {...reporterForm.register('department', { required: true })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">{textos[language].seleccione}</option>
                    {DEPARTAMENTOS.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                  {reporterForm.formState.errors.department && (
                    <span className="text-red-500 text-sm">{textos[language].seleccione} un departamento</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <MapaFormulario location={location} setLocation={setLocation} />
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setLocation([
                            position.coords.latitude,
                            position.coords.longitude
                          ]);
                        },
                        (error) => {
                          alert(textos[language].ubicacionNoObtenida + error.message);
                        }
                      );
                    } else {
                      alert(textos[language].ubicacionNoSoportada);
                    }
                  }}
                >
                  {textos[language].usarUbicacion}
                </button>
                {location && (
                  <div className="text-sm text-gray-600 mt-2">
                    {textos[language].latitud}: {location[0]}, {textos[language].longitud}: {location[1]}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">{textos[language].fotoCedulaFrente}</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...reporterForm.register('idFront')}
                    className="w-full"
                  />
                  {reporterForm.watch('idFront') && reporterForm.watch('idFront')[0] && (
                    <img
                      src={URL.createObjectURL(reporterForm.watch('idFront')[0])}
                      alt="Cédula frente"
                      className="mt-2 h-24 object-contain border rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].fotoCedulaDorso}</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...reporterForm.register('idBack')}
                    className="w-full"
                  />
                  {reporterForm.watch('idBack') && reporterForm.watch('idBack')[0] && (
                    <img
                      src={URL.createObjectURL(reporterForm.watch('idBack')[0])}
                      alt="Cédula dorso"
                      className="mt-2 h-24 object-contain border rounded"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                >
                  {textos[language].continuar}
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            <form onSubmit={missingForm.handleSubmit(onSubmitMissing)} className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                {textos[language].datosDesaparecido}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">{textos[language].nombres}</label>
                  <input
                    {...missingForm.register('missingName')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].nombres}
                  />
                  {missingForm.formState.errors.missingName && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.missingName.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].apellidos}</label>
                  <input
                    {...missingForm.register('missingLastName')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].apellidos}
                  />
                  {missingForm.formState.errors.missingLastName && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.missingLastName.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].tipoDocumentoOpcional}</label>
                  <select {...missingForm.register('missingDocumentType')} className="w-full p-2 border rounded" defaultValue="">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="CEDULA DE IDENTIDAD">{textos[language].cedula}</option>
                    <option value="PASAPORTE">{textos[language].pasaporte}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">{textos[language].numeroDocumentoOpcional || textos[language].numeroDocumento}</label>
                  <input {...missingForm.register('missingId')} className="w-full p-2 border rounded" placeholder={textos[language].numeroDocumento} />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">{textos[language].nacionalidad || "Nacionalidad"}</label>
                  <select
                    {...missingForm.register('missingNationality', { required: true })}
                    className="w-full p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="">{textos[language].seleccione}</option>
                    {NACIONALIDADES.map(n => (
                      <option key={n.es} value={n.es}>{n[language]}</option>
                    ))}
                    <option value="otro">{textos[language].otro}</option>
                  </select>
                  {missingForm.formState.errors.missingNationality && (
                    <span className="text-red-500 text-sm">{textos[language].seleccione} {textos[language].nacionalidad || "nacionalidad"}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].fechaNacimiento}</label>
                  <input
                    type="date"
                    {...missingForm.register('missingBirthDate')}
                    className="w-full p-2 border rounded"
                    onChange={e => {
                      missingForm.setValue('missingBirthDate', e.target.value);
                    }}
                  />
                  {missingForm.formState.errors.missingBirthDate && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.missingBirthDate.message as string}</span>
                  )}
                  {missingForm.watch('missingBirthDate') && (
                    <span className="text-gray-600 text-sm ml-2">Edad: {(() => {
                      const birth = new Date(missingForm.watch('missingBirthDate'));
                      const today = new Date();
                      let age = today.getFullYear() - birth.getFullYear();
                      const m = today.getMonth() - birth.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                      return age;
                    })()} años</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].sexo}</label>
                  <select {...missingForm.register('missingGender')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="masculino">{textos[language].masculino}</option>
                    <option value="femenino">{textos[language].femenino}</option>
                  </select>
                  {missingForm.formState.errors.missingGender && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.missingGender.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].telefonoOpcional}</label>
                  <input
                    {...missingForm.register('missingPhone')}
                    className="w-full p-2 border rounded"
                    placeholder={textos[language].telefono}
                  />
                </div>
                <div>
                  <label className="block mb-2">{textos[language].relacion}</label>
                  <select {...missingForm.register('relationship')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="hijo/a">{textos[language].hijo}</option>
                    <option value="hermano/a">{textos[language].hermano}</option>
                    <option value="sobrino/a">{textos[language].sobrino}</option>
                    <option value="primo/a">{textos[language].primo}</option>
                    <option value="nieto/a">{textos[language].nieto}</option>
                    <option value="otro">{textos[language].otroRelacion}</option>
                  </select>
                  {missingForm.formState.errors.relationship && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.relationship.message as string}</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">
                  <div>
                    <label className="block font-semibold mb-1">{textos[language].vistoUltimaVez}</label>
                    <input type="date" {...missingForm.register('lastSeenDate')} className="border rounded p-2 w-full" />
                    {missingForm.formState.errors.lastSeenDate && <span className="text-red-500 text-sm">{missingForm.formState.errors.lastSeenDate.message}</span>}
                  </div>
                  <div className="flex flex-col justify-end h-full">
                    <div className="flex flex-row gap-4 items-end">
                      <div>
                        <label className="block font-semibold mb-1">{textos[language].peso}</label>
                        <input type="number" step="0.1" {...missingForm.register('missingWeight')} className="border rounded p-2 w-40" />
                        {missingForm.formState.errors.missingWeight && <span className="text-red-500 text-sm">{missingForm.formState.errors.missingWeight.message}</span>}
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">{textos[language].estatura}</label>
                        <input type="number" step="1" {...missingForm.register('missingHeight')} className="border rounded p-2 w-40" />
                        {missingForm.formState.errors.missingHeight && <span className="text-red-500 text-sm">{missingForm.formState.errors.missingHeight.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">{textos[language].colorOjos}</label>
                  <select {...missingForm.register('eyeColor')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="marrón">{textos[language].marron}</option>
                    <option value="ámbar">{textos[language].ambar}</option>
                    <option value="verde">{textos[language].verde}</option>
                    <option value="avellana">{textos[language].avellana}</option>
                    <option value="azul">{textos[language].azul}</option>
                    <option value="gris">{textos[language].gris}</option>
                    <option value="otros">{textos[language].otros}</option>
                  </select>
                  {missingForm.formState.errors.eyeColor && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.eyeColor.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].tipoCabello}</label>
                  <select {...missingForm.register('hairType')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="liso">{textos[language].liso}</option>
                    <option value="ondulado">{textos[language].ondulado}</option>
                    <option value="rizado">{textos[language].rizado}</option>
                    <option value="afro">{textos[language].afro}</option>
                  </select>
                  {missingForm.formState.errors.hairType && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.hairType.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].largoCabello}</label>
                  <select {...missingForm.register('hairLength')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="largo">{textos[language].largo}</option>
                    <option value="mediano">{textos[language].mediano}</option>
                    <option value="corto">{textos[language].corto}</option>
                  </select>
                  {missingForm.formState.errors.hairLength && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.hairLength.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].colorCabello}</label>
                  <select {...missingForm.register('hairColor')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="negro">{textos[language].negro}</option>
                    <option value="castaño">{textos[language].castano}</option>
                    <option value="rubio">{textos[language].rubio}</option>
                    <option value="pelirrojo">{textos[language].pelirrojo}</option>
                    <option value="teñido">{textos[language].tenido}</option>
                    <option value="otros">{textos[language].otros}</option>
                  </select>
                  {missingForm.formState.errors.hairColor && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.hairColor.message as string}</span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">{textos[language].colorPiel}</label>
                  <select {...missingForm.register('skinColor')} className="w-full p-2 border rounded">
                    <option value="">{textos[language].seleccione}</option>
                    <option value="clara">{textos[language].clara}</option>
                    <option value="media">{textos[language].media}</option>
                    <option value="morena">{textos[language].morena}</option>
                    <option value="oscura">{textos[language].oscura}</option>
                    <option value="otros">{textos[language].otros}</option>
                  </select>
                  {missingForm.formState.errors.skinColor && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.skinColor.message as string}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">{textos[language].otrasCaracteristicas}</label>
                  <textarea
                    {...missingForm.register('otherFeatures')}
                    className="w-full p-2 border rounded"
                    rows={2}
                    placeholder={textos[language].placeholderOtrasCaracteristicas}
                  />
                  {missingForm.formState.errors.otherFeatures && (
                    <span className="text-red-500 text-sm">{missingForm.formState.errors.otherFeatures.message as string}</span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">{textos[language].fotosMenor}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  {...missingForm.register('missingPhotos')}
                  className="w-full"
                />
                {missingForm.formState.errors.missingPhotos && (
                  <span className="text-red-500 text-sm">{missingForm.formState.errors.missingPhotos.message as string}</span>
                )}
                {missingForm.watch('missingPhotos') && missingForm.watch('missingPhotos').length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">{textos[language].fotosMenor}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Array.from(missingForm.watch('missingPhotos')).map((file: File, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Foto ${index + 1}`}
                          className="h-24 object-contain border rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2">{textos[language].relatoDesaparicion}</label>
                <textarea
                  {...missingForm.register('story')}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder={textos[language].placeholderRelato}
                />
                {missingForm.formState.errors.story && (
                  <span className="text-red-500 text-sm">{missingForm.formState.errors.story.message as string}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                >
                  Previsualizar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                Previsualización de la Denuncia
              </h2>

              {/* Datos del denunciante */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">{textos[language].datosDenunciante}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].nombres}</p>
                    <p>{reporterForm.getValues().name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].apellidos}</p>
                    <p>{reporterForm.getValues().lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].tipoDocumento}</p>
                    <p>{reporterForm.getValues().documentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].numeroDocumento}</p>
                    <p>{reporterForm.getValues().id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].telefono}</p>
                    <p>{reporterForm.getValues().phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].direccion}</p>
                    <p>{reporterForm.getValues().address}</p>
                  </div>
                </div>
              </div>

              {/* Datos del desaparecido */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">{textos[language].datosDesaparecido}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].nombres}</p>
                    <p>{missingForm.getValues().missingName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].apellidos}</p>
                    <p>{missingForm.getValues().missingLastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].fechaNacimiento}</p>
                    <p>{missingForm.getValues().missingBirthDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].sexo}</p>
                    <p>{missingForm.getValues().missingGender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].peso}</p>
                    <p>{missingForm.getValues().missingWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].estatura}</p>
                    <p>{missingForm.getValues().missingHeight} cm</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{textos[language].relatoDesaparicion}</p>
                    <p className="whitespace-pre-wrap">{missingForm.getValues().story}</p>
                  </div>
                </div>
              </div>

              {/* Fotos */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Fotografías</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].fotoCedulaFrente}</p>
                    {reporterForm.watch('idFront') && reporterForm.watch('idFront')[0] && (
                      <img
                        src={URL.createObjectURL(reporterForm.watch('idFront')[0])}
                        alt="Cédula frente"
                        className="mt-2 h-24 object-contain border rounded"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{textos[language].fotoCedulaDorso}</p>
                    {reporterForm.watch('idBack') && reporterForm.watch('idBack')[0] && (
                      <img
                        src={URL.createObjectURL(reporterForm.watch('idBack')[0])}
                        alt="Cédula dorso"
                        className="mt-2 h-24 object-contain border rounded"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">{textos[language].fotosMenor}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {missingForm.watch('missingPhotos') && Array.from(missingForm.watch('missingPhotos')).map((file: File, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Foto ${index + 1}`}
                        className="h-24 object-contain border rounded"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                >
                  {textos[language].enviarDenuncia}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Legal */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        onAccept={handleLegalAccept}
      />
    </>
  );
} 