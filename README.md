# Injection Monitoring System Clone

A full-stack application for monitoring injection molding machines with real-time data tracking, analytics, and enterprise management.

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication
- Rate limiting and security middleware

### Frontend
- React 18 with TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query (React Query)
- Zustand for state management
- Recharts for data visualization

## Project Structure

```
injection-monitoring-clone/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/injection_monitoring"
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your API URL:
```
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### Enterprises
- `GET /api/v1/enterprises` - List all enterprises
- `GET /api/v1/enterprises/:id` - Get enterprise details
- `POST /api/v1/enterprises` - Create enterprise (admin only)
- `PUT /api/v1/enterprises/:id` - Update enterprise
- `DELETE /api/v1/enterprises/:id` - Delete enterprise

### Machines
- `GET /api/v1/machines` - List all machines
- `GET /api/v1/machines/:id` - Get machine details
- `POST /api/v1/machines` - Create machine
- `PUT /api/v1/machines/:id` - Update machine
- `DELETE /api/v1/machines/:id` - Delete machine
- `GET /api/v1/machines/:id/monitoring` - Get monitoring data

### Monitoring
- `GET /api/v1/monitoring/data` - Get monitoring data with filters
- `POST /api/v1/monitoring/data` - Submit monitoring data
- `GET /api/v1/monitoring/stats` - Get statistics

## Features

### Public Pages
- Landing page with feature overview
- User registration
- User login

### Protected Pages
- Dashboard with real-time statistics
- Enterprise management (CRUD operations)
- Machine management (CRUD operations)
- Monitoring data visualization with charts

### Key Features
- Real-time statistics cards
- Machine status overview
- Data filtering and search
- Interactive charts using Recharts
- Responsive design
- JWT-based authentication
- Role-based access control
- Rate limiting for API endpoints

## Database Schema

The application uses PostgreSQL with the following main entities:
- Users (with roles: ADMIN, USER)
- Enterprises (with machines)
- Machines (with monitoring data)
- MonitoringData (temperature, pressure, cycle time)

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Database Management
```bash
cd backend
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Generate Prisma client
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Access token expiration (15 minutes)
- Refresh token support (7 days)
- Rate limiting on auth endpoints
- CORS protection
- Helmet.js security headers
- Input validation with Zod

## Testing

The application includes:
- Backend API endpoints for all CRUD operations
- Frontend components with proper TypeScript typing
- Authentication context with automatic token refresh
- Error handling and loading states
- Responsive design with TailwindCSS

## Future Enhancements

- WebSocket support for real-time updates
- Export functionality for monitoring data
- Advanced filtering and search
- Email notifications for alerts
- User profile management
- Activity logging
- Performance optimization
- Unit and integration tests
- E2E testing with Playwright

## License

This project is for educational purposes.
