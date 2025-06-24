// Tipos de eventos de seguridad
export enum SecurityEventType {
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_UPLOAD_REJECTED = 'FILE_UPLOAD_REJECTED',
  ADMIN_ACTION = 'ADMIN_ACTION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  API_ACCESS = 'API_ACCESS',
  ERROR = 'ERROR'
}

// Interfaz para eventos de seguridad
export interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  ip: string;
  userAgent?: string;
  userId?: string;
  details: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

class SecurityLogger {
  private currentDate: string;

  constructor() {
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  private formatLogEntry(event: SecurityEvent): string {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    return JSON.stringify(logEntry) + '\n';
  }

  async log(event: Omit<SecurityEvent, 'timestamp'>) {
    try {
      const logEntry = this.formatLogEntry({
        ...event,
        timestamp: new Date().toISOString()
      });

      // En Edge Runtime, solo loggear a consola
      // En producción, esto podría enviarse a un servicio de logging
      console.log(`[SECURITY] ${event.type}:`, {
        ip: event.ip,
        severity: event.severity,
        details: event.details,
        timestamp: new Date().toISOString()
      });

      // Para eventos críticos, también loggear inmediatamente
      if (event.severity === 'CRITICAL') {
        console.error(`[SECURITY CRITICAL] ${event.type}:`, event);
      }

      // En producción, aquí se podría enviar a un servicio externo
      // como CloudWatch, Loggly, o un endpoint de logging
      if (process.env.NODE_ENV === 'production') {
        // Ejemplo: enviar a endpoint de logging
        // await fetch('/api/logging', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: logEntry
        // });
      }
    } catch (error) {
      console.error('Error writing security log:', error);
    }
  }

  // Métodos específicos para diferentes tipos de eventos
  async logLoginAttempt(ip: string, username: string, userAgent?: string, success = false) {
    await this.log({
      type: success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILURE,
      ip,
      userAgent,
      details: { username, success },
      severity: success ? 'LOW' : 'MEDIUM'
    });
  }

  async logRateLimitExceeded(ip: string, path: string, userAgent?: string) {
    await this.log({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ip,
      userAgent,
      details: { path, limit: 'exceeded' },
      severity: 'MEDIUM'
    });
  }

  async logFileUpload(ip: string, fileName: string, fileSize: number, userId?: string, userAgent?: string) {
    await this.log({
      type: SecurityEventType.FILE_UPLOAD,
      ip,
      userAgent,
      userId,
      details: { fileName, fileSize, success: true },
      severity: 'LOW'
    });
  }

  async logFileUploadRejected(ip: string, fileName: string, reason: string, userAgent?: string) {
    await this.log({
      type: SecurityEventType.FILE_UPLOAD_REJECTED,
      ip,
      userAgent,
      details: { fileName, reason },
      severity: 'MEDIUM'
    });
  }

  async logAdminAction(ip: string, userId: string, action: string, details: Record<string, any>, userAgent?: string) {
    await this.log({
      type: SecurityEventType.ADMIN_ACTION,
      ip,
      userAgent,
      userId,
      details: { action, ...details },
      severity: 'HIGH'
    });
  }

  async logSuspiciousActivity(ip: string, activity: string, details: Record<string, any>, userAgent?: string) {
    await this.log({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      ip,
      userAgent,
      details: { activity, ...details },
      severity: 'HIGH'
    });
  }

  async logApiAccess(ip: string, method: string, path: string, statusCode: number, userAgent?: string, userId?: string) {
    const severity = statusCode >= 400 ? 'MEDIUM' : 'LOW';
    await this.log({
      type: SecurityEventType.API_ACCESS,
      ip,
      userAgent,
      userId,
      details: { method, path, statusCode },
      severity
    });
  }

  async logError(ip: string, error: string, details: Record<string, any>, userAgent?: string) {
    await this.log({
      type: SecurityEventType.ERROR,
      ip,
      userAgent,
      details: { error, ...details },
      severity: 'HIGH'
    });
  }
}

// Instancia singleton
export const securityLogger = new SecurityLogger();

// Función helper para detectar actividad sospechosa
export function detectSuspiciousActivity(ip: string, userAgent?: string, path?: string): boolean {
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

// Función helper para obtener información del cliente
export function getClientInfo(req: Request): {
  ip: string;
  userAgent?: string;
  referer?: string;
  origin?: string;
} {
  const headers = req.headers;
  
  // Obtener IP real considerando proxies
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || 
             realIp || 
             'unknown';

  return {
    ip,
    userAgent: headers.get('user-agent') || undefined,
    referer: headers.get('referer') || undefined,
    origin: headers.get('origin') || undefined
  };
} 