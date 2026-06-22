# Prisma 아키텍처 및 데이터 흐름 상세 분석

## 개요
이 문서는 Prisma ORM이 백엔드, 프론트엔드, 데이터베이스와 어떻게 상호작용하는지 블록 다이어그램과 함께 상세히 설명합니다.

---

## 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              프론트엔드 (Frontend)                            │
│                         React Application                                    │
│                         (localhost:3000)                                    │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      │ HTTP/HTTPS Requests
                                      │ (REST API)
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                              백엔드 (Backend)                                 │
│                         Express.js Server                                    │
│                         (localhost:5000)                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         API Layer                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │ Auth Routes  │  │ Enterprise   │  │ Machine      │              │  │
│  │  │              │  │ Routes       │  │ Routes       │              │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│  │  ┌──────────────┐  ┌──────────────┐                                   │  │
│  │  │ Monitoring   │  │ Error        │                                   │  │
│  │  │ Routes       │  │ Handler      │                                   │  │
│  │  └──────────────┘  └──────────────┘                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                        │                                      │
│  ┌─────────────────────────────────────▼───────────────────────────────────┐  │
│  │                         Service Layer                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │ Auth Service │  │ Enterprise   │  │ Machine      │              │  │
│  │  │              │  │ Service      │  │ Service      │              │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                        │                                      │
│  ┌─────────────────────────────────────▼───────────────────────────────────┐  │
│  │                      Prisma ORM Layer (Prisma 7.8.0)                    │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │  │                     Prisma Client                                │   │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  Type-safe Query Builder                                 │ │   │  │
│  │  │  │  - findUnique(), findMany(), create(), update(), delete() │ │   │  │
│  │  │  └───────────────────────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────────────────────┘   │  │
│  │                                        │                                  │  │
│  │  ┌─────────────────────────────────────▼─────────────────────────────┐   │  │
│  │  │                   PrismaPg Adapter (Driver Adapter)               │   │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐ │   │  │
│  │  │  │  PostgreSQL Driver Adapter                                 │ │   │  │
│  │  │  │  - Connection pooling                                      │ │   │  │
│  │  │  │  - Query translation                                      │ │   │  │
│  │  │  │  - Type conversion                                         │ │   │  │
│  │  │  └───────────────────────────────────────────────────────────┘ │   │  │
│  │  └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      │ PostgreSQL Protocol
                                      │ (TCP/IP)
                                      │
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                         PostgreSQL Database                                 │
│                         (localhost:5432)                                    │
│                         Database: injection_monitoring                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Tables                                          │  │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────┐       │  │
│  │  │   User   │  │ Enterprise │  │ Machine  │  │ Monitoring   │       │  │
│  │  │          │  │            │  │          │  │ Data         │       │  │
│  │  └──────────┘  └────────────┘  └──────────┘  └──────────────┘       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 상세 데이터 흐름

### 1. 사용자 인증 요청 흐름

```
Frontend (React)
    │
    │ POST /api/v1/auth/login
    │ { email, password }
    │
    ▼
Backend (Express)
    │
    │ authRoutes.post('/login', login)
    │
    ▼
AuthController.login()
    │
    │ AuthService.login(email, password)
    │
    ▼
AuthService.login()
    │
    │ prisma.user.findUnique({ where: { email } })
    │
    ▼
Prisma Client
    │
    │ Type-safe query validation
    │
    ▼
PrismaPg Adapter
    │
    │ Convert Prisma query to SQL
    │ SELECT * FROM "User" WHERE email = $1
    │
    ▼
PostgreSQL Database
    │
    │ Execute query
    │ Return user data
    │
    ▼
PrismaPg Adapter
    │
    │ Convert SQL result to TypeScript objects
    │
    ▼
Prisma Client
    │
    │ Return typed User object
    │
    ▼
AuthService.login()
    │
    │ Verify password with bcrypt
    │ Generate JWT tokens
    │
    ▼
AuthController.login()
    │
    │ Return { accessToken, refreshToken }
    │
    ▼
Frontend (React)
    │
    │ Store tokens
    │ Redirect to dashboard
```

### 2. 모니터링 데이터 조회 흐름

