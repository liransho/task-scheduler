# Task Scheduling System

A full-stack scheduling system that allows users to create and manage scheduled executions of predefined tasks.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + styled-components
- **Backend**: Java 21 + Spring Boot 3.4 + Quartz Scheduler
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## Quick Start with Docker

```bash
cd docker
docker-compose up --build
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

**Default Credentials**: `admin` / `admin`

## Local Development

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 15+ (or use Docker for DB only)

### Database Setup

```bash
# Start PostgreSQL with Docker
docker run -d --name scheduler-db -e POSTGRES_DB=scheduler -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at http://localhost:8080

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

## API Documentation

Interactive API documentation is available via Swagger UI at `/swagger-ui.html` when the backend is running.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all predefined tasks |
| GET | `/api/schedules` | List all schedules |
| POST | `/api/schedules` | Create a new schedule |
| PUT | `/api/schedules/{id}` | Update a schedule |
| DELETE | `/api/schedules/{id}` | Delete a schedule |
| PATCH | `/api/schedules/{id}/toggle` | Enable/disable a schedule |

## Features

### Predefined Tasks
1. **Log Task** - Writes a message to the application log
2. **HTTP Request Task** - Makes HTTP requests to specified URLs
3. **Shell Command Task** - Logs shell commands (execution disabled for security)

### Schedule Types
- **One-time**: Execute at a specific date and time
- **Recurring**: Execute every X minutes/hours/days
- **Weekly**: Execute on specific days of the week at a set time
- **Cron**: Advanced scheduling with cron expressions

### Task Parameters
Each task can have configurable parameters with validation:
- Required/optional parameters
- Type-based validation (string, number, boolean)
- Default values

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│   PostgreSQL    │
│  (React/Vite)   │     │ (Spring Boot)   │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │     Quartz      │
                        │   Scheduler     │
                        │                 │
                        └─────────────────┘
```

## Technical Highlights

### Backend
- **Java 21** with modern features (records, pattern matching, virtual threads)
- **Spring Boot 3.4** with virtual threads enabled for better concurrency
- **MapStruct** for type-safe DTO mapping
- **OpenAPI/Swagger** for API documentation
- Clean architecture with separation of concerns

### Frontend
- **Custom React hooks** for state management (useSchedules, useTasks, useAlert)
- **Reusable component library** (Button, Modal, Badge, Alert, etc.)
- **TypeScript** for type safety
- **styled-components** for scoped CSS

## Design Decisions

1. **Virtual Threads (Java 21)**: Enabled for better handling of concurrent requests without thread pool tuning.

2. **Records for DTOs**: Immutable data transfer objects using Java records for cleaner, more maintainable code.

3. **MapStruct**: Compile-time DTO mapping instead of runtime reflection for better performance.

4. **Quartz Scheduler with In-Memory Store**: Chosen for simplicity. For production, consider JDBC JobStore for persistence across restarts.

5. **Custom React Hooks**: Encapsulated data fetching logic for cleaner components and easier testing.

6. **styled-components**: Component-scoped CSS with full CSS power and theme support.

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
task-scheduler/
├── frontend/               # React application
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   │   ├── common/    # Reusable UI components
│   │   │   └── schedule/  # Schedule-specific components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   └── package.json
├── backend/                # Spring Boot application
│   ├── src/main/java/
│   │   └── com/scheduler/
│   │       ├── config/    # Configuration
│   │       ├── controller/# REST controllers
│   │       ├── dto/       # Data transfer objects (records)
│   │       ├── entity/    # JPA entities
│   │       ├── job/       # Quartz jobs & tasks
│   │       ├── mapper/    # MapStruct mappers
│   │       ├── repository/# Data repositories
│   │       └── service/   # Business logic
│   └── pom.xml
├── docker/                 # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── nginx.conf
└── README.md
```

## License

MIT
