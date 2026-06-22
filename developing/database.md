# 데이터베이스 설정 정보

## 데이터베이스 이름
**injection_monitoring**

## 정의 파일
데이터베이스 연결 정보는 다음 파일에서 정의됩니다:

- **backend/.env** (실제 환경 변수 파일)
- **backend/.env.example** (예시 파일)

## DATABASE_URL 형식
```
DATABASE_URL="postgresql://user:password@localhost:5432/injection_monitoring"
```

### URL 구조
- **프로토콜**: postgresql://
- **사용자**: user
- **비밀번호**: password
- **호스트**: localhost
- **포트**: 5432
- **데이터베이스 이름**: injection_monitoring

## 환경 변수 예시 (.env.example)
```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/injection_monitoring"
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Prisma 설정
데이터베이스 연결은 Prisma ORM을 통해 관리됩니다:

- **Schema 파일**: `backend/prisma/schema.prisma`
- **Config 파일**: `backend/prisma.config.ts` (Prisma 7.8.0)
- **Database Config**: `backend/src/config/database.ts`

### Prisma 7.8.0 설정
```typescript
// prisma.config.ts
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

### Database Connection
```typescript
// src/config/database.ts
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

## 데이터 모델
Prisma schema에 정의된 모델들:

- **User**: 사용자 정보
- **Enterprise**: 기업 정보
- **Machine**: 기계 정보
- **MonitoringData**: 모니터링 데이터
