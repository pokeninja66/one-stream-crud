#!/usr/bin/env sh
set -e

echo "Starting PHP-FPM..."
php-fpm83 -F -R &

echo "Configuring NGINX for port ${PORT:-10000}..."
# Replace listen directive to bind on 0.0.0.0 (Render requirement)
sed -i "s|listen 80;|listen 0.0.0.0:${PORT:-10000};|" /etc/nginx/nginx.conf

echo "Starting NGINX..."
nginx -g "daemon off;"
