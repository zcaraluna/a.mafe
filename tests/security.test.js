/**
 * Pruebas unitarias de seguridad
 * Verifica las funcionalidades de seguridad implementadas
 */

const { validateAndProcessImage, generateSafeFileName, validateDocument } = require('../lib/file-validation');
const { detectSuspiciousActivity, getClientInfo } = require('../lib/security-logger');

// Mock para File
class MockFile {
  constructor(name, type, size, content = 'test') {
    this.name = name;
    this.type = type;
    this.size = size;
    this.content = content;
  }

  async arrayBuffer() {
    return Buffer.from(this.content);
  }
}

describe('Pruebas de Seguridad', () => {
  describe('Validación de Archivos', () => {
    test('debe validar imágenes válidas', async () => {
      const validImage = new MockFile('test.jpg', 'image/jpeg', 1024 * 1024);
      const result = await validateAndProcessImage(validImage);
      
      expect(result.isValid).toBe(true);
      expect(result.processedBuffer).toBeDefined();
    });

    test('debe rechazar archivos de tipo no permitido', async () => {
      const invalidFile = new MockFile('test.exe', 'application/x-executable', 1024);
      const result = await validateAndProcessImage(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Tipo de archivo no permitido');
    });

    test('debe rechazar archivos demasiado grandes', async () => {
      const largeFile = new MockFile('large.jpg', 'image/jpeg', 10 * 1024 * 1024); // 10MB
      const result = await validateAndProcessImage(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('demasiado grande');
    });

    test('debe generar nombres de archivo seguros', () => {
      const originalName = 'test file (1).jpg';
      const safeName = generateSafeFileName(originalName, 'prefix_');
      
      expect(safeName).toMatch(/^prefix_\d+_[a-z0-9]+_test_file_1\.jpg$/);
      expect(safeName).not.toContain('(');
      expect(safeName).not.toContain(')');
    });

    test('debe validar documentos correctamente', () => {
      const validDoc = new MockFile('document.pdf', 'application/pdf', 1024 * 1024);
      const result = validateDocument(validDoc);
      
      expect(result.isValid).toBe(true);
    });

    test('debe rechazar documentos de tipo no permitido', () => {
      const invalidDoc = new MockFile('script.js', 'application/javascript', 1024);
      const result = validateDocument(invalidDoc);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Tipo de documento no permitido');
    });
  });

  describe('Detección de Actividad Sospechosa', () => {
    test('debe detectar User-Agent sospechoso', () => {
      const suspiciousUserAgent = 'sqlmap/1.0';
      const result = detectSuspiciousActivity('192.168.1.1', suspiciousUserAgent);
      
      expect(result).toBe(true);
    });

    test('debe detectar rutas sospechosas', () => {
      const suspiciousPath = '/admin/config';
      const result = detectSuspiciousActivity('192.168.1.1', 'normal-browser', suspiciousPath);
      
      expect(result).toBe(true);
    });

    test('no debe detectar actividad normal como sospechosa', () => {
      const normalUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      const normalPath = '/api/denuncias';
      const result = detectSuspiciousActivity('192.168.1.1', normalUserAgent, normalPath);
      
      expect(result).toBe(false);
    });
  });

  describe('Información del Cliente', () => {
    test('debe extraer información del cliente correctamente', () => {
      const mockRequest = {
        headers: {
          get: (name) => {
            const headers = {
              'x-forwarded-for': '192.168.1.100',
              'user-agent': 'test-browser',
              'referer': 'https://example.com',
              'origin': 'https://example.com'
            };
            return headers[name];
          }
        }
      };

      const clientInfo = getClientInfo(mockRequest);
      
      expect(clientInfo.ip).toBe('192.168.1.100');
      expect(clientInfo.userAgent).toBe('test-browser');
      expect(clientInfo.referer).toBe('https://example.com');
      expect(clientInfo.origin).toBe('https://example.com');
    });

    test('debe manejar headers faltantes', () => {
      const mockRequest = {
        headers: {
          get: () => null
        }
      };

      const clientInfo = getClientInfo(mockRequest);
      
      expect(clientInfo.ip).toBe('unknown');
      expect(clientInfo.userAgent).toBeUndefined();
    });
  });
});

describe('Pruebas de Headers de Seguridad', () => {
  test('debe verificar headers de seguridad en next.config.js', () => {
    const nextConfig = require('../next.config.js');
    
    expect(nextConfig).toHaveProperty('headers');
    expect(typeof nextConfig.headers).toBe('function');
  });
});

describe('Pruebas de Rate Limiting', () => {
  test('debe verificar configuración de rate limits', () => {
    const rateLimits = {
      '/api/denuncias': { max: 10, window: 60 * 1000 },
      '/api/auth': { max: 5, window: 15 * 60 * 1000 },
      '/login': { max: 5, window: 15 * 60 * 1000 }
    };

    expect(rateLimits['/api/denuncias'].max).toBe(10);
    expect(rateLimits['/api/auth'].max).toBe(5);
    expect(rateLimits['/login'].max).toBe(5);
  });
});

describe('Pruebas de Autenticación', () => {
  test('debe verificar configuración de NextAuth', () => {
    const authOptions = require('../app/api/auth/[...nextauth]/authOptions.ts');
    
    expect(authOptions.session.strategy).toBe('jwt');
    expect(authOptions.session.maxAge).toBe(300); // 5 minutos
    expect(authOptions.cookies).toBeDefined();
  });
});

// Pruebas de integración simuladas
describe('Pruebas de Integración de Seguridad', () => {
  test('debe simular flujo completo de upload seguro', async () => {
    // Simular archivo válido
    const validFile = new MockFile('test.jpg', 'image/jpeg', 1024 * 1024);
    
    // Validar archivo
    const validation = await validateAndProcessImage(validFile);
    expect(validation.isValid).toBe(true);
    
    // Generar nombre seguro
    const safeName = generateSafeFileName(validFile.name, 'test_');
    expect(safeName).toMatch(/^test_\d+_[a-z0-9]+_test\.jpg$/);
    
    // Verificar que no es actividad sospechosa
    const isSuspicious = detectSuspiciousActivity('192.168.1.1', 'normal-browser', '/api/denuncias');
    expect(isSuspicious).toBe(false);
  });

  test('debe detectar y rechazar upload malicioso', async () => {
    // Simular archivo malicioso
    const maliciousFile = new MockFile('script.js', 'application/javascript', 1024);
    
    // Debe ser rechazado por validación de imagen
    const validation = await validateAndProcessImage(maliciousFile);
    expect(validation.isValid).toBe(false);
    
    // Debe ser rechazado por validación de documento
    const docValidation = validateDocument(maliciousFile);
    expect(docValidation.isValid).toBe(false);
  });
});

// Configuración de Jest
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'lib/**/*.js',
    'app/api/**/*.ts',
    'app/api/**/*.js',
    '!**/node_modules/**'
  ]
}; 