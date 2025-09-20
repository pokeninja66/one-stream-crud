#!/usr/bin/env sh
set -e

echo "Running Laravel setup..."


# Set production environment variables
export APP_ENV=production
export APP_DEBUG=false

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

# Publish Swagger UI assets
echo "Publishing Swagger UI assets..."
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"

# Generate API documentation
echo "Generating API documentation..."
# php artisan l5-swagger:generate
php artisan idoc:generate

# Copy and configure Swagger UI static assets
# echo "Copying and configuring Swagger UI assets..."
# mkdir -p public/api/docs/asset
# cp -r vendor/swagger-api/swagger-ui/dist/* public/api/docs/asset/
# sed -i 's|url: "https://petstore.swagger.io/v2/swagger.json"|url: "../api-docs.json"|' public/api/docs/asset/swagger-initializer.js

# Optimize application
echo "Optimizing application..."
php artisan optimize

# Create storage symlink
php artisan storage:link

echo "Starting PHP-FPM..."
php-fpm83 -F -R &

echo "Configuring NGINX for port ${PORT:-10000}..."
# Replace listen directive to bind on 0.0.0.0 (Render requirement)
sed -i "s|listen 80;|listen 0.0.0.0:${PORT:-10000};|" /etc/nginx/nginx.conf

echo "Starting NGINX..."
nginx -g "daemon off;"
