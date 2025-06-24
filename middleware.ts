import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Tipos para rate limiting
interface RateLimitData {
  count: number
  resetTime: number
}

interface UserRateLimit {
  [path: string]: RateLimitData
}

// Almacenamiento en memoria para rate limiting (simplificado para Edge Runtime)
const rateLimit = new Map<string, UserRateLimit>()

// Configuración de límites por endpoint
const rateLimits: { [key: string]: { max: number; window: number } } = {
  '/api/denuncias': { max: 10, window: 60 * 1000 }, // 10 requests por minuto
  '/api/auth': { max: 5, window: 15 * 60 * 1000 },  // 5 intentos por 15 min
  '/login': { max: 5, window: 15 * 60 * 1000 },     // 5 intentos por 15 min
  '/api/admin': { max: 100, window: 60 * 1000 },    // 100 requests por minuto para admin
  '/api/denuncias/codigo': { max: 20, window: 60 * 1000 }, // 20 requests por minuto
  '/api/comentario': { max: 5, window: 60 * 1000 }, // 5 comentarios por minuto
  '/api/alertas': { max: 30, window: 60 * 1000 },   // 30 requests por minuto
}

// Función para detectar actividad sospechosa (simplificada)
function detectSuspiciousActivity(ip: string, userAgent?: string, path?: string): boolean {
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /burp/i,
    /w3af/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /metasploit/i,
    /hydra/i,
    /john/i,
    /hashcat/i
  ];

  const suspiciousPaths = [
    '/admin',
    '/wp-admin',
    '/phpmyadmin',
    '/mysql',
    '/config',
    '/.env',
    '/.git',
    '/.svn',
    '/backup',
    '/test',
    '/debug',
    '/console',
    '/shell',
    '/cmd',
    '/exec'
  ];

  // Verificar User-Agent sospechoso
  if (userAgent) {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        return true;
      }
    }
  }

  // Verificar rutas sospechosas
  if (path) {
    for (const suspiciousPath of suspiciousPaths) {
      if (path.includes(suspiciousPath)) {
        return true;
      }
    }
  }

  return false;
}

// Función para limpiar rate limits expirados (simplificada)
function cleanupExpiredLimits() {
  const now = Date.now()
  const entries = Array.from(rateLimit.entries())
  
  for (const [ip, userData] of entries) {
    const paths = Object.keys(userData)
    for (const path of paths) {
      const data = userData[path]
      if (now > data.resetTime) {
        delete userData[path]
      }
    }
    if (Object.keys(userData).length === 0) {
      rateLimit.delete(ip)
    }
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const method = request.method
  
  // Obtener información del cliente
  const clientInfo = {
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || undefined,
    referer: request.headers.get('referer') || undefined,
    origin: request.headers.get('origin') || undefined
  }

  // Detectar actividad sospechosa
  const isSuspicious = detectSuspiciousActivity(clientInfo.ip, clientInfo.userAgent, path)
  if (isSuspicious) {
    // Loggear actividad sospechosa (solo consola en Edge Runtime)
    console.log(`[SECURITY] Suspicious activity detected:`, {
      ip: clientInfo.ip,
      path,
      method,
      userAgent: clientInfo.userAgent,
      timestamp: new Date().toISOString()
    })
  }

  // Limpiar rate limits expirados (cada 100 requests para evitar sobrecarga)
  if (Math.random() < 0.01) { // ~1% de probabilidad
    cleanupExpiredLimits()
  }

  // Obtener el límite para esta ruta
  let limit = { max: 100, window: 60 * 1000 } // Default
  
  for (const [route, config] of Object.entries(rateLimits)) {
    if (path.startsWith(route)) {
      limit = config
      break
    }
  }
  
  const now = Date.now()
  
  // Inicializar datos del usuario si no existen
  if (!rateLimit.has(clientInfo.ip)) {
    rateLimit.set(clientInfo.ip, { [path]: { count: 1, resetTime: now + limit.window } })
  } else {
    const userData = rateLimit.get(clientInfo.ip)!
    
    // Inicializar datos para esta ruta si no existen
    if (!userData[path]) {
      userData[path] = { count: 1, resetTime: now + limit.window }
    } else {
      // Verificar si el tiempo de ventana ha expirado
      if (now > userData[path].resetTime) {
        userData[path] = { count: 1, resetTime: now + limit.window }
      } else {
        // Verificar si se ha excedido el límite
        if (userData[path].count >= limit.max) {
          // Loggear el evento de rate limit excedido
          console.log(`[SECURITY] Rate limit exceeded:`, {
            ip: clientInfo.ip,
            path,
            userAgent: clientInfo.userAgent,
            timestamp: new Date().toISOString()
          })
          
          return new NextResponse(
            JSON.stringify({ 
              error: 'Too Many Requests', 
              message: 'Has excedido el límite de requests. Intenta nuevamente más tarde.',
              retryAfter: Math.ceil((userData[path].resetTime - now) / 1000)
            }), 
            { 
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((userData[path].resetTime - now) / 1000).toString(),
                'X-RateLimit-Limit': limit.max.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': userData[path].resetTime.toString()
              }
            }
          )
        } else {
          userData[path].count++
        }
      }
    }
  }
  
  // Agregar headers de rate limit a la respuesta
  const response = NextResponse.next()
  const userData = rateLimit.get(clientInfo.ip)
  if (userData && userData[path]) {
    response.headers.set('X-RateLimit-Limit', limit.max.toString())
    response.headers.set('X-RateLimit-Remaining', (limit.max - userData[path].count).toString())
    response.headers.set('X-RateLimit-Reset', userData[path].resetTime.toString())
  }

  // Loggear acceso a API (solo para rutas de API)
  if (path.startsWith('/api/')) {
    console.log(`[API] Access:`, {
      ip: clientInfo.ip,
      method,
      path,
      userAgent: clientInfo.userAgent,
      timestamp: new Date().toISOString()
    })
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/login',
    '/admin/:path*'
  ]
} 