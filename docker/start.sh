#!/usr/bin/env sh
set -e

echo "Running Laravel setup..."

if [ -z "$APP_KEY" ]; then
  echo "Generating application key..."
  php artisan key:generate --ansi
fi

echo "Clearing and caching config/routes/views..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force || true

echo "Seeding database..."
php artisan db:seed --force || true

echo "Generating API documentation..."
php artisan l5-swagger:generate || true

echo "Optimizing app..."
php artisan optimize

# Important: hand back control to the base image's startup
echo "Starting supervisord (nginx + php-fpm)..."
exec /start.sh
