# BookStack - Docker Deployment Guide

Complete containerization guide for the BookStack application with database, API, and React frontend.

## 🚀 Quick Start (Production)

### 1. Full Stack Deployment

```bash
# Clone and start everything
git clone <repository-url>
cd BookCatalogApi
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:5097
# GraphQL: http://localhost:5097/graphql
```

### 2. Verify Services

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs api
docker-compose logs frontend
```

## 🏗️ Architecture Overview

The Docker setup includes three main services:

### **PostgreSQL Database**

- **Image**: `postgres:16-alpine`
- **Port**: `5432`
- **Volume**: Persistent data storage
- **Environment**: Configured for BookStack schema

### **.NET API Backend**

- **Build**: Multi-stage Dockerfile for optimization
- **Port**: `5097`
- **Dependencies**: PostgreSQL, Entity Framework migrations
- **Features**: GraphQL endpoint, Google Books integration

### **React Frontend**

- **Build**: Vite production build with Nginx
- **Port**: `3000` (production) / `5173` (development)
- **Features**: Material-UI, Apollo Client, responsive design
- **Proxy**: API requests proxied to backend

## 🐳 Docker Compose Configurations

### Production (docker-compose.yml)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: bookstack-db
    environment:
      POSTGRES_DB: bookcatalog
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - bookstack-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d bookcatalog"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bookstack-api
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:5097
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=bookcatalog;Username=postgres;Password=postgres
    ports:
      - "5097:5097"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - bookstack-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5097/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./bookstack-app
      dockerfile: Dockerfile
    container_name: bookstack-frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5097
    depends_on:
      - api
    networks:
      - bookstack-network

volumes:
  postgres_data:

networks:
  bookstack-network:
    driver: bridge
```

### Development (docker-compose.dev.yml)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: bookstack-db-dev
    environment:
      POSTGRES_DB: bookcatalog
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - bookstack-dev

  # API runs locally with dotnet run for hot reload
  # Frontend runs locally with npm run dev for hot reload

volumes:
  postgres_dev_data:

networks:
  bookstack-dev:
    driver: bridge
```

## 🔧 Docker Commands

### Development Workflow

```bash
# Start development database only
docker-compose -f docker-compose.dev.yml up -d

# Full production stack
docker-compose up -d

# Build and start with rebuild
docker-compose up --build -d

# View logs
docker-compose logs -f api
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v
```

### Individual Service Management

```bash
# Start only database
docker-compose up -d postgres

# Restart API service
docker-compose restart api

# Rebuild specific service
docker-compose build frontend
docker-compose up -d frontend

# Execute commands in containers
docker-compose exec postgres psql -U postgres -d bookcatalog
docker-compose exec api dotnet ef migrations list
```

## 🏗️ Dockerfile Details

### API Backend (Dockerfile)

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["BookCatalogApi.csproj", "."]
RUN dotnet restore "BookCatalogApi.csproj"
COPY . .
RUN dotnet build "BookCatalogApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "BookCatalogApi.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 5097
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BookCatalogApi.dll"]
```

### Frontend (bookstack-app/Dockerfile)

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ Environment Configuration

### API Environment Variables

```env
# Database
ConnectionStrings__DefaultConnection=Host=postgres;Database=bookcatalog;Username=postgres;Password=postgres

# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:5097

# Google Books (optional)
GoogleBooksApiKey=your_api_key_here

# Logging
Logging__LogLevel__Default=Information
Logging__LogLevel__Microsoft.AspNetCore=Warning
```

### Frontend Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5097
REACT_APP_GRAPHQL_URL=http://localhost:5097/graphql

# Build Configuration
GENERATE_SOURCEMAP=false
BUILD_PATH=dist
```

## 🔄 Health Checks & Monitoring

### Health Endpoints

- **API Health**: `http://localhost:5097/health`
- **Database**: Automatic PostgreSQL health checks
- **Frontend**: Nginx status on successful load

### Monitoring Commands

```bash
# Check service health
docker-compose ps

# Monitor resource usage
docker stats

# Check container logs
docker-compose logs --tail=100 -f

# Database connection test
docker-compose exec postgres pg_isready -U postgres
```

## 🧹 Cleanup & Maintenance

```bash
# Remove unused Docker resources
docker system prune -a

# Backup database
docker-compose exec postgres pg_dump -U postgres bookcatalog > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres bookcatalog < backup.sql

# Update container images
docker-compose pull
docker-compose up -d
```

---

For more deployment options and troubleshooting, see the [QUICKSTART.md](QUICKSTART.md) guide.

```bash
# Run PostgreSQL
docker run --name postgres-bookcatalog \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bookcatalog \
  -p 5432:5432 \
  -d postgres:16

# Stop and remove container
docker stop postgres-bookcatalog
docker rm postgres-bookcatalog
```