```
Frontend (React)
    │
    │ GET /api/v1/monitoring/:machineId
    │ Headers: Authorization: Bearer <token>
    │
    ▼
Backend (Express)
    │
    │ authenticate middleware
    │
    ▼
Auth Middleware
    │
    │ Verify JWT token
    │ Extract userId, userRole
    │
    ▼
Monitoring Routes
    │
    │ monitoringRoutes.get('/:machineId', getMonitoringData)
    │
    ▼
MonitoringController.getMonitoringData()
    │
    │ MonitoringService.getMonitoringData(machineId)
    │
    ▼
MonitoringService.getMonitoringData()
    │
    │ prisma.monitoringData.findMany({
    │   where: { machineId },
    │   orderBy: { timestamp: 'desc' },
    │   take: 100
    │ })
    │
    ▼
Prisma Client
    │
    │ Build query with type safety
    │
    ▼
PrismaPg Adapter
    │
    │ Convert to SQL:
    │ SELECT * FROM "MonitoringData"
    │ WHERE "machineId" = $1
    │ ORDER BY "timestamp" DESC
    │ LIMIT 100
    │
    ▼
PostgreSQL Database
    │
    │ Execute query
    │ Return monitoring data
    │
    ▼
PrismaPg Adapter
    │
    │ Convert to TypeScript objects
    │
    ▼
Prisma Client
    │
    │ Return typed MonitoringData[]
    │
    ▼
MonitoringService.getMonitoringData()
    │
    │ Process data if needed
    │
    ▼
MonitoringController.getMonitoringData()
    │
    │ Return JSON response
    │
    ▼
Frontend (React)
    │
    │ Display monitoring data
    │ Update charts/graphs
```

---

## Prisma 7.8.0 아키텍처 상세

