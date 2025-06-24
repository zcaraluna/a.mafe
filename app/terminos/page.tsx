"use client";
import NavBar from '../../components/NavBar';
import { useLanguage } from '../../components/LanguageSelector';

export default function Terminos() {
  const { language } = useLanguage();

  const translations = {
    es: {
      title: "Términos y Condiciones - Política de Privacidad",
      subtitle: "Sistema de Denuncias de Niños, Niñas y Adolescentes Desaparecidos - Alerta MAFE",
      lastUpdated: "Última actualización: junio 2025",
      
      termsTitle: "TÉRMINOS Y CONDICIONES",
      termsIntro: "Al utilizar este sistema, usted acepta los siguientes términos y condiciones:",
      
      terms2: "2. VERACIDAD DE LA INFORMACIÓN",
      terms2Content: "Usted se compromete a proporcionar información veraz y precisa. La información falsa o engañosa puede tener consecuencias legales en relación a los artículos 289 y 291 de la Ley 1160/97 'Código Penal'.",
      
      article289: "Artículo 289.- Denuncia falsa: El que a sabiendas y con el fin de provocar o hacer continuar un procedimiento contra otro, le atribuyera falsamente haber realizado un hecho antijurídico, será castigado con pena privativa de libertad de hasta cinco años o con multa.",
      article291: "Artículo 291.- Simulación de un hecho punible: El que a sabiendas proporcionara información falsa será castigado con pena privativa de libertad de hasta tres años o con multa.",
      
      privacyTitle: "POLÍTICA DE PRIVACIDAD",
      privacyIntro: "Su privacidad es importante para nosotros. Esta política describe cómo recopilamos, usamos y protegemos su información:",
      
      privacy2: "FINALIDAD EXCLUSIVAMENTE INVESTIGATIVA",
      privacy2Content: "IMPORTANTE: Todos los datos recopilados se utilizan ÚNICAMENTE con fines investigativos para la búsqueda de personas desaparecidas. Bajo ningún motivo se comparten con terceros con finalidad comercial.",
      
      privacy4Note: "NUNCA se comparte información con empresas privadas, organizaciones comerciales o terceros con fines lucrativos.",
      
      dataTitle: "DATOS ESPECÍFICOS RECOLECTADOS",
      dataIntro: "Para ser completamente transparentes, le informamos exactamente qué datos recopilamos:",
      
      finalTitle: "DECLARACIÓN FINAL",
      finalContent: "Este sistema opera bajo los más altos estándares de ética y legalidad. Su información está protegida y se utiliza únicamente para ayudar a encontrar personas desaparecidas. No hay fines comerciales, publicitarios o de lucro asociados con el uso de sus datos.",
      
      finalNote: "Si tiene alguna duda sobre el uso de sus datos, le recomendamos contactar directamente con las autoridades competentes antes de utilizar el sistema.",
      
      terms1: "1. USO DEL SISTEMA",
      terms1Content: "Este sistema está destinado exclusivamente para la denuncia de personas desaparecidas y la gestión de alertas relacionadas. El uso debe ser responsable y veraz.",
      terms3: "3. RESPONSABILIDAD",
      terms3Content: "El sistema es una herramienta de apoyo para las autoridades. La responsabilidad principal de la investigación recae en los organismos competentes.",
      terms4: "4. PROHIBICIONES",
      terms4Content: "Está prohibido el uso del sistema para fines comerciales, publicitarios o cualquier otro propósito no autorizado.",
      
      privacy1: "1. INFORMACIÓN QUE RECOPILAMOS",
      privacy1Content: "Recopilamos únicamente la información necesaria para los fines investigativos, incluyendo datos del denunciante, información de la persona desaparecida, y datos técnicos del dispositivo.",
      privacy3: "3. USO DE LA INFORMACIÓN",
      privacy3Title: "La información se utiliza para:",
      privacy3List: [
        "Procesar denuncias de personas desaparecidas",
        "Gestionar alertas de búsqueda",
        "Facilitar investigaciones policiales",
        "Mantener estadísticas oficiales",
        "Mejorar el funcionamiento del sistema"
      ],
      privacy4: "4. COMPARTIR INFORMACIÓN",
      privacy4Title: "La información solo se comparte con:",
      privacy4List: [
        "Autoridades policiales competentes",
        "Organismos gubernamentales autorizados",
        "Fuerzas de seguridad del Estado",
        "Otras entidades oficiales cuando sea legalmente requerido"
      ],
      privacy5: "5. ALMACENAMIENTO Y SEGURIDAD",
      privacy5Content: "Los datos se almacenan en servidores seguros con medidas de protección adecuadas. Se implementan protocolos de seguridad para proteger la información personal.",
      privacy6: "6. SUS DERECHOS",
      privacy6Title: "Usted tiene derecho a:",
      privacy6List: [
        "Acceder a la información que tenemos sobre usted",
        "Solicitar la corrección de datos inexactos",
        "Solicitar la eliminación de datos (cuando sea legalmente posible)",
        "Revocar el consentimiento en cualquier momento",
        "Presentar una queja ante las autoridades competentes"
      ],
      
      dataReporter: "Datos del Denunciante:",
      dataReporterList: [
        "Nombre y apellido completo",
        "Tipo y número de documento de identidad",
        "Fecha de nacimiento",
        "Estado civil",
        "Género",
        "Número de teléfono",
        "Dirección completa",
        "Departamento",
        "Nacionalidad",
        "Fotos de documentos de identidad (frente y dorso)"
      ],
      dataTechnical: "Datos Técnicos:",
      dataTechnicalList: [
        "Dirección IP del dispositivo",
        "Información del navegador web",
        "Tipo de dispositivo utilizado",
        "Ubicación geográfica (solo si usted lo autoriza)",
        "Detección de uso de VPN o proxy"
      ],
      dataMissing: "Datos de la Persona Desaparecida:",
      dataMissingList: [
        "Nombre y apellido completo",
        "Documento de identidad (opcional)",
        "Fecha de nacimiento",
        "Género",
        "Número de teléfono (opcional)",
        "Características físicas detalladas",
        "Fotos de la persona",
        "Relato de la desaparición",
        "Última ubicación conocida"
      ],
      
      finalNote2: "Este documento es legalmente vinculante y debe ser leído completamente antes de usar el sistema.",
      
      // Sección de Cookies
      cookiesTitle: "POLÍTICA DE COOKIES Y ALMACENAMIENTO LOCAL",
      cookiesIntro: "Esta política explica cómo utilizamos cookies y tecnologías de almacenamiento local en nuestro sitio web:",
      
      cookies1: "1. ¿QUÉ SON LAS COOKIES Y EL ALMACENAMIENTO LOCAL?",
      cookies1Content: "Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. El almacenamiento local incluye localStorage y sessionStorage, que son tecnologías del navegador para guardar información temporalmente.",
      
      cookies2: "2. TIPOS DE ALMACENAMIENTO QUE UTILIZAMOS",
      cookies2Title: "Utilizamos los siguientes tipos de almacenamiento:",
      cookies2List: [
        "Cookies de autenticación: Gestionadas automáticamente por NextAuth para mantener la sesión de administradores",
        "localStorage: Para recordar su idioma preferido y aceptación de términos",
        "sessionStorage: Para almacenar temporalmente datos de formularios y vistas previas",
        "Cookies de sesión: Para mantener su sesión activa durante el uso del sistema"
      ],
      
      cookies3: "3. ALMACENAMIENTO ESPECÍFICO DEL SISTEMA",
      cookies3Content: "Nuestro sistema utiliza almacenamiento específico para:",
      cookies3List: [
        "Autenticación de administradores (cookies JWT con duración de 5 minutos)",
        "Preferencia de idioma (localStorage: español, inglés, guaraní, portugués)",
        "Aceptación de términos y condiciones (localStorage con timestamp)",
        "Vista previa de alertas (sessionStorage temporal)",
        "Datos de formularios para evitar pérdida de información (sessionStorage)"
      ],
      
      cookies4: "4. COOKIES DE TERCEROS",
      cookies4Content: "IMPORTANTE: No utilizamos cookies de terceros con fines comerciales, publicitarios o de seguimiento. Todas las cookies son propias del sistema y se utilizan exclusivamente para fines investigativos y de funcionamiento.",
      
      cookies5: "5. CONTROL DEL ALMACENAMIENTO",
      cookies5Content: "Puede controlar el almacenamiento a través de la configuración de su navegador. Sin embargo, deshabilitar ciertas cookies puede afectar el funcionamiento del sistema. Las cookies esenciales para la seguridad y autenticación no pueden ser deshabilitadas.",
      
      cookies6: "6. DURACIÓN DEL ALMACENAMIENTO",
      cookies6Title: "Duración del almacenamiento:",
      cookies6List: [
        "Cookies de autenticación: 5 minutos (sesión de administrador)",
        "localStorage de idioma: Hasta 1 año o hasta eliminación manual",
        "localStorage de aceptación de términos: 2 horas (renovación automática)",
        "sessionStorage de vista previa: Hasta cerrar el navegador",
        "sessionStorage de formularios: Hasta cerrar la pestaña"
      ],
      
      cookies7: "7. FINALIDAD EXCLUSIVAMENTE INVESTIGATIVA",
      cookies7Content: "Todo el almacenamiento se utiliza ÚNICAMENTE para fines investigativos y de funcionamiento del sistema. No se recopilan datos para análisis comerciales, publicidad o seguimiento de usuarios.",
      
      cookies8: "8. INFORMACIÓN TÉCNICA ESPECÍFICA",
      cookies8Content: "Utilizamos NextAuth para la autenticación, que gestiona automáticamente las cookies JWT. El localStorage se usa para preferencias de usuario y el sessionStorage para datos temporales de sesión. No implementamos cookies de tracking ni análisis de comportamiento."
    },
    
    en: {
      title: "Terms and Conditions - Privacy Policy",
      subtitle: "Missing Children and Adolescents Reporting System - MAFE Alert",
      lastUpdated: "Last updated: June 2025",
      
      termsTitle: "TERMS AND CONDITIONS",
      termsIntro: "By using this system, you agree to the following terms and conditions:",
      
      terms2: "2. INFORMATION ACCURACY",
      terms2Content: "You commit to providing truthful and accurate information. False or misleading information may have legal consequences in relation to articles 289 and 291 of Law 1160/97 'Penal Code'.",
      
      article289: "Article 289.- False complaint: Whoever knowingly and with the purpose of provoking or continuing a procedure against another, falsely attributes to them having committed an illegal act, will be punished with imprisonment of up to five years or a fine.",
      article291: "Article 291.- Simulation of a punishable act: Whoever knowingly provides false information will be punished with imprisonment of up to three years or a fine.",
      
      privacyTitle: "PRIVACY POLICY",
      privacyIntro: "Your privacy is important to us. This policy describes how we collect, use, and protect your information:",
      
      privacy2: "EXCLUSIVELY INVESTIGATIVE PURPOSE",
      privacy2Content: "IMPORTANT: All collected data is used EXCLUSIVELY for investigative purposes in the search for missing persons. Under no circumstances is it shared with third parties for commercial purposes.",
      
      privacy4Note: "Information is NEVER shared with private companies, commercial organizations, or third parties for profit purposes.",
      
      dataTitle: "SPECIFIC DATA COLLECTED",
      dataIntro: "To be completely transparent, we inform you exactly what data we collect:",
      
      finalTitle: "FINAL DECLARATION",
      finalContent: "This system operates under the highest standards of ethics and legality. Your information is protected and used solely to help find missing persons. There are no commercial, advertising, or profit purposes associated with the use of your data.",
      
      finalNote: "If you have any doubts about the use of your data, we recommend contacting competent authorities directly before using the system.",
      
      terms1: "1. SYSTEM USE",
      terms1Content: "This system is intended exclusively for reporting missing persons and managing related alerts. Use must be responsible and truthful.",
      terms3: "3. RESPONSIBILITY",
      terms3Content: "The system is a support tool for authorities. The primary responsibility for investigation lies with competent agencies.",
      terms4: "4. PROHIBITIONS",
      terms4Content: "The use of the system for commercial, advertising, or any other unauthorized purpose is prohibited.",
      
      privacy1: "1. INFORMATION WE COLLECT",
      privacy1Content: "We collect only the information necessary for investigative purposes, including complainant data, missing person information, and device technical data.",
      privacy3: "3. USE OF INFORMATION",
      privacy3Title: "Information is used for:",
      privacy3List: [
        "Processing missing person reports",
        "Managing search alerts",
        "Facilitating police investigations",
        "Maintaining official statistics",
        "Improving system operation"
      ],
      privacy4: "4. SHARING INFORMATION",
      privacy4Title: "Information is only shared with:",
      privacy4List: [
        "Competent police authorities",
        "Authorized government agencies",
        "State security forces",
        "Other official entities when legally required"
      ],
      privacy5: "5. STORAGE AND SEGURANÇA",
      privacy5Content: "Data is stored on secure servers with adequate protection measures. Security protocols are implemented to protect personal information.",
      privacy6: "6. YOUR RIGHTS",
      privacy6Title: "You have the right to:",
      privacy6List: [
        "Access information we have about you",
        "Request correction of inaccurate data",
        "Request data deletion (when legally possible)",
        "Revoke consent at any time",
        "File a complaint with competent authorities"
      ],
      
      dataReporter: "Reporter Data:",
      dataReporterList: [
        "Full name and surname",
        "Identity document type and number",
        "Date of birth",
        "Marital status",
        "Gender",
        "Phone number",
        "Complete address",
        "Department",
        "Nationality",
        "Identity document photos (front and back)"
      ],
      dataTechnical: "Technical Data:",
      dataTechnicalList: [
        "Device IP address",
        "Web browser information",
        "Type of device used",
        "Geographic location (only if you authorize it)",
        "VPN or proxy usage detection"
      ],
      dataMissing: "Missing Person Data:",
      dataMissingList: [
        "Full name and surname",
        "Identity document (optional)",
        "Date of birth",
        "Gender",
        "Phone number (optional)",
        "Detailed physical characteristics",
        "Person photos",
        "Disappearance account",
        "Last known location"
      ],
      
      finalNote2: "This document is legally binding and must be read completely before using the system.",
      
      // Sección de Cookies
      cookiesTitle: "COOKIE AND LOCAL STORAGE POLICY",
      cookiesIntro: "This policy explains how we use cookies and local storage technologies on our website:",
      
      cookies1: "1. WHAT ARE COOKIES AND LOCAL STORAGE?",
      cookies1Content: "Cookies are small text files that are stored on your device when you visit our website. Local storage includes localStorage and sessionStorage, which are browser technologies for temporarily storing information.",
      
      cookies2: "2. TYPES OF STORAGE WE USE",
      cookies2Title: "We use the following types of storage:",
      cookies2List: [
        "Authentication cookies: Automatically managed by NextAuth to maintain administrator sessions",
        "localStorage: To remember your preferred language and terms acceptance",
        "sessionStorage: To temporarily store form data and previews",
        "Session cookies: To maintain your active session during system use"
      ],
      
      cookies3: "3. SYSTEM-SPECIFIC STORAGE",
      cookies3Content: "Our system uses specific storage for:",
      cookies3List: [
        "Administrator authentication (JWT cookies with 5-minute duration)",
        "Language preference (localStorage: Spanish, English, Guarani, Portuguese)",
        "Terms and conditions acceptance (localStorage with timestamp)",
        "Alert previews (temporary sessionStorage)",
        "Form data to prevent information loss (sessionStorage)"
      ],
      
      cookies4: "4. THIRD-PARTY COOKIES",
      cookies4Content: "IMPORTANT: We do not use third-party cookies for commercial, advertising, or tracking purposes. All cookies are system-owned and used exclusively for investigative and operational purposes.",
      
      cookies5: "5. STORAGE CONTROL",
      cookies5Content: "You can control storage through your browser settings. However, disabling certain cookies may affect system functionality. Essential cookies for security and authentication cannot be disabled.",
      
      cookies6: "6. STORAGE DURATION",
      cookies6Title: "Storage duration:",
      cookies6List: [
        "Authentication cookies: 5 minutes (administrator session)",
        "Language localStorage: Up to 1 year or until manually deleted",
        "Terms acceptance localStorage: 2 hours (automatic renewal)",
        "Preview sessionStorage: Until browser is closed",
        "Form sessionStorage: Until tab is closed"
      ],
      
      cookies7: "7. EXCLUSIVELY INVESTIGATIVE PURPOSE",
      cookies7Content: "All storage is used EXCLUSIVELY for investigative purposes and system operation. No data is collected for commercial analysis, advertising, or user tracking.",
      
      cookies8: "8. SPECIFIC TECHNICAL INFORMATION",
      cookies8Content: "We use NextAuth for authentication, which automatically manages JWT cookies. localStorage is used for user preferences and sessionStorage for temporary session data. We do not implement tracking cookies or behavioral analysis."
    },
    
    gn: {
      title: "Ñe'ẽme'ẽ ha Ñemboheko - Tekorosã Rehegua",
      subtitle: "Mitã'i, mitãkuña ha mitãrusukuéra ndoguerekóiha rehegua momarandu - MAFE Ñemomarandu",
      lastUpdated: "Oñemboaje pahague: Jasyteĩ 2025",
      
      termsTitle: "ÑE'ẼME'Ẽ HA ÑEMBOHEKO",
      termsIntro: "Ko sistema eipuruvo, eñemoneĩ umi ñe'ẽme'ẽ ha ñemboheko oĩva:",
      
      terms2: "2. MARANDU AÑETE",
      terms2Content: "Eñemoneĩ eme'ẽ marandu añete ha tekorã. Marandu japu térã oporombotavýva oguereko mba'e vai artículo 289 ha 291 Ley 1160/97 'Código Penal' rehegua.",
      
      article289: "Artículo 289.- Momarandu japu: Avave oikuaávo ha oñeha'ãvo oñemboheko ambue ndive, omombe'u japu oikóva mba'e vai, oñembyai pena privativa libertad 5 ary peve térã multa.",
      article291: "Artículo 291.- Mba'e vai ñemoha'ã: Avave oikuaávo ome'ẽ marandu japu, oñembyai pena privativa libertad 3 ary peve térã multa.",
      
      privacyTitle: "TEKOROSÃ REHEGUA",
      privacyIntro: "Nde tekorosã tuicha ore g̃uarã. Ko ñemboheko omombe'u mba'éichapa roñongatu, roipuru ha roñangareko nde marandu:",
      
      privacy2: "ÑEMOMBA'E REHEGUA AÑOITE",
      privacy2Content: "TUICHA: Marandu opaichagua oñongatupyre ojeipuru AÑOITE ñemomba'e rehegua ndoguerekóiha jeheka. Avave mba'eichagua oñemomba'e ambue ndive viru rehegua.",
      
      privacy4Note: "AVAVE mba'eichagua oñemomba'e mba'apohára ndive, viru rehegua térã ambue ndive viru rehegua.",
      
      dataTitle: "MARANDU ESPECÍFICO OÑONGATUPYRE",
      dataIntro: "Oñemoneĩ porã hag̃ua, romombe'u mba'épa marandu roñongatu:",
      
      finalTitle: "ÑEMBOHEKO PAHAGUE",
      finalContent: "Ko sistema oikove tekorosã ha mba'e porã rehegua. Nde marandu oñangareko ha ojeipuru añoite ndoguerekóiha jeheka pytyvõ. Ndahi'arei viru rehegua, ñemomarandu térã viru rehegua nde marandu rehegua.",
      
      finalNote: "Eguerekóiramo marandu nde rehegua rehegua, roñe'ẽ eñe'ẽ autoridad ndive sistema eipuru mboyve.",
      
      terms1: "1. SISTEMA JEIPURU",
      terms1Content: "Ko sistema ojeipuru añoite ndoguerekóiha rehegua momarandu ha ñemomarandu rehegua. Jeipuru oikotevẽ tekorosã ha añete.",
      terms3: "3. ÑEMBOHEKO",
      terms3Content: "Ko sistema ha'e tembipuru pytyvõ autoridad ndive. Ñemomba'e tuicha oĩ organismo ndive.",
      terms4: "4. ÑEMOÑE'Ẽ",
      terms4Content: "Oñeñe'ẽ sistema jeipuru viru rehegua, ñemomarandu térã ambue rehegua.",
      
      privacy1: "1. MARANDU ROÑONGATU",
      privacy1Content: "Roñongatu añoite marandu eikotevẽ ñemomba'e rehegua, momaranduha marandu, ndoguerekóiha marandu ha tembipuru marandu.",
      privacy3: "3. MARANDU JEIPURU",
      privacy3Title: "Marandu ojeipuru:",
      privacy3List: [
        "Ndoguerekóiha momarandu jeheka",
        "Ñemomarandu ñangareko",
        "Policía ñemomba'e pytyvõ",
        "Tetã marandu ñangareko",
        "Sistema porãve jeheka"
      ],
      privacy4: "4. MARANDU ÑEMOMBA'E",
      privacy4Title: "Marandu oñemomba'e añoite:",
      privacy4List: [
        "Policía autority",
        "Tetã organismo",
        "Seguridad fuerza",
        "Ambue tetã organismo eikotevẽvo"
      ],
      privacy5: "5. ÑONGATU HA TEKOROSÃ",
      privacy5Content: "Marandu oñongatu servidor tekorosã ndive. Tekorosã protocolo ojeipuru marandu ñangareko.",
      privacy6: "6. NDE DERECHO",
      privacy6Title: "Eguereko derecho:",
      privacy6List: [
        "Marandu ore reko nde rehegua jeheka",
        "Marandu vai ñemboheko jerure",
        "Marandu ñembogue jerure (eikotevẽvo)",
        "Ñemoneĩ ñembogue",
        "Autority ndive ñembohovái"
      ],
      
      dataReporter: "Momaranduha Marandu:",
      dataReporterList: [
        "Téra ha téra paha",
        "Documento tipo ha número",
        "Ary reñeñe'ẽ",
        "Menda reko",
        "Género",
        "Pumbyry número",
        "Dirección paha",
        "Departamento",
        "Tetãygua",
        "Documento ta'anga (tenonde ha kupe)"
      ],
      dataTechnical: "Tembipuru Marandu:",
      dataTechnicalList: [
        "Tembipuru IP kundaharape",
        "Navegador marandu",
        "Tembipuru tipo",
        "Tenda (eñemoneĩvo añoite)",
        "VPN térã proxy jeheka"
      ],
      dataMissing: "Ndoguerekóiha Marandu:",
      dataMissingList: [
        "Téra ha téra paha",
        "Documento (eikotevẽvo)",
        "Ary reñeñe'ẽ",
        "Género",
        "Pumbyry número (eikotevẽvo)",
        "Tete reko mbyky",
        "Ta'anga",
        "Ndoguerekóiha mba'e",
        "Tenda paha reikuaáva"
      ],
      
      finalNote2: "Ko kuatiarogue oñemoneĩ porã ha eikotevẽ eñeñe'ẽ opaichagua sistema eipuru mboyve.",
      
      // Sección de Cookies
      cookiesTitle: "COOKIE HA ÑONGATU ÑEMBOHEKO",
      cookiesIntro: "Ko ñemboheko omombe'u mba'éichapa roipuru cookie ha ñongatu tembipuru:",
      
      cookies1: "1. MÁVA COOKIE HA ÑONGATU?",
      cookies1Content: "Cookie ha'e kuatia'i oñongatupyre nde tembipuru-pe eikevo ore ñanduti rendápe. Ñongatu oike localStorage ha sessionStorage, ha'e tembipuru navegador marandu ñongatu hag̃ua.",
      
      cookies2: "2. ÑONGATU TIPO ROIPURU",
      cookies2Title: "Roipuru umi ñongatu tipo:",
      cookies2List: [
        "Ñemoneĩ cookie: NextAuth omangareko automático administrador sesión",
        "localStorage: Nde ñe'ẽ ha ñemoneĩ ñangareko",
        "sessionStorage: Kuatia marandu ha jeheka ñongatu",
        "Sesión cookie: Nde sesión ñangareko sistema eipuru aja"
      ],
      
      cookies3: "3. SISTEMA ÑONGATU ESPECÍFICO",
      cookies3Content: "Ore sistema oipuru ñongatu específico:",
      cookies3List: [
        "Administrador ñemoneĩ (JWT cookie 5 minuto)",
        "Ñe'ẽ ñemoneĩ (localStorage: español, inglés, guaraní, portugués)",
        "Ñe'ẽme'ẽ ñemoneĩ (localStorage timestamp ndive)",
        "Ñemomarandu jeheka (sessionStorage temporal)",
        "Kuatia marandu ndoñembyai hag̃ua (sessionStorage)"
      ],
      
      cookies4: "4. AMBUE COOKIE",
      cookies4Content: "TUICHA: Ndoroipuru ambue cookie viru rehegua, ñemomarandu térã jeheka rehegua. Opa cookie ha'e ore sistema ha ojeipuru añoite ñemomba'e ha oikove rehegua.",
      
      cookies5: "5. ÑONGATU ÑANGAREKO",
      cookies5Content: "Eikotevẽ ñongatu ñangareko nde navegador rehegua. Hákatu, cookie ñembogue oñembyai sistema oikove. Tekorosã cookie ndaikatúi ñembogue.",
      
      cookies6: "6. ÑONGATU ARY",
      cookies6Title: "Ñongatu ary:",
      cookies6List: [
        "Ñemoneĩ cookie: 5 minuto (administrador sesión)",
        "Ñe'ẽ localStorage: 1 ary peve térã eñemboguevo",
        "Ñemoneĩ localStorage: 2 hora (automático renovación)",
        "Jeheka sessionStorage: Navegador ñembogue peve",
        "Kuatia sessionStorage: Pestaña ñembogue peve"
      ],
      
      cookies7: "7. ÑEMOMBA'E REHEGUA AÑOITE",
      cookies7Content: "Opa ñongatu ojeipuru AÑOITE ñemomba'e rehegua ha sistema oikove. Ndahi'arei marandu viru rehegua, ñemomarandu térã jeheka rehegua.",
      
      cookies8: "8. TEMBIPURU MARANDU ESPECÍFICO",
      cookies8Content: "Roipuru NextAuth ñemoneĩ hag̃ua, omangareko automático JWT cookie. localStorage ojeipuru usuario ñemoneĩ ha sessionStorage sesión marandu temporal. Ndoroipuru jeheka cookie térã comportamiento jeheka."
    },
    
    pt: {
      title: "Termos e Condições - Política de Privacidade",
      subtitle: "Sistema de Denúncias de Crianças e Adolescentes Desaparecidos - Alerta MAFE",
      lastUpdated: "Última atualização: junho 2025",
      
      termsTitle: "TERMOS E CONDIÇÕES",
      termsIntro: "Ao usar este sistema, você concorda com os seguintes termos e condições:",
      
      terms2: "2. VERACIDADE DA INFORMAÇÃO",
      terms2Content: "Você se compromete a fornecer informações verdadeiras e precisas. Informações falsas ou enganosas podem ter consequências legais em relação aos artigos 289 e 291 da Lei 1160/97 'Código Penal'.",
      
      article289: "Artigo 289.- Denúncia falsa: Quem sabendo e com o fim de provocar ou fazer continuar um procedimento contra outro, lhe atribuir falsamente ter realizado um fato antijurídico, será castigado com pena privativa de liberdade de até cinco anos ou com multa.",
      article291: "Artigo 291.- Simulação de um fato punível: Quem sabendo fornecer informação falsa será castigado com pena privativa de liberdade de até três anos ou com multa.",
      
      privacyTitle: "POLÍTICA DE PRIVACIDADE",
      privacyIntro: "Sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações:",
      
      privacy2: "FINALIDADE EXCLUSIVAMENTE INVESTIGATIVA",
      privacy2Content: "IMPORTANTE: Todos os dados coletados são utilizados EXCLUSIVAMENTE com fins investigativos para a busca de pessoas desaparecidas. Sob nenhum motivo são compartilhados com terceiros com finalidade comercial.",
      
      privacy4Note: "NUNCA são compartilhadas informações com empresas privadas, organizações comerciais ou terceiros com fins lucrativos.",
      
      dataTitle: "DADOS ESPECÍFICOS COLETADOS",
      dataIntro: "Para ser completamente transparentes, informamos exatamente quais dados coletamos:",
      
      finalTitle: "DECLARAÇÃO FINAL",
      finalContent: "Este sistema opera sob os mais altos padrões de ética e legalidade. Suas informações estão protegidas e são utilizadas unicamente para ajudar a encontrar pessoas desaparecidas. Não há fins comerciais, publicitários ou de lucro associados ao uso de seus dados.",
      
      finalNote: "Se você tem alguma dúvida sobre o uso de seus dados, recomendamos contactar diretamente as autoridades competentes antes de usar o sistema.",
      
      terms1: "1. USO DO SISTEMA",
      terms1Content: "Este sistema é destinado exclusivamente para a denúncia de pessoas desaparecidas e a gestão de alertas relacionados. O uso deve ser responsável e veraz.",
      terms3: "3. RESPONSABILIDADE",
      terms3Content: "O sistema é uma ferramenta de apoio para as autoridades. A responsabilidade principal da investigação recai nos organismos competentes.",
      terms4: "4. PROIBIÇÕES",
      terms4Content: "Está proibido o uso do sistema para fins comerciais, publicitários ou qualquer outro propósito não autorizado.",
      
      privacy1: "1. INFORMAÇÃO QUE COLETAMOS",
      privacy1Content: "Coletamos unicamente a informação necessária para os fins investigativos, incluindo dados do denunciante, informação da pessoa desaparecida, e dados técnicos do dispositivo.",
      privacy3: "3. USO DA INFORMAÇÃO",
      privacy3Title: "A informação é utilizada para:",
      privacy3List: [
        "Processar denúncias de pessoas desaparecidas",
        "Gerenciar alertas de busca",
        "Facilitar investigações policiais",
        "Manter estatísticas oficiais",
        "Melhorar o funcionamento do sistema"
      ],
      privacy4: "4. COMPARTILHAR INFORMAÇÃO",
      privacy4Title: "A informação só é compartilhada com:",
      privacy4List: [
        "Autoridades policiais competentes",
        "Organismos governamentais autorizados",
        "Forças de segurança do Estado",
        "Outras entidades oficiais quando legalmente requerido"
      ],
      privacy5: "5. ARMAZENAMENTO E SEGURANÇA",
      privacy5Content: "Os dados são armazenados em servidores seguros com medidas de proteção adequadas. São implementados protocolos de segurança para proteger a informação pessoal.",
      privacy6: "6. SEUS DIREITOS",
      privacy6Title: "Você tem direito a:",
      privacy6List: [
        "Acessar a informação que temos sobre você",
        "Solicitar a correção de dados inexatos",
        "Solicitar a eliminação de dados (quando legalmente possível)",
        "Revogar o consentimento em qualquer momento",
        "Apresentar uma queixa perante as autoridades competentes"
      ],
      
      dataReporter: "Dados do Denunciante:",
      dataReporterList: [
        "Nome e sobrenome completo",
        "Tipo e número de documento de identidade",
        "Data de nascimento",
        "Estado civil",
        "Gênero",
        "Número de telefone",
        "Endereço completo",
        "Departamento",
        "Nacionalidade",
        "Fotos de documentos de identidade (frente e verso)"
      ],
      dataTechnical: "Dados Técnicos:",
      dataTechnicalList: [
        "Endereço IP do dispositivo",
        "Informação do navegador web",
        "Tipo de dispositivo utilizado",
        "Localização geográfica (só se você autorizar)",
        "Detecção de uso de VPN ou proxy"
      ],
      dataMissing: "Dados da Pessoa Desaparecida:",
      dataMissingList: [
        "Nome e sobrenome completo",
        "Documento de identidade (opcional)",
        "Data de nascimento",
        "Gênero",
        "Número de telefone (opcional)",
        "Características físicas detalhadas",
        "Fotos da pessoa",
        "Relato da desaparecimento",
        "Última localização conhecida"
      ],
      
      finalNote2: "Este documento é legalmente vinculante e deve ser lido completamente antes de usar o sistema.",
      
      // Sección de Cookies
      cookiesTitle: "POLÍTICA DE COOKIES E ARMAZENAMENTO LOCAL",
      cookiesIntro: "Esta política explica como utilizamos cookies e tecnologias de armazenamento local em nosso site:",
      
      cookies1: "1. O QUE SÃO COOKIES E ARMAZENAMENTO LOCAL?",
      cookies1Content: "Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita nosso site. O armazenamento local inclui localStorage e sessionStorage, que são tecnologias do navegador para armazenar informações temporariamente.",
      
      cookies2: "2. TIPOS DE ARMAZENAMENTO QUE UTILIZAMOS",
      cookies2Title: "Utilizamos os seguintes tipos de armazenamento:",
      cookies2List: [
        "Cookies de autenticação: Gerenciadas automaticamente pelo NextAuth para manter sessões de administradores",
        "localStorage: Para lembrar seu idioma preferido e aceitação de termos",
        "sessionStorage: Para armazenar temporariamente dados de formulários e visualizações prévias",
        "Cookies de sessão: Para manter sua sessão ativa durante o uso do sistema"
      ],
      
      cookies3: "3. ARMAZENAMENTO ESPECÍFICO DO SISTEMA",
      cookies3Content: "Nosso sistema utiliza armazenamento específico para:",
      cookies3List: [
        "Autenticação de administradores (cookies JWT com duração de 5 minutos)",
        "Preferência de idioma (localStorage: espanhol, inglés, guarani, portugués)",
        "Aceitação de termos e condições (localStorage com timestamp)",
        "Visualizações prévias de alertas (sessionStorage temporário)",
        "Dados de formulários para evitar perda de informações (sessionStorage)"
      ],
      
      cookies4: "4. COOKIES DE TERCEIROS",
      cookies4Content: "IMPORTANTE: Não utilizamos cookies de terceiros para fins comerciais, publicitários ou de rastreamento. Todas as cookies são próprias do sistema e são utilizadas exclusivamente para fins investigativos e de funcionamento.",
      
      cookies5: "5. CONTROLE DO ARMAZENAMENTO",
      cookies5Content: "Você pode controlar o armazenamento através das configurações do seu navegador. No entanto, desabilitar certas cookies pode afetar o funcionamento do sistema. Cookies essenciais para segurança e autenticação não podem ser desabilitadas.",
      
      cookies6: "6. DURAÇÃO DO ARMAZENAMENTO",
      cookies6Title: "Duração do armazenamento:",
      cookies6List: [
        "Cookies de autenticação: 5 minutos (sessão de administrador)",
        "localStorage de idioma: Até 1 ano ou até eliminação manual",
        "localStorage de aceitação de termos: 2 horas (renovação automática)",
        "sessionStorage de visualização prévia: Até fechar o navegador",
        "sessionStorage de formulários: Até fechar a aba"
      ],
      
      cookies7: "7. FINALIDADE EXCLUSIVAMENTE INVESTIGATIVA",
      cookies7Content: "Todo o armazenamento é utilizado EXCLUSIVAMENTE para fins investigativos e de funcionamento do sistema. Não são coletados dados para análises comerciais, publicidade ou rastreamento de usuários.",
      
      cookies8: "8. INFORMAÇÃO TÉCNICA ESPECÍFICA",
      cookies8Content: "Utilizamos NextAuth para autenticação, que gerencia automaticamente as cookies JWT. O localStorage é usado para preferências de usuário e o sessionStorage para dados temporários de sessão. Não implementamos cookies de rastreamento nem análise de comportamento."
    }
  };

  const t = translations[language] || translations.es;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Banner principal de ancho completo */}
      <div className="relative w-full h-48 mb-6">
        <img
          src="/src/Gobierno_del_Paraguay_Palacio.jpg"
          alt="Gobierno del Paraguay"
          className="w-full h-48 object-cover"
        />
        <img
          src="/src/pn.png"
          alt="Policía Nacional"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-28 w-auto"
          style={{ zIndex: 10 }}
        />
      </div>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{t.title}</h1>
            <h2 className="text-xl text-gray-700 mb-2">{t.subtitle}</h2>
            <p className="text-sm text-gray-500">{t.lastUpdated}</p>
          </div>

          {/* Términos y Condiciones */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{t.termsTitle}</h2>
            <p className="text-gray-700 mb-6">{t.termsIntro}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.terms1}</h3>
                <p className="text-gray-700 mb-3">{t.terms1Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.terms2}</h3>
                <p className="text-gray-700 mb-3">{t.terms2Content}</p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <p className="text-orange-700 text-sm">
                    <strong>{t.article289.split(':')[0]}:</strong> {t.article289.split(':')[1]}
                  </p>
                  <p className="text-orange-700 text-sm mt-2">
                    <strong>{t.article291.split(':')[0]}:</strong> {t.article291.split(':')[1]}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.terms3}</h3>
                <p className="text-gray-700 mb-3">{t.terms3Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.terms4}</h3>
                <p className="text-gray-700 mb-3">{t.terms4Content}</p>
              </div>
            </div>
          </section>

          {/* Política de Privacidad */}
          <section id="privacy" className="mb-12 scroll-mt-20" style={{scrollMarginTop: '80px'}}>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{t.privacyTitle}</h2>
            <p className="text-gray-700 mb-6">{t.privacyIntro}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.privacy1}</h3>
                <p className="text-gray-700 mb-3">{t.privacy1Content}</p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">{t.privacy2}</h3>
                <p className="text-yellow-700 font-medium">{t.privacy2Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.privacy3}</h3>
                <p className="text-gray-700 mb-3">{t.privacy3Title}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.privacy3List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.privacy4}</h3>
                <p className="text-gray-700 mb-3">{t.privacy4Title}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.privacy4List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-3">
                  <p className="text-red-700 font-medium">{t.privacy4Note}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.privacy5}</h3>
                <p className="text-gray-700 mb-3">{t.privacy5Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.privacy6}</h3>
                <p className="text-gray-700 mb-3">{t.privacy6Title}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.privacy6List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Datos específicos recolectados */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{t.dataTitle}</h2>
            <p className="text-gray-700 mb-6">{t.dataIntro}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.dataReporter}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.dataReporterList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.dataTechnical}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.dataTechnicalList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.dataMissing}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.dataMissingList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Declaración Final */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{t.finalTitle}</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <p className="text-green-700 font-medium mb-3">{t.finalContent}</p>
              <p className="text-green-600">{t.finalNote}</p>
            </div>
          </section>

          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t.finalNote2}
            </p>
          </div>

          {/* Sección de Cookies */}
          <section id="cookies" className="mt-12 scroll-mt-20" style={{scrollMarginTop: '80px'}}>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{t.cookiesTitle}</h2>
            <p className="text-gray-700 mb-6">{t.cookiesIntro}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies1}</h3>
                <p className="text-gray-700 mb-3">{t.cookies1Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies2}</h3>
                <p className="text-gray-700 mb-3">{t.cookies2Title}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.cookies2List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies3}</h3>
                <p className="text-gray-700 mb-3">{t.cookies3Content}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.cookies3List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies4}</h3>
                <p className="text-gray-700 mb-3">{t.cookies4Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies5}</h3>
                <p className="text-gray-700 mb-3">{t.cookies5Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies6}</h3>
                <p className="text-gray-700 mb-3">{t.cookies6Title}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {t.cookies6List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies7}</h3>
                <p className="text-gray-700 mb-3">{t.cookies7Content}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cookies8}</h3>
                <p className="text-gray-700 mb-3">{t.cookies8Content}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 
