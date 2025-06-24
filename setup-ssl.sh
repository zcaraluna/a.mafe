#!/bin/bash

# Script para configurar HTTPS con Let's Encrypt
# Ejecutar como root: sudo bash setup-ssl.sh

DOMAIN="tu-dominio.com"
EMAIL="tu-email@ejemplo.com"

echo "🔒 Configurando HTTPS para $DOMAIN..."

# 1. Instalar Certbot
echo "📦 Instalando Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# 2. Obtener certificado SSL
echo "🎫 Obteniendo certificado SSL..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# 3. Configurar renovación automática
echo "🔄 Configurando renovación automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 4. Verificar configuración Nginx
echo "✅ Verificando configuración Nginx..."
nginx -t

# 5. Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo "🎉 HTTPS configurado exitosamente!"
echo "🌐 Tu sitio está disponible en: https://$DOMAIN"
echo "📊 Verificar SSL: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN" 