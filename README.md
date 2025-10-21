# BookStack - Full-Stack Book Catalog System

A complete book catalog management system using a .NET 9 GraphQL API backend and a modern React TypeScript frontend. Built for managing personal or organizational book collections with Google Books API integration for easy book discovery and import.

## 🌟 Features

### Backend (BookStack.Api)

- **GraphQL API** - Modern GraphQL server with HotChocolate
- **PostgreSQL Database** - Robust relational database with Entity Framework Core
- **Google Books Integration** - Search and import books from Google Books API
- **Entity Relationships** - Books, Authors, and Categories with many-to-many relationships
- **Data Operations** - Full CRUD operations with filtering, sorting, and projections
- **Type Safety** - Strongly typed GraphQL schema with automatic validation

### Frontend (bookstack-app)

- **Modern React Stack** - React 18 + TypeScript + Vite for fast development
- **Material Design UI** - Clean, responsive interface with Material-UI v5
- **GraphQL Integration** - Apollo Client for efficient data fetching and caching
- **Google Books Search** - Interactive search and import from Google Books
- **Batch Operations** - Select and import multiple books at once
- **Real-time Dashboard** - Live statistics and recent activity
- **Internationalization** - Multi-language support with react-i18next
- **Theme System** - Light/dark mode toggle with persistent preferences
- **Docker Ready** - Containerized for easy deployment

## 🏗️ Project Structure

```
BookCatalogApi/
├── BookStack.Api/                      # Backend API (.NET 9)
│   ├── Data/
│   │   └── BookStackContext.cs         # EF Core DbContext
│   ├── Models/
│   │   ├── Book.cs                     # Book entity with metadata
│   │   ├── Author.cs                   # Author entity
│   │   ├── Category.cs                 # Category entity
│   │   ├── BookAuthor.cs               # Many-to-many: Books ↔ Authors
│   │   └── BookCategory.cs             # Many-to-many: Books ↔ Categories
│   ├── Services/
│   │   └── GoogleBooksService.cs       # Google Books API integration
│   ├── GraphQL/
│   │   ├── Query.cs                    # Core GraphQL queries
│   │   ├── Mutation.cs                 # CRUD mutations + Google import
│   │   └── GoogleBooksQuery.cs         # Google Books search queries
│   ├── Migrations/                     # EF Core database migrations
│   └── Program.cs                      # Application configuration
├── bookstack-app/                      # Frontend React App
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   │   ├── common/                 # Layout, Navigation, Theme
│   │   │   ├── GoogleBookCard.tsx      # Google Books result cards
│   │   │   └── AddEditBookForm.tsx     # Book creation/editing forms
│   │   ├── pages/                      # Route-based page components
│   │   │   ├── DashboardPage.tsx       # Analytics and recent activity
│   │   │   ├── BooksPage.tsx           # Book catalog management
│   │   │   ├── AuthorsPage.tsx         # Author management
│   │   │   ├── CategoriesPage.tsx      # Category management
│   │   │   ├── GoogleBooksSearchPage.tsx # Google Books search & import
│   │   │   └── LoginPage.tsx           # Admin authentication
│   │   ├── graphql/                    # GraphQL queries and mutations
│   │   ├── contexts/                   # React contexts (Theme, etc.)
│   │   ├── hooks/                      # Custom React hooks
│   │   ├── types/                      # TypeScript type definitions
│   │   └── i18n/                       # Internationalization configs
│   ├── public/                         # Static assets
│   └── dist/                           # Production build output
├── docker-compose.yml                  # Multi-container orchestration
└── README.md                           # This documentation
```

## 🚀 Quick Start

### Local Development

#### Prerequisites

- .NET 9 SDK
- Node.js 18+
- PostgreSQL database server

#### Backend Setup

```bash
# Navigate to API directory
cd BookStack.Api/BookStack.Api

# Restore packages
dotnet restore

# Update connection string in appsettings.Development.json
# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
# API available at: https://localhost:5001
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd bookstack-app

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend available at: http://localhost:5173
```

## Prerequisites

- .NET 9 SDK
- PostgreSQL database server
- (Optional) Docker for running PostgreSQL

## Database Setup

### Option 1: Using Docker

```bash
docker run --name postgres-bookcatalog -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bookcatalog -p 5432:5432 -d postgres
```

### Option 2: Local PostgreSQL

Install PostgreSQL and create a database named `bookcatalog`.

## Configuration

Update the connection string in `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=bookcatalog;Username=postgres;Password=postgres"
  }
}
```

## Running the Application

1. **Restore packages:**

   ```bash
   dotnet restore
   ```

2. **Apply database migrations:**

   ```bash
   dotnet ef database update
   ```

