# Task Scheduling System

A full-stack scheduling system that allows users to create and manage scheduled executions of predefined tasks.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + styled-components + Framer Motion
- **Backend**: Java 21 + Spring Boot 3.4 + Quartz Scheduler + MapStruct
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

## Features

### Core Features

#### Scheduling Capabilities
- **One-time**: Execute at a specific date and time
- **Recurring**: Execute every X minutes/hours/days
- **Weekly**: Execute on specific days of the week at a set time
- **Cron**: Advanced scheduling with cron expressions

#### Predefined Tasks
1. **Log Task** - Writes a message to the application log
2. **HTTP Request Task** - Makes HTTP requests to specified URLs
3. **Shell Command Task** - Logs shell commands (execution disabled for security)

### Bonus Features (Implemented)

#### Parameter Schema per Task
Each task defines a parameter schema with:
- **Parameter name** - Unique identifier for the parameter
- **Type** - STRING, NUMBER, or BOOLEAN
- **Required flag** - Whether the parameter must be provided
- **Default value** - Optional default value
- **Description** - Help text for the user

#### Validation
- **Backend validation**: Required parameters are validated before schedule creation
- **Frontend validation**: Form validates required fields with error messages

## API Documentation

Interactive API documentation is available via Swagger UI at `/swagger-ui.html` when the backend is running.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all predefined tasks with parameter schemas |
| GET | `/api/schedules` | List all schedules |
| GET | `/api/schedules/{id}` | Get a specific schedule |
| POST | `/api/schedules` | Create a new schedule |
| PUT | `/api/schedules/{id}` | Update a schedule |
| DELETE | `/api/schedules/{id}` | Delete a schedule |
| PATCH | `/api/schedules/{id}/toggle` | Enable/disable a schedule |

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
- **MapStruct** for type-safe, compile-time DTO mapping
- **OpenAPI/Swagger** for interactive API documentation
- **Records for DTOs** - Immutable, clean data transfer objects
- Clean architecture with separation of concerns

### Frontend
- **Custom React hooks** for state management (useSchedules, useTasks, useAlert)
- **Reusable component library** (Button, Modal, Badge, Alert, Toggle, etc.)
- **Framer Motion** for smooth animations
- **React Icons** for consistent iconography
- **TypeScript** for type safety
- **styled-components** for scoped CSS with theming

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

### Test Coverage
```bash
# Backend
cd backend
./mvnw test jacoco:report

# Frontend
cd frontend
npm run test:coverage
```

### Test Structure

**Backend Tests:**
- `CronExpressionServiceTest` - Cron expression generation
- `ScheduleServiceTest` - Schedule CRUD operations
- `TaskServiceTest` - Task retrieval
- `QuartzServiceTest` - Job scheduling operations
- `ScheduleControllerTest` - API endpoint tests
- `TaskControllerTest` - Task API tests
- `GlobalExceptionHandlerTest` - Error handling
- `ScheduleControllerIntegrationTest` - End-to-end API tests

**Frontend Tests:**
- `useAlert.test.ts` - Alert hook functionality
- `Badge.test.tsx` - Badge component variants
- `Toggle.test.tsx` - Toggle component behavior
- `EmptyState.test.tsx` - Empty state rendering
- `ScheduleTypeSelector.test.tsx` - Schedule type selection
- `DaySelector.test.tsx` - Day selection for weekly schedules

## Design Decisions

1. **Virtual Threads (Java 21)**: Enabled for better handling of concurrent requests without thread pool tuning.

2. **Records for DTOs**: Immutable data transfer objects using Java records for cleaner, more maintainable code.

3. **MapStruct**: Compile-time DTO mapping instead of runtime reflection for better performance and type safety.

4. **Quartz Scheduler with In-Memory Store**: Chosen for simplicity. For production, consider JDBC JobStore for persistence across restarts.

5. **Custom React Hooks**: Encapsulated data fetching logic for cleaner components and easier testing.

6. **Parameter Schema Validation**: Both frontend and backend validate required parameters to ensure data integrity.

7. **styled-components + Framer Motion**: Component-scoped CSS with smooth animations for better UX.

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
│   │   ├── test/          # Test setup and utilities
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles and theme
│   ├── vitest.config.ts   # Test configuration
│   └── package.json
├── backend/                # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/scheduler/
│   │   │   ├── config/    # Configuration (Security, OpenAPI, etc.)
│   │   │   ├── controller/# REST controllers
│   │   │   ├── dto/       # Data transfer objects (records)
│   │   │   ├── entity/    # JPA entities
│   │   │   ├── job/       # Quartz jobs & executable tasks
│   │   │   ├── mapper/    # MapStruct mappers
│   │   │   ├── repository/# Data repositories
│   │   │   └── service/   # Business logic
│   │   └── test/java/     # Unit and integration tests
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
- Frontend component development with React hooks
- Upgrade to Java 21 with modern features (records, virtual threads)
- UI improvements with Framer Motion animations
- Test implementation for both backend and frontend
- Docker configuration
- Documentation

All code was reviewed and tested to ensure correctness and quality.

## Assumptions

1. **Authentication**: Basic authentication is used for simplicity. In production, JWT or OAuth2 would be preferred.
2. **Task Execution**: Shell command execution is logged but not actually executed for security reasons.
3. **Timezone**: All schedules use the server's timezone.
4. **Concurrency**: Quartz is configured with 5 threads for job execution.

## License

MIT
