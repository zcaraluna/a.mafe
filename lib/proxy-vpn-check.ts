export async function checkProxyOrVPN(ip: string): Promise<{ isProxy: boolean, vpnProvider?: string }> {
  const apiKey = process.env.IPQUALITYSCORE_KEY;
  if (!apiKey || !ip) return { isProxy: false };
  const url = `https://ipqualityscore.com/api/json/ip/${apiKey}/${ip}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { isProxy: false };
    const data = await res.json();
    const isProxy = data.proxy === true || data.vpn === true || data.tor === true;
    // Buscar proveedor en los campos más comunes
    const vpnProvider = data.vpn_provider || data.organization || data.ISP || undefined;
    return { isProxy, vpnProvider: isProxy ? vpnProvider : undefined };
  } catch (e) {
    return { isProxy: false };
  }
} 