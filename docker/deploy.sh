#!/usr/bin/env bash
set -e

echo "Running composer install..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Installing Node dependencies..."
npm ci

echo "Building frontend assets..."
npm run build

echo "Removing development dependencies..."
npm prune --production

echo "Generating application key..."
php artisan key:generate --ansi || true

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Clearing and optimizing caches..."
php artisan optimize

echo "Deployment completed successfully!"
