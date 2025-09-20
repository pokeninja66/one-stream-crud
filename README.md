# One Stream CRUD API

A full-stack application built with a Laravel backend and a React/TypeScript frontend for managing web streams. The application is containerized with Docker and configured for seamless deployment on Render.com.

## Features

- **Backend**: RESTful API built with Laravel (PHP 8.3).
- **Frontend**: Modern UI built with React, TypeScript, Inertia.js, and Tailwind CSS.
- **Database**: Supports PostgreSQL for production and SQLite for local development.
- **API Documentation**: Integrated Swagger UI for interactive API documentation.
- **Testing**: Comprehensive test suite using Pest for backend testing.
- **Containerization**: Fully containerized using Docker with a multi-stage build for optimized production images.
- **Deployment**: Continuous deployment configured for [Render.com](https://render.com/) via a `render.yaml` file.

## Local Development

There are two ways to run the application locally: using PHP/Node directly or using Docker.

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+
- SQLite (for local development)

### 1. Standard Setup (PHP/Node)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pokeninja66/one-stream-crud.git
    cd one-stream-crud
    ```

2.  **Install dependencies:**
    ```bash
    composer install
    npm install
    ```

3.  **Setup environment file:**
    ```bash
    cp .env.example .env
    ```

4.  **Generate application key:**
    ```bash
    php artisan key:generate
    ```

5.  **Setup database and seed data:**
    *Ensure `database/database.sqlite` exists and is writable.*
    ```bash
    php artisan migrate --seed
    ```

6.  **Build frontend assets:**
    ```bash
    npm run dev
    ```

7.  **Start the development server:**
    ```bash
    php artisan serve
    ```
    The application will be available at `http://127.0.0.1:8000`.

### 2. Docker Setup

1.  **Build the Docker image:**
    ```bash
    docker build -t one-stream-crud .
    ```

2.  **Run the Docker container:**
    *This command maps port 8080 on your local machine to port 80 inside the container.*
    ```bash
    docker run -p 8080:80 -e APP_KEY=$(php -r 'echo "base64:".base64_encode(random_bytes(32));') one-stream-crud
    ```
    The application will be available at `http://localhost:8080`.

### Test Credentials

You can log in to the application using the following test credentials:
- **Email**: `test@example.com`
- **Password**: `password`

## Testing

Run the full Pest test suite:
```bash
php artisan test
```

Run only the API feature tests:
```bash
php artisan test --group=api
```

## API Documentation

API documentation is generated using Swagger.
-   **Locally**: Run `php artisan l5-swagger:generate` and access it at `/api/documentation`.
-   **Production**: It is generated automatically on deployment and available at `https://one-stream-crud.onrender.com/api/documentation`.

## API Endpoints

Below are the available API endpoints. For more detailed information, please refer to the [Swagger Documentation](#-api-documentation).

### Streams

#### `GET /api/streams`

List all streams with support for filtering, sorting, and pagination.

- **Query Parameters:**
  - `search` (string): Filter by title or description.
  - `stream_type_id` (int): Filter by a specific stream type ID.
  - `order_by` (string): Field to sort by (`title`, `tokens_price`, `date_expiration`).
  - `order_dir` (string): Sort direction (`asc` or `desc`).
  - `per_page` (int): Number of results per page.

- **Example Request:**
  ```bash
  curl "http://127.0.0.1:8000/api/streams?search=tutorial&order_by=title&order_dir=asc"
  ```

#### `POST /api/streams`

Create a new stream.

- **Request Body:**
  ```json
  {
    "title": "New Stream Title",
    "description": "A description for the new stream.",
    "tokens_price": 100,
    "stream_type_id": 1,
    "date_expiration": "2024-12-31 23:59:59"
  }
  ```

#### `GET /api/streams/{id}`

Retrieve a single stream by its ID.

#### `PUT /api/streams/{id}`

Update an existing stream.

- **Request Body:**
  ```json
  {
    "title": "Updated Stream Title",
    "tokens_price": 150
  }
  ```

#### `DELETE /api/streams/{id}`

Soft delete a stream.

### Stream Types

#### `GET /api/stream-types`

List all available stream types.

## Deployment on Render

This project is configured for continuous deployment on Render. The `render.yaml` file in the root directory defines the services:
-   A **web service** that builds the Docker image from the `Dockerfile` and runs the `start.sh` script.
-   A **PostgreSQL database** service.

The `start.sh` script handles deployment tasks such as running migrations, seeding the database, generating API docs, and starting the NGINX and PHP-FPM services.

! NOTE: Currently there is some issue with the internal URL redirection of the swagger docs to my http port instead of the https one forced by render. Not sure how to fix it righ now so the API docs is currently only visible in development.

### Production Environment Variables

The following environment variables need to be configured on Render for the application to work correctly:

| Key                           | Description                                            | Example Value                                |
| ----------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| `APP_URL`                     | The public URL of the application.                     | `https://one-stream-crud.onrender.com`         |
| `DATABASE_URL`                | The connection string for the PostgreSQL database.     | Provided by Render                           |
| `APP_KEY`                     | Laravel application key.                               | `base64:...`                                 |
| `L5_SWAGGER_CONST_HOST`       | The host for Swagger to generate documentation against.| `https://one-stream-crud.onrender.com`         |
| `L5_SWAGGER_GENERATE_ALWAYS`  | Set to `true` to regenerate docs on each request.      | `true`                                       |
| `L5_SWAGGER_PROXY`            | Set to your proxy IP or `*` to trust Render's proxy.   | `*`                                          |