# One Stream CRUD API

A Laravel-based API for managing streams and stream types with a React frontend.

## Features

- RESTful API for streams and stream types
- Comprehensive test coverage
- Docker containerization
- PostgreSQL database support
- Swagger API documentation
- React frontend with Inertia.js

## Local Development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+
- SQLite (for local development)

### Setup

1. Clone the repository
2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install Node dependencies:
   ```bash
   npm install
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

7. Build frontend assets:
   ```bash
   npm run build
   ```

8. Start the development server:
   ```bash
   php artisan serve
   ```

## Testing

Run the test suite:
```bash
php artisan test
```

Run only API tests:
```bash
php artisan test tests/Feature/Api
```


### Docker Configuration

The application uses a custom Dockerfile based on nginx-php-fpm with:
- PHP 8.3 with all required extensions
- NGINX web server
- Node.js for frontend asset building
- Optimized PHP-FPM configuration
- Security headers and caching

### API Documentation

Once deployed, API documentation is available at `/api/documentation` (Swagger UI).

## API Endpoints

### Streams
- `GET /api/streams` - List streams (with filtering, pagination, sorting)
- `POST /api/streams` - Create a new stream
- `GET /api/streams/{id}` - Get a specific stream
- `PUT /api/streams/{id}` - Update a stream
- `DELETE /api/streams/{id}` - Delete a stream

### Stream Types
- `GET /api/stream-types` - List stream types
- `POST /api/stream-types` - Create a new stream type
- `PUT /api/stream-types/{id}` - Update a stream type
- `DELETE /api/stream-types/{id}` - Delete a stream type

### User
- `GET /api/user` - Get authenticated user (requires Sanctum - not configured)

## Database Schema

The application includes:
- Users table (Laravel default)
- Stream types table
- Streams table (with soft deletes)
- Proper relationships and constraints