3. **Run the application:**

   ```bash
   dotnet run
   ```

4. **Access Applications:**
   - **Frontend Application**: <http://localhost:3000> (Docker) or <http://localhost:5173> (Local)
   - **GraphQL Playground**: <https://localhost:5001/graphql>
   - **Login Credentials**: admin / password

## 📱 User Interface Features

### 🔐 Authentication

- Simple admin login system
- Persistent session management
- Theme toggle available on login page

### 📊 Dashboard

- **Real-time Statistics**: Live counts of books, authors, and categories
- **Recent Activity**: Last 5 books added with covers and metadata
- **Quick Actions**: Fast access to add books, import from Google Books, manage authors/categories
- **Visual Book Cards**: Clickable recent books with thumbnails and details

### 📚 Book Management

- **Comprehensive List View**: Sortable table with all book information
- **Advanced Search & Filtering**: Find books by title, author, category, or ISBN
- **Add/Edit Forms**: Rich forms with validation for manual book entry
- **Relationship Management**: Assign multiple authors and categories to books
- **Metadata Support**: ISBN, publication date, page count, cover images, descriptions

### 🔍 Google Books Integration

- **Dedicated Import Page**: `/import` route for book discovery
- **Real-time Search**: Debounced search with live results
- **Author Filtering**: Specialized filter for finding books by specific authors
- **Rich Book Previews**: Cards showing covers, descriptions, categories, and metadata
- **Batch Import**: Select multiple books and import them simultaneously
- **Duplicate Detection**: Automatic prevention of duplicate book imports
- **Import Status Tracking**: Visual feedback for import progress and completion

### 👥 Authors & Categories

- **CRUD Operations**: Create, view, edit, and delete authors and categories
- **Relationship Tracking**: See which books are associated with each author/category
- **Quick Management**: Inline editing and deletion with confirmation dialogs

### 🎨 User Experience

- **Material Design**: Clean, modern UI with consistent spacing and typography
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: System preference detection with manual toggle
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: Graceful error messages and retry functionality
- **Internationalization**: Multi-language support (English default)

## Database Schema

### Tables

- **Books** - Main book information
- **Authors** - Author information
- **Categories** - Book categories/genres
- **BookAuthors** - Many-to-many relationship between books and authors
- **BookCategories** - Many-to-many relationship between books and categories

### Relationships

- A Book can have multiple Authors (many-to-many)
- A Book can have multiple Categories (many-to-many)
- Books are indexed by GoogleBooksId for uniqueness

## Google Books API

The Google Books API integration allows you to:

- Search for books by query string
- Search for books by ISBN
- Get detailed book information by Google Books ID
- Import books directly into your catalog

No API key is required for basic usage, but rate limits apply.

## Entity Framework Commands

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations to database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script
```

## 🛠️ Technology Stack

### Backend (.NET 9)

- **ASP.NET Core 9** - Web API framework with minimal APIs
- **Entity Framework Core 9** - Object-relational mapping with Code First migrations
- **HotChocolate 15** - Modern GraphQL server with filtering, sorting, and projections
- **PostgreSQL** - Robust relational database with JSON support
- **Npgsql** - High-performance PostgreSQL provider for .NET
- **Google Books API** - External API integration for book data

### Frontend (React 18)

- **React 18** - Modern React with Concurrent Features
- **TypeScript 5** - Type-safe JavaScript development
- **Vite 6** - Lightning-fast build tool and dev server
- **Material-UI v5** - React components implementing Google's Material Design
- **Apollo Client v3** - Comprehensive GraphQL client with caching
- **React Router v6** - Declarative routing for React applications
- **React Hook Form** - Performant forms with minimal re-renders
- **React i18next** - Internationalization framework
- **Zod** - TypeScript-first schema validation

## 🚀 Deployment

### Environment Variables

#### Backend (.env or appsettings.json)

```bash
ConnectionStrings__DefaultConnection=Host=postgres;Database=bookstack;Username=postgres;Password=your_password
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80
```

#### Frontend (.env)

```bash
VITE_API_URL=https://your-api-domain.com
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your_secure_password
```

## 🔧 Development Workflow

### Code Quality

```bash
# Backend code formatting and analysis
dotnet format
dotnet build --configuration Release

# Frontend linting and type checking
npm run lint
npm run type-check
npm run build
```

### Testing

```bash
# Backend unit tests
dotnet test

# Frontend unit tests
npm run test

# E2E tests
npm run e2e
```

### Database Management

```bash
# Create migration
dotnet ef migrations add NewFeature -p BookStack.Api

# Update database
dotnet ef database update -p BookStack.Api

# Reset database (development only)
dotnet ef database drop -p BookStack.Api --force
dotnet ef database update -p BookStack.Api
```
