# Task Scheduling System

A full-stack scheduling system that allows users to create and manage scheduled executions of predefined tasks.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + styled-components
- **Backend**: Java 17 + Spring Boot 3.2 + Quartz Scheduler
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

**Default Credentials**: `admin` / `admin`

## Local Development

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+ (or use Docker for DB only)

### Database Setup

```bash
# Start PostgreSQL with Docker
docker run -d \
  --name scheduler-db \
  -e POSTGRES_DB=scheduler \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
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

## API Endpoints

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

## Design Decisions

1. **Quartz Scheduler with In-Memory Store**: Chosen for simplicity. For production, consider JDBC JobStore for persistence across restarts.

2. **Cron Expression Conversion**: All schedule types are internally converted to cron expressions for consistency in Quartz.

3. **Basic Authentication**: Simple Spring Security setup for demonstration. Production should use JWT or OAuth2.

4. **styled-components**: Component-scoped CSS with full CSS power and theme support.

5. **UUID for IDs**: Better for distributed systems and prevents sequential ID guessing.

6. **PostgreSQL**: Robust, production-ready database with excellent Spring Data JPA support.

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
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   └── package.json
├── backend/                # Spring Boot application
│   ├── src/main/java/
│   │   └── com/scheduler/
│   │       ├── config/    # Configuration
│   │       ├── controller/# REST controllers
│   │       ├── dto/       # Data transfer objects
│   │       ├── entity/    # JPA entities
│   │       ├── job/       # Quartz jobs & tasks
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

## AI Tools Disclosure

This project was developed with assistance from **Claude Code** (Anthropic's AI coding assistant). Claude Code was used for:
- Initial project scaffolding and structure
- Implementation of backend services and controllers
- Frontend component development
- Docker configuration
- Documentation

All code was reviewed and tested to ensure correctness and quality.

## License

MIT
