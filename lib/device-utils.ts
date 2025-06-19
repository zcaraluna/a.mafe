import { UAParser } from 'ua-parser-js';

export function detectDeviceInfo(userAgent: string | null) {
  if (!userAgent) return { deviceType: 'unknown', isProxy: false };

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  // Detectar tipo de dispositivo
  let deviceType = 'desktop';
  if (device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (device.type === 'tablet') {
    deviceType = 'tablet';
  }

  // Detectar si es proxy/VPN (basado en headers comunes)
  const isProxy = userAgent.toLowerCase().includes('proxy') || 
                 userAgent.toLowerCase().includes('vpn') ||
                 userAgent.toLowerCase().includes('tor') ||
                 userAgent.toLowerCase().includes('anonymous');

  return {
    deviceType,
    isProxy,
    browser: browser.name,
    os: os.name
  };
} 