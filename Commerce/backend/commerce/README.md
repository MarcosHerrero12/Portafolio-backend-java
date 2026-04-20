# TechCommerce Platform

A professional, full-stack E-commerce platform built with Spring Boot 3.x, React, Vite, Tailwind CSS, and Docker.

## Prerequisites

- Java 21
- Node.js 18+ and npm
- Docker and Docker Compose
- Maven (or use the provided wrapper `./mvnw`)

## Infrastructure Setup

The project uses Docker Compose to set up PostgreSQL 15 and pgAdmin4.

```bash
docker-compose up -d
```

- **Database**: PostgreSQL 15 (Port: `5432`)
  - Username: `admin`
  - Password: `adminpassword`
  - Database: `commerce_db`
- **pgAdmin**: Web UI (Port: `5050`)
  - URL: `http://localhost:5050`
  - Email: `admin@admin.com`
  - Password: `adminpassword`

## Backend Setup (Spring Boot)

1. Run tests to ensure everything is working:
   ```bash
   ./mvnw test
   ```
2. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The API will be available at `http://localhost:8080`.
4. **Swagger UI / API Docs**: `http://localhost:8080/swagger-ui/index.html`

### Default Credentials (DatabaseSeeder)

On first run, the database is automatically populated with:
- **Admin**: `admin@commerce.com` / `admin123`
- **User**: `user@commerce.com` / `user123`
- Pre-populated products in "Electronics" and "Clothing" categories.

## Frontend Setup (React + Vite)

1. Open a terminal in the `../../frontend` directory.
2. Install dependencies (already done if you ran the initial setup script):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173`.

## Features
- **Clean Architecture Backend**: Layered separation with Controllers, Services, Repositories, DTOs, and Entities.
- **Robust Security**: JWT-based authentication (jjwt 0.12.5) with Role-Based Access Control (RBAC).
- **Transactional Consistency**: Order creation includes stock validation and deduction in a single transaction.
- **Global Error Handling**: Standardized API error responses using `@ControllerAdvice`.
- **Modern Frontend**: React Context API (Auth, Cart), Axios interceptors, responsive Tailwind CSS design.
- **Containerized DB**: Ready-to-use Docker environment with proper TimeZone (`UTC`) configurations to avoid JDBC driver issues.
