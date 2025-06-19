# Sistema de Denuncias de Personas Desaparecidas

Este es un sistema web para la gestión de denuncias de personas desaparecidas, desarrollado con Next.js, TypeScript y PostgreSQL.

## Características

- Formulario de denuncia con validación de datos
- Panel de administración para revisar denuncias
- Página pública para ver denuncias aprobadas
- Sistema de comentarios
- Integración con mapas para ubicaciones
- Almacenamiento seguro de imágenes
- Captura de IP y datos relevantes

## Requisitos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd desaparecidos
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/desaparecidos"
NEXTAUTH_SECRET="tu_secreto_seguro"
NEXTAUTH_URL="http://localhost:3000"
```

4. Inicializar la base de datos:
```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Estructura del Proyecto

```
├── app/
│   ├── page.tsx              # Página principal con formulario de denuncia
│   ├── admin/
│   │   └── page.tsx         # Panel de administración
│   └── denuncias/
│       └── page.tsx         # Página pública de denuncias
├── prisma/
│   └── schema.prisma        # Esquema de la base de datos
├── public/                  # Archivos estáticos
└── components/             # Componentes reutilizables
```

## Uso

1. Acceder a la página principal para realizar una denuncia
2. Los administradores pueden acceder al panel de administración en `/admin`
3. Las denuncias aprobadas se muestran públicamente en `/denuncias`

## Seguridad

- Todas las denuncias requieren verificación
- Se capturan IPs y datos relevantes
- Autenticación segura para administradores
- Validación de datos en todos los formularios
- Almacenamiento seguro de imágenes

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 