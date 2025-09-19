#!/usr/bin/env sh
set -e

echo "Starting PHP-FPM..."
php-fpm83 -F -R

echo "Configuring NGINX for port ${PORT:-80}..."
# Replace port in nginx config
sed -i "s/listen 80;/listen ${PORT:-80};/" /etc/nginx/nginx.conf

echo "Starting NGINX..."
nginx -g "daemon off;"
