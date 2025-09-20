#!/usr/bin/env sh
set -e

echo "Running Laravel setup..."

# Create .env file with production configuration
echo "Creating .env file..."
cat > .env <<EOL
APP_NAME=oneStreamCrud
APP_ENV=production
APP_KEY=base64:+/HoJ/aH9iqq/jkbx6e7CG3bIERt0XGPSQ4YZ7BgB9g=
APP_DEBUG=false
APP_URL=https://one-stream-crud.onrender.com

DATABASE_URL=postgresql://one_stream_crud_user:lo4apazpytLxEdextlbCK0PQlcnMWE46@dpg-d36746be5dus73fqdma0-a/one_stream_crud
DB_CONNECTION=pgsql
DB_HOST=dpg-d36746be5dus73fqdma0-a
DB_PORT=5432
DB_DATABASE=one_stream_crud
DB_USERNAME=one_stream_crud_user
DB_PASSWORD=lo4apazpytLxEdextlbCK0PQlcnMWE46
L5_SWAGGER_CONST_HOST=https://one-stream-crud.onrender.com
L5_SWAGGER_GENERATE_ALWAYS=true
EOL

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
php artisan l5-swagger:generate

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
