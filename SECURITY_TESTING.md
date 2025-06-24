# 🔒 Guía de Pruebas de Seguridad Automatizadas

Esta guía explica cómo usar las herramientas de automatización de pruebas de seguridad implementadas en el sistema.

## 📋 Herramientas Disponibles

### 1. **OWASP ZAP (Zed Attack Proxy)**
Herramienta gratuita para pruebas de seguridad automatizadas.

### 2. **Jest - Pruebas Unitarias**
Pruebas unitarias específicas para funcionalidades de seguridad.

### 3. **Artillery - Pruebas de Carga y Seguridad**
Simulación de ataques y verificación de resistencia del sistema.

### 4. **Scripts de Verificación Rápida**
Scripts para verificar configuraciones de seguridad específicas.

## 🚀 Instalación y Configuración

### Instalar Dependencias
```bash
npm install
```

### Instalar OWASP ZAP (Opcional)
```bash
# Windows
# Descargar desde: https://www.zaproxy.org/download/

# Linux
sudo apt-get install zaproxy

# macOS
brew install --cask owasp-zap
```

### Instalar Artillery CLI
```bash
npm install -g artillery
```

## 🧪 Ejecutar Pruebas

### 1. **Pruebas Unitarias de Seguridad**
```bash
# Ejecutar todas las pruebas de seguridad
npm run test:security

# Ejecutar con cobertura
npm run test:coverage
```

### 2. **Verificación de Headers de Seguridad**
```bash
# Verificar headers de seguridad
npm run check:headers

# Con URL personalizada
TARGET_URL=https://tu-sitio.com npm run check:headers
```

### 3. **Pruebas de Carga y Seguridad con Artillery**
```bash
# Ejecutar pruebas de carga
npm run load:test

# Ejecutar con reporte
npm run load:test:report
```

### 4. **Escaneo Completo con OWASP ZAP**
```bash
# Escaneo rápido
npm run security:zap

# Escaneo completo personalizado
npm run security:scan
```

### 5. **Suite Completa de Pruebas**
```bash
# Ejecutar todas las pruebas de seguridad
npm run security:full

# Ejecutar con reportes completos
npm run security:report
```

## 📊 Interpretación de Resultados

### Headers de Seguridad
- **✅ OK**: Header presente y configurado correctamente
- **❌ MISSING**: Header faltante
- **⚠️ INCORRECT**: Header presente pero con valor incorrecto

### Pruebas Unitarias
- **✅ PASS**: Funcionalidad de seguridad funciona correctamente
- **❌ FAIL**: Vulnerabilidad detectada

### Artillery (Pruebas de Carga)
- **Rate Limiting**: Verifica que el sistema limite requests excesivos
- **Headers**: Confirma presencia de headers de seguridad
- **Vulnerabilidades**: Detecta posibles puntos de entrada

### OWASP ZAP
- **🔴 High**: Vulnerabilidades críticas
- **🟡 Medium**: Vulnerabilidades moderadas
- **🟢 Low**: Vulnerabilidades menores
- **ℹ️ Info**: Información útil

## 🎯 Tipos de Pruebas Incluidas

### 1. **Validación de Archivos**
- ✅ Verificación de tipos de archivo permitidos
- ✅ Validación de tamaño máximo
- ✅ Detección de archivos maliciosos
- ✅ Procesamiento seguro de imágenes

### 2. **Rate Limiting**
- ✅ Protección contra ataques de fuerza bruta
- ✅ Límites por endpoint específico
- ✅ Headers informativos de rate limit

### 3. **Headers de Seguridad**
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Content-Security-Policy
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### 4. **Detección de Actividad Sospechosa**
- ✅ User-Agents maliciosos
- ✅ Rutas sospechosas
- ✅ Patrones de ataque conocidos

### 5. **Autenticación y Autorización**
- ✅ Validación de credenciales
- ✅ Protección de rutas administrativas
- ✅ Manejo seguro de sesiones

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# URL objetivo para pruebas
TARGET_URL=https://tu-sitio.com

# Configuración de ZAP
ZAP_PATH=/usr/local/bin/zap-cli
ZAP_API_KEY=tu-api-key

# Configuración de Artillery
ARTILLERY_WORKERS=4
ARTILLERY_TIMEOUT=30000
```

### Personalizar Pruebas
```bash
# Modificar límites de rate limiting
# Editar: middleware.ts

# Agregar nuevos tipos de archivo permitidos
# Editar: lib/file-validation.ts

# Personalizar detección de actividad sospechosa
# Editar: lib/security-logger.ts
```

## 📈 Monitoreo Continuo

### Integración con CI/CD
```yaml
# .github/workflows/security-tests.yml
name: Security Tests
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run test:security
      - run: npm run check:headers
      - run: npm run load:test
```

### Programación Automática
```bash
# Cron job para ejecutar pruebas diarias
0 2 * * * cd /path/to/project && npm run security:report
```

## 🚨 Respuesta a Incidentes

### Si se Detectan Vulnerabilidades

1. **Evaluar Severidad**
   - 🔴 Crítica: Parar inmediatamente
   - 🟡 Media: Planificar corrección
   - 🟢 Baja: Monitorear

2. **Documentar**
   - Tipo de vulnerabilidad
   - Endpoint afectado
   - Pasos para reproducir
   - Impacto potencial

3. **Corregir**
   - Implementar parche
   - Ejecutar pruebas nuevamente
   - Verificar corrección

4. **Reportar**
   - Actualizar documentación
   - Notificar stakeholders
   - Registrar lecciones aprendidas

## 📚 Recursos Adicionales

### Documentación
- [OWASP ZAP User Guide](https://www.zaproxy.org/docs/)
- [Artillery Documentation](https://www.artillery.io/docs)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

### Estándares de Seguridad
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CERT-PY Guidelines](https://cert.py/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Herramientas Complementarias
- **Nmap**: Escaneo de puertos
- **Nikto**: Escaneo de vulnerabilidades web
- **Burp Suite**: Testing manual avanzado
- **Metasploit**: Framework de penetración

## 🤝 Contribución

Para agregar nuevas pruebas de seguridad:

1. Crear archivo de prueba en `tests/`
2. Agregar script en `package.json`
3. Documentar en este archivo
4. Ejecutar pruebas completas
5. Verificar que no rompe funcionalidad existente

## 📞 Soporte

Para problemas con las pruebas de seguridad:

1. Revisar logs en `logs/security/`
2. Verificar configuración en archivos de script
3. Consultar documentación de herramientas
4. Crear issue en el repositorio

---

**Nota**: Estas herramientas están diseñadas para ayudar a identificar vulnerabilidades, pero no reemplazan una auditoría de seguridad profesional. Para auditorías del CERT-PY, se recomienda complementar con pruebas manuales y revisión de expertos. 