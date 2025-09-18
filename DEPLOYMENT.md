# Render.com Deployment Guide

## Quick Start

1. **Create PostgreSQL Database on Render:**
   - Go to Render Dashboard → New → PostgreSQL
   - Choose Free plan
   - Copy the **Internal Database URL**

2. **Create Web Service:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Choose **Docker** as runtime
   - Use the provided `Dockerfile`

3. **Set Environment Variables:**
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=<run: php artisan key:generate --show>
   DATABASE_URL=<your internal database URL>
   DB_CONNECTION=pgsql
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your app will be available at `https://your-app-name.onrender.com`

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `APP_ENV` | `production` | Application environment |
| `APP_DEBUG` | `false` | Disable debug mode |
| `APP_KEY` | Generated key | Laravel application key |
| `DATABASE_URL` | From Render | PostgreSQL connection string |
| `DB_CONNECTION` | `pgsql` | Database driver |

## What Happens During Deployment

1. Docker builds the application with PHP 8.2 + NGINX
2. Composer installs PHP dependencies
3. NPM builds frontend assets
4. Laravel caches configuration and routes
5. Database migrations run automatically
6. Database seeders populate sample data
7. Application starts with NGINX + PHP-FPM

## Troubleshooting

- **Build fails:** Check Docker logs in Render dashboard
- **Database connection issues:** Verify DATABASE_URL is correct
- **App key missing:** Generate with `php artisan key:generate --show`
- **Assets not loading:** Ensure HTTPS is forced (already configured)

## API Endpoints

Once deployed, your API will be available at:
- `https://your-app-name.onrender.com/api/streams`
- `https://your-app-name.onrender.com/api/stream-types`
- `https://your-app-name.onrender.com/api/documentation` (Swagger UI)
