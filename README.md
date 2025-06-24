# 🚨 Sistema de Denuncias de Personas Desaparecidas - MAFE

Sistema web para la gestión de denuncias de personas desaparecidas, desarrollado para la Policía Nacional del Paraguay.

## 🌟 Características

- **Formulario de Denuncias**: Interfaz intuitiva para reportar personas desaparecidas
- **Panel Administrativo**: Gestión de denuncias, comentarios y alertas
- **Sistema de Códigos**: Seguimiento de denuncias mediante códigos únicos
- **Gestión de Archivos**: Upload y gestión segura de imágenes y documentos
- **Alertas**: Sistema de alertas para casos urgentes
- **Multilingüe**: Soporte para español e inglés

## 🔒 Seguridad Implementada

### Headers de Seguridad (100% implementados)
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- ✅ `Content-Security-Policy`: Configurado para prevenir XSS
- ✅ `Strict-Transport-Security`: En producción con HTTPS

### Protecciones Implementadas
- 🔐 **Autenticación Segura**: NextAuth con JWT
- 🛡️ **Rate Limiting**: Protección contra ataques de fuerza bruta
- 🚨 **Detección de Actividad Sospechosa**: Middleware de seguridad
- 📁 **Validación de Archivos**: Procesamiento seguro de imágenes
- 🔍 **Logging de Seguridad**: Registro de eventos de seguridad
- 🛡️ **Protección XSS**: Sanitización de entrada

## 🚀 Despliegue

### Despliegue en Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod
```

**Beneficios de Vercel:**
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Despliegues automáticos
- ✅ Escalabilidad automática

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# NextAuth
NEXTAUTH_SECRET="tu-secret-super-seguro"
NEXTAUTH_URL="https://tu-dominio.vercel.app"

# Producción
NODE_ENV="production"
```

## 🧪 Pruebas de Seguridad

### Ejecutar Pruebas Automatizadas

```bash
# Verificar headers de seguridad
npm run check:headers

# Pruebas manuales de seguridad
npm run security:manual

# Pruebas completas (requiere dependencias adicionales)
npm run security:full
```

### Resultados de Pruebas
- **Headers de Seguridad**: ✅ 100%
- **Rate Limiting**: ✅ Funcionando
- **Protección XSS**: ✅ Activa
- **Detección de Actividad Sospechosa**: ✅ Implementada

## 📊 Estado para CERT-PY

El sistema está **preparado para auditoría** del CERT-PY:

### ✅ Criterios Cumplidos
- **Organismo del Estado**: ✅ Policía Nacional del Paraguay
- **Tecnología Web**: ✅ Next.js (aplicación web)
- **Headers de Seguridad**: ✅ 100% implementados
- **Protecciones Básicas**: ✅ Rate limiting, validación, logging
- **HTTPS**: ✅ Automático en Vercel

### 📋 Documentación para Auditoría
- Headers de seguridad configurados
- Middleware de protección activo
- Logging de eventos de seguridad
- Validación de entrada implementada
- Rate limiting funcionando

## 🛠️ Desarrollo Local

### Instalación

```bash
# Clonar repositorio
git clone [url-del-repositorio]
cd DESAPARECIDOS

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run test         # Pruebas unitarias
npm run check:headers # Verificar headers de seguridad
```

## 📁 Estructura del Proyecto

```
DESAPARECIDOS/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Panel administrativo
│   ├── denuncias/         # Páginas de denuncias
│   └── components/        # Componentes React
├── lib/                   # Utilidades
│   ├── prisma.ts         # Cliente de base de datos
│   ├── security-logger.ts # Logging de seguridad
│   └── file-validation.ts # Validación de archivos
├── middleware.ts          # Middleware de seguridad
├── next.config.js         # Configuración de Next.js
└── prisma/               # Esquema de base de datos
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Despliegue**: Vercel
- **Seguridad**: Headers de seguridad, rate limiting, validación

## 📞 Soporte

Para soporte técnico o reportar problemas:

1. Crear issue en el repositorio
2. Contactar al equipo de desarrollo
3. Revisar logs de seguridad en producción

## 📄 Licencia

Este proyecto es propiedad del Gobierno del Paraguay y está destinado al uso oficial de la Policía Nacional.

---

**Desarrollado con ❤️ para la seguridad ciudadana del Paraguay** 