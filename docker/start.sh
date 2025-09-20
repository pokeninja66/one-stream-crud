#!/usr/bin/env sh
set -e

echo "Running Laravel setup..."

# Only generate APP_KEY if not already set
if [ -z "$APP_KEY" ]; then
  echo "Generating application key..."
  php artisan key:generate --ansi
fi

# Clear and cache config, routes, and views
echo "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Caching config, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations and seed database
echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

# Optimize application
echo "Optimizing application..."
php artisan optimize

echo "Starting PHP-FPM..."
php-fpm83 -F -R &

echo "Configuring NGINX for port ${PORT:-10000}..."
# Replace listen directive to bind on 0.0.0.0 (Render requirement)
sed -i "s|listen 80;|listen 0.0.0.0:${PORT:-10000};|" /etc/nginx/nginx.conf

echo "Starting NGINX..."
nginx -g "daemon off;"
