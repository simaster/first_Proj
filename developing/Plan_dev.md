# Development Plan: Injection Monitoring System Clone

## Project Overview
**Objective**: Create a replica of the injection monitoring website (https://smi.seoro.ai.kr/enterprise) with similar design and functionality.

**Tech Stack**:
- **Frontend**: React 18, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **API**: RESTful API with OpenAPI/Swagger documentation
- **State Management**: React Context API / Zustand
- **Build Tool**: Vite

## Phase 1: Project Setup & Architecture

### 1.1 Project Structure
```
injection-monitoring-clone/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── config/         # Configuration files
│   ├── prisma/             # Database schema
│   └── package.json
├── shared/                 # Shared types and utilities
└── docs/                   # Documentation
```

### 1.2 Development Environment Setup
1. Install Node.js (v18+)
2. Install PostgreSQL database
3. Set up environment variables (.env files)
4. Configure ESLint and Prettier
5. Set up Git repository with proper .gitignore

## Phase 2: Database Design

### 2.1 Database Schema
```prisma
// Key entities based on injection monitoring system
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Enterprise {
  id          String   @id @default(uuid())
  name        String
  code        String   @unique
  address     String?
  contact     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  machines    Machine[]
}

model Machine {
  id           String   @id @default(uuid())
  name         String
  code         String   @unique
  enterpriseId String
  enterprise   Enterprise @relation(fields: [enterpriseId], references: [id])
  status       MachineStatus @default(OFFLINE)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  monitoringData MonitoringData[]
}

model MonitoringData {
  id          String   @id @default(uuid())
  machineId   String
  machine     Machine  @relation(fields: [machineId], references: [id])
  temperature Float
  pressure    Float
  cycleTime   Int
  timestamp   DateTime @default(now())
}

enum UserRole {
  ADMIN
  USER
}

enum MachineStatus {
  ONLINE
  OFFLINE
  MAINTENANCE
}
```

### 2.2 Database Migration Strategy
- Use Prisma migrations for version control
- Seed initial data for development
- Set up database backup strategy

## Phase 3: Backend Development

### 3.1 API Architecture
**Base URL**: `/api/v1`

**Authentication Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

**Enterprise Endpoints**:
- `GET /enterprises` - List all enterprises
- `GET /enterprises/:id` - Get enterprise details
- `POST /enterprises` - Create enterprise (admin only)
- `PUT /enterprises/:id` - Update enterprise
- `DELETE /enterprises/:id` - Delete enterprise

**Machine Endpoints**:
- `GET /machines` - List all machines
- `GET /machines/:id` - Get machine details
- `POST /machines` - Create machine
- `PUT /machines/:id` - Update machine
- `DELETE /machines/:id` - Delete machine
- `GET /machines/:id/monitoring` - Get monitoring data

**Monitoring Endpoints**:
- `GET /monitoring/data` - Get monitoring data with filters
- `POST /monitoring/data` - Submit monitoring data
- `GET /monitoring/stats` - Get statistics

### 3.2 Authentication Implementation
- JWT-based authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Password hashing with bcrypt
- Role-based access control (RBAC)

### 3.3 Middleware
- Authentication middleware
- Authorization middleware
- Error handling middleware
- Request validation middleware
- Rate limiting middleware
- CORS configuration

### 3.4 API Documentation
- Swagger/OpenAPI documentation
- Auto-generate from TypeScript types
- Include request/response examples

## Phase 4: Frontend Development

### 4.1 UI Components (shadcn/ui)
- **Layout Components**: Header, Sidebar, Footer, Layout
- **Form Components**: Input, Select, Button, Form
- **Data Display**: Table, Card, Badge, Progress
- **Feedback**: Toast, Modal, Alert
- **Navigation**: Menu, Breadcrumb, Tabs

### 4.2 Page Structure
**Public Pages**:
- Landing page
- Login page
- Registration page

**Protected Pages**:
- Dashboard (overview)
- Enterprise management
- Machine management
- Monitoring data view
- Analytics/Reports
- Settings

### 4.3 Design System
**Color Palette** (based on original site):
- Primary: Blue tones
- Secondary: Gray tones
- Success: Green
- Warning: Yellow/Orange
- Error: Red

**Typography**:
- Font: Inter or system fonts
- Material Symbols Outlined for icons

**Responsive Design**:
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px

### 4.4 State Management
- React Context for global state (auth, theme)
- Zustand for complex state (data fetching, filters)
- React Query for server state management

### 4.5 API Integration
- Axios for HTTP requests
- Request/response interceptors
- Automatic token refresh
- Error handling

## Phase 5: Key Features Implementation

### 5.1 Dashboard
- Real-time statistics cards
- Machine status overview
- Recent monitoring data
- Quick actions
- Charts and graphs (using Recharts or Chart.js)

### 5.2 Enterprise Management
- CRUD operations for enterprises
- Search and filter
- Pagination
- Export functionality

### 5.3 Machine Management
- Machine registration
- Status monitoring
- Configuration management
- Maintenance scheduling

### 5.4 Monitoring System
- Real-time data display
- Historical data view
- Data filtering and search
- Export to CSV/Excel
- Alert system for anomalies

### 5.5 Analytics
- Trend analysis
- Performance metrics
- Custom reports
- Data visualization

## Phase 6: Testing

### 6.1 Backend Testing
- Unit tests (Jest)
- Integration tests (Supertest)
- API endpoint testing
- Database testing

### 6.2 Frontend Testing
- Unit tests (Vitest)
- Component tests (React Testing Library)
- E2E tests (Playwright)
- Accessibility tests

### 6.3 Test Coverage
- Target: 80% code coverage
- Critical paths: 100% coverage

## Phase 7: Deployment

### 7.1 Development Environment
- Docker Compose for local development
- Hot reload for both frontend and backend
- Database seeding

### 7.2 Production Deployment
**Frontend**:
- Build optimization
- CDN deployment (Vercel/Netlify)
- Environment variable management

**Backend**:
- Containerization (Docker)
- Cloud deployment (AWS/GCP/Azure)
- Load balancing
- SSL/TLS configuration

**Database**:
- Managed PostgreSQL service
- Backup strategy
- Replication for high availability

### 7.3 CI/CD Pipeline
- GitHub Actions or GitLab CI
- Automated testing
- Automated deployment
- Rollback strategy

## Phase 8: Security & Performance

### 8.1 Security Measures
- HTTPS enforcement
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Security headers
- Regular dependency updates

### 8.2 Performance Optimization
- Frontend:
  - Code splitting
  - Lazy loading
  - Image optimization
  - Caching strategy
  - Bundle size optimization

- Backend:
  - Database indexing
  - Query optimization
  - Response caching
  - Connection pooling
  - Compression

## Phase 9: Monitoring & Maintenance

### 9.1 Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Log aggregation

### 9.2 Maintenance
- Regular updates
- Database maintenance
- Security patches
- Performance tuning

## Development Timeline

**Week 1-2**: Project setup, database design, authentication
**Week 3-4**: Backend API development
**Week 5-6**: Frontend UI components and pages
**Week 7-8**: Feature implementation and integration
**Week 9**: Testing and bug fixes
**Week 10**: Deployment and optimization

## Success Criteria

- [ ] Functional replica of original website
- [ ] Responsive design (mobile-friendly)
- [ ] Secure authentication system
- [ ] Real-time monitoring capabilities
- [ ] Data export functionality
- [ ] Performance: < 2s initial load
- [ ] 80% test coverage
- [ ] Production-ready deployment

## Notes

- The original site appears to be a React application with Material Symbols
- Focus on Korean language support (i18n)
- Implement proper error handling
- Follow accessibility guidelines (WCAG 2.1)
- Maintain code quality with ESLint/Prettier