### Prisma Client 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Code                            │
│                  (src/services/*.ts)                            │
│  const user = await prisma.user.findUnique({                   │
│    where: { email: 'user@example.com' }                        │
│  })                                                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ Prisma Client API
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                   Prisma Client (@prisma/client)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Type-safe Query Builder                       │  │
│  │  - Auto-completion                                        │  │
│  │  - Type inference                                         │  │
│  │  - Runtime validation                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Query Interpreter                            │  │
│  │  - Parse Prisma queries                                  │  │
│  │  - Validate against schema                               │  │
│  │  - Build execution plan                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ Adapter Interface
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│              PrismaPg Adapter (@prisma/adapter-pg)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Connection Pool                              │  │
│  │  - Manage PostgreSQL connections                          │  │
│  │  - Connection reuse                                       │  │
│  │  - Automatic connection management                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Query Translator                             │  │
│  │  - Convert Prisma queries to SQL                         │  │
│  │  - Handle parameter binding                              │  │
│  │  - SQL injection prevention                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Result Mapper                                │  │
│  │  - Convert SQL results to TypeScript objects             │  │
│  │  - Type conversion                                        │  │
│  │  - Relation loading                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ PostgreSQL Protocol
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    PostgreSQL Server                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Query Executor                                │  │
│  │  - Parse SQL                                             │  │
│  │  - Execute query                                          │  │
│  │  - Return results                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Prisma 설정 파일 구조

```
backend/
├── prisma/
│   ├── schema.prisma           # 데이터 모델 정의
│   ├── migrations/             # 데이터베이스 마이그레이션
│   └── seed.ts                 # 초기 데이터 시딩
├── prisma.config.ts            # Prisma CLI 설정 (Prisma 7)
├── src/
│   └── config/
│       └── database.ts         # Prisma Client 인스턴스
└── .env                        # 환경 변수 (DATABASE_URL)
```

---

## Prisma 설정 상세

### 1. schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**역할:**
- 데이터 모델 정의
- 타입 안전성 제공
- Prisma Client 생성 기반

### 2. prisma.config.ts (Prisma 7)

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

**역할:**
- Prisma CLI 설정
- 데이터베이스 연결 정보 관리
- 마이그레이션 및 시드 스크립트 경로 설정

### 3. database.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  adapter,
});
```

**역할:**
- Prisma Client 인스턴스 생성
- Driver Adapter 설정
- 로깅 설정

---

## 데이터베이스 연결 풀링

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Requests                          │
│  Request 1  │  Request 2  │  Request 3  │  Request 4            │
└─────────────┴─────────────┴─────────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PrismaPg Adapter                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Connection Pool                              │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │  │
│  │  │ Conn│ │ Conn│ │ Conn│ │ Conn│ │ Conn│  (Max 10)     │  │
│  │  │  1  │ │  2  │ │  3  │ │  4  │ │  5  │              │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘              │  │
│  │                                                           │  │
│  │  - Reuse connections                                      │  │
│  │  - Automatic scaling                                      │  │
│  │  - Connection lifecycle management                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Server                             │
│  - Handles concurrent connections                               │
│  - Query execution                                             │
│  - Transaction management                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 쿼리 실행 과정 상세

### 1. Prisma 쿼리 작성

```typescript
// Application Code
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  include: { enterprise: true },
  orderBy: { createdAt: 'desc' }
});
```

### 2. Prisma Client 처리

```
1. Type Validation
   - Check if 'role' field exists in User model
   - Validate 'ADMIN' is valid UserRole enum value
   - Check if 'enterprise' relation exists

2. Query Building
   - Build abstract syntax tree (AST)
   - Plan query execution
   - Optimize for relations

3. Adapter Call
   - Pass query to PrismaPg adapter
   - Include type information
```

### 3. PrismaPg Adapter 변환

```sql
-- Generated SQL
SELECT 
  "User".id,
  "User".email,
  "User".password,
  "User".name,
  "User".role,
  "User"."createdAt",
  "User"."updatedAt",
  "Enterprise".id AS "Enterprise_id",
  "Enterprise".name AS "Enterprise_name",
  "Enterprise".code AS "Enterprise_code",
  "Enterprise".address AS "Enterprise_address",
  "Enterprise".contact AS "Enterprise_contact",
  "Enterprise"."createdAt" AS "Enterprise_createdAt",
  "Enterprise"."updatedAt" AS "Enterprise_updatedAt"
FROM "User"
LEFT JOIN "Enterprise" ON "User"."enterpriseId" = "Enterprise".id
WHERE "User".role = $1
ORDER BY "User"."createdAt" DESC
```

### 4. PostgreSQL 실행

```
1. Query Parsing
   - Parse SQL syntax
   - Validate table/column names

2. Query Planning
   - Choose execution plan
   - Use indexes if available

3. Query Execution
   - Execute query
   - Return result set

4. Result Return
   - Send results back to adapter
```

### 5. 결과 매핑

```typescript
// Mapped TypeScript objects
[
  {
    id: "uuid-1",
    email: "admin@example.com",
    password: "hashed_password",
    name: "Admin User",
    role: "ADMIN",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    enterprise: {
      id: "enterprise-uuid",
      name: "Enterprise Name",
      code: "ENT001",
      address: "123 Street",
      contact: "contact@email.com",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  }
]
```

---

## 트랜잭션 처리

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Code                               │
│  await prisma.$transaction(async (tx) => {                       │
│    const user = await tx.user.create({ ... });                   │
│    const enterprise = await tx.enterprise.create({ ... });        │
│    await tx.machine.create({ ... });                              │
│  })                                                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Prisma Client                                  │
│  - Create transaction context                                    │
│  - Pass same adapter to all operations                          │
│  - Ensure atomicity                                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL                                     │
│  - BEGIN TRANSACTION                                             │
│  - Execute operations                                            │
│  - COMMIT or ROLLBACK                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 실시간 데이터 모니터링 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                    IoT Device (Machine)                          │
│  - Temperature sensor                                            │
│  - Pressure sensor                                               │
│  - Cycle time counter                                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ HTTP POST /api/v1/monitoring
                                 │ { machineId, temperature, pressure, cycleTime }
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                    Backend API                                    │
│  - Authenticate request                                          │
│  - Validate data                                                 │
│  - Call MonitoringService.createMonitoringData()                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Prisma Client                                 │
│  prisma.monitoringData.create({                                  │
│    data: {                                                       │
│      machineId,                                                  │
│      temperature,                                                │
│      pressure,                                                   │
│      cycleTime,                                                  │
│      timestamp: new Date()                                       │
│    }                                                             │
│  })                                                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL                                    │
│  INSERT INTO "MonitoringData" (...) VALUES (...)                │
│  - Store monitoring data                                         │
│  - Index on machineId and timestamp                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Real-time)                          │
│  - Polling or WebSocket                                          │
│  - GET /api/v1/monitoring/:machineId                             │
│  - Update charts in real-time                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 성능 최적화 전략

### 1. 인덱싱

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique  // 자동 인덱스 생성
  // ...
}

@@index([email])  // 추가 인덱스
```

### 2. 쿼리 최적화

```typescript
// Bad: N+1 query problem
const enterprises = await prisma.enterprise.findMany();
for (const enterprise of enterprises) {
  const machines = await prisma.machine.findMany({
    where: { enterpriseId: enterprise.id }
  });
}

// Good: Include relations
const enterprises = await prisma.enterprise.findMany({
  include: { machines: true }
});
```

### 3. 연결 풀링

```typescript
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // 자동 연결 풀링 (기본 최대 10개 연결)
});
```

---

## 보안 고려사항

### 1. SQL 인젝션 방지
- Prisma는 파라미터화된 쿼리를 자동으로 생성
- 사용자 입력이 안전하게 처리됨

### 2. 환경 변수 보호
- `.env` 파일은 `.gitignore`에 포함
- `.env.example`만 커밋

### 3. 연결 암호화
- PostgreSQL SSL/TLS 지원
- DATABASE_URL에 `sslmode=require` 추가 가능

---

## 요약

Prisma는 백엔드와 데이터베이스 사이에서 다음 역할을 수행합니다:

1. **타입 안전성**: TypeScript 타입을 통해 컴파일 시간에 오류 방지
2. **쿼리 빌더**: 직관적인 API로 복잡한 SQL 쿼리 작성
3. **드라이버 추상화**: PrismaPg Adapter를 통해 PostgreSQL과 통신
4. **마이그레이션 관리**: 스키마 변경을 버전 관리
5. **성능 최적화**: 연결 풀링, 쿼리 최적화, 인덱싱 지원

이 아키텍처를 통해 안전하고 효율적인 데이터베이스 운영이 가능합니다.
