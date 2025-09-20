#!/usr/bin/env sh
set -e

echo "Running composer install..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Installing Node dependencies..."
npm ci

echo "Building frontend assets..."
npm run build

echo "Removing development dependencies..."
npm prune --production

echo "Deployment build completed!"
