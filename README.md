# 🎬 Cinema App - Full Stack Movie Platform

<div align="center">

![Cinema App](./frontend/src/img/initapp.png)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**A modern, full-stack movie catalog platform with real-time TMDB integration**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

Cinema App is a comprehensive full-stack movie platform built with modern technologies. It integrates with The Movie Database (TMDB) API to provide up-to-date movie information, ratings, trailers, and more. Users can browse movies, add them to favorites or watchlist, write reviews, and rate films.

The application features a sleek Netflix-inspired design with smooth animations, responsive layout, and an intuitive user experience.

---

## ✨ Features

### 🎬 Movie Management
- **Real-time TMDB Integration** - Fetch latest movies, ratings, posters, trailers, and cast information
- **Advanced Search & Filters** - Search by title, genre, year, rating, and more
- **Movie Details** - Comprehensive information including synopsis, cast, directors, runtime, and ratings
- **Trending & Popular** - Discover trending and highly-rated movies

### 👤 User Features
- **Authentication System** - Secure JWT-based authentication with refresh tokens
- **User Profiles** - Customizable user profiles with avatar support
- **Favorites & Watchlist** - Organize movies into personal collections
- **Reviews & Ratings** - Write reviews and rate movies (0-10 scale)
- **Responsive Design** - Fully responsive layout for desktop, tablet, and mobile

### 🔐 Admin Features
- **Admin Dashboard** - Comprehensive analytics and statistics
- **Movie Sync** - Manual TMDB synchronization
- **User Management** - View and manage user accounts
- **Sync Logs** - Monitor TMDB synchronization history

### 🎨 UI/UX
- **Netflix-Inspired Design** - Modern, dark theme with red accents
- **Smooth Animations** - Framer Motion for fluid transitions
- **Lazy Loading** - Optimized image loading for better performance
- **Skeleton Loaders** - Elegant loading states

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Framer Motion** - Animation library
- **React Lazy Load Image** - Image optimization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Relational database
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **Argon2** - Password hashing
- **Passport** - Authentication middleware
- **Swagger** - API documentation
- **Class Validator** - Request validation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pgAdmin** - PostgreSQL management
- **Git** - Version control

---

## 🏗 Architecture

### System Architecture

The Cinema App follows a modern full-stack architecture with clear separation between frontend, backend, and infrastructure layers:

![General Architecture Diagram](./frontend/src/img/DIAGRAMA%20DE%20ARQUITETURA%20GERAL.png)

### Project Structure

```
cinema-app/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── common/      # Reusable components
│   │   │   ├── home/        # Home page components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── movie/       # Movie components
│   │   │   └── auth/        # Auth components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript types
│   │   ├── lib/             # Utilities
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
│
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # Users module
│   │   ├── movies/          # Movies module
│   │   ├── genres/          # Genres module
│   │   ├── reviews/         # Reviews module
│   │   ├── favorites/       # Favorites module
│   │   ├── watchlist/       # Watchlist module
│   │   ├── tmdb/            # TMDB integration
│   │   ├── admin/           # Admin module
│   │   ├── upload/          # File upload
│   │   ├── common/          # Shared utilities
│   │   ├── prisma/          # Prisma service
│   │   └── seed/            # Database seeding
│   └── prisma/              # Prisma schema
│
└── docker-compose.yml        # Docker services
```

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **DTO Pattern** - Data transfer objects
- **Guard Pattern** - Route protection
- **Decorator Pattern** - Metadata and validation

### Frontend Component Architecture

The React frontend follows a modular component-based architecture with clear separation of concerns:

![React Components Diagram](./frontend/src/img/DIAGRAMA%20DE%20COMPONENTES%20REACT.png)

---

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **TMDB API Key** ([Get here](https://www.themoviedb.org/settings/api))

### Step 1: Clone Repository
```bash
git clone https://github.com/YuriTheCoder/cinema-app.git
cd cinema-app
```

### Step 2: Setup Backend
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your TMDB API key
# TMDB_API_KEY=your_api_key_here
```

### Step 3: Start Docker Services
```bash
# From project root
docker-compose up -d
```

This will start:
- PostgreSQL (port 5433)
- Redis (port 6380)
- pgAdmin (port 5050)

### Step 4: Database Migration & Seeding
```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev

# Seed database with TMDB movies
npm run seed:tmdb
```

### Step 5: Start Backend
```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:3000`

### Step 6: Setup & Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🚀 Usage

### Default Admin Account
```
Email: admin@cinema.com
Password: Admin@123
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5433/cinema_db?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

TMDB_API_KEY=your_tmdb_api_key
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

CORS_ORIGIN=http://localhost:5173

ADMIN_EMAIL=admin@cinema.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin User
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📸 Screenshots

### Home Page
![Home Page](./frontend/src/img/initapp.png)

### Movies Catalog
![Movies Screen](./frontend/src/img/moviesscreen.png)

### Watchlist
![Watchlist](./frontend/src/img/watchlistscreen.png)

### Like & Wishlist Features
![Card Features](./frontend/src/img/cardlikewishlist.png)

### Admin Dashboard
![Admin Dashboard](./frontend/src/img/admindashboard.png)

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Movies Endpoints

#### Get Movies
```http
GET /api/movies?page=1&limit=20&sort=popularity&genre=action
```

#### Get Movie by Slug
```http
GET /api/movies/:slug
```

#### Get Movie Statistics
```http
GET /api/movies/stats
```

### Reviews Endpoints

#### Create Review
```http
POST /api/movies/:movieId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 8,
  "title": "Great movie!",
  "body": "I really enjoyed this film..."
}
```

### Full API Documentation
Once the backend is running, visit:
- **Swagger UI**: `http://localhost:3000/api/docs`

---

## 🗄 Database Schema

### Entity-Relationship Diagram

The database schema is designed to support efficient querying and maintain data integrity:

![Entity-Relationship Diagram](./frontend/src/img/ENTITY-RELATIONSHIP%20DIAGRAM.png)

### Database Entities

#### User
- id (CUID)
- email (unique)
- passwordHash
- name
- role (USER | ADMIN)
- avatarUrl (optional)
- bio (optional)
- timestamps

#### Movie
- id (CUID)
- tmdbId (unique)
- title
- slug (unique)
- synopsis
- year
- runtime
- country
- originalLanguage
- directors (array)
- cast (array)
- posterUrl
- backdropUrl
- trailerUrl
- parentalRating
- popularity
- avgRating
- ratingsCount
- genres (many-to-many)
- timestamps

#### Genre
- id (CUID)
- tmdbId (unique)
- name (unique)
- slug (unique)
- timestamps

#### Review
- id (CUID)
- movieId (FK)
- userId (FK)
- rating (0-10)
- title (optional)
- body (optional)
- timestamps

#### Favorite
- id (CUID)
- movieId (FK)
- userId (FK)
- timestamp

#### Watchlist
- id (CUID)
- movieId (FK)
- userId (FK)
- timestamp

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Contact

**Yuri Borges** - Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YuriTheCoder)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yuri-borges-0b59b2305)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Yuri Borges](https://github.com/YuriTheCoder)

</div>
