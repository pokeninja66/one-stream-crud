#!/usr/bin/env sh
set -e

echo "Starting PHP-FPM..."
php-fpm83 -D

echo "Starting NGINX..."
nginx -g "daemon off;"
