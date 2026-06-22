# Prisma 7.8.0 업그레이드 에러 해결 보고서

## 개요
Prisma 5.20.0에서 7.8.0으로 업그레이드 과정에서 발생한 에러와 해결 방법을 문서화합니다.

## 발생한 에러

### 에러 1: SASL 인증 에러

**에러 메시지:**
```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

**발생 위치:**
- `node_modules/pg-pool/index.js:45`
- PrismaPgAdapter.performIO

**원인:**
- `database.ts` 모듈이 `dotenv.config()` 호출보다 먼저 임포트되어 환경 변수가 로드되지 않음
- `process.env.DATABASE_URL`이 `undefined`로 설정되어 비밀번호가 문자열이 아님

**해결 방법:**

**변경 전 (`src/index.ts`):**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database';
// ... other imports

dotenv.config();
```

**변경 후 (`src/index.ts`):**
```typescript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase, disconnectDatabase } from './config/database';
// ... other imports
```

**설명:**
- `import 'dotenv/config'`를 파일 맨 위로 이동하여 다른 모듈 임포트 전에 환경 변수가 로드되도록 수정
- 사이드 이펙트 임포트를 사용하여 dotenv가 모듈 로드 시 즉시 실행됨

---

### 에러 2: 데이터베이스 스키마 불일치

**에러 메시지:**
```
PrismaClientKnownRequestError: 
Invalid `prisma.user.findUnique()` invocation
The column `User.createdAt` does not exist in the current database.
```

**발생 위치:**
- `src/services/authService.ts:24:44`
- PrismaClientKnownRequestError

**원인:**
- 데이터베이스가 수동으로 `setup.sql`을 통해 생성되어 Prisma 스키마와 불일치
- Prisma 마이그레이션 히스토리와 실제 데이터베이스 스키마 간 드리프트 발생
- 수동 생성된 테이블에 `createdAt`, `updatedAt` 등의 컬럼이 누락됨

**해결 방법:**

**단계 1: 데이터베이스 마이그레이션 재설정**
```bash
npx prisma migrate reset --force
```

**결과:**
```
Database reset successful
Applying migration `20260622053236_init`
1 migration(s) have been applied:
  └─ 20260622053236_init/
    └─ migration.sql
```

**단계 2: 데이터베이스 시딩**
```bash
npm run seed
```

**결과:**
```
Starting database seeding...
Created user: { id: '...', email: 'si', ... }
Created enterprise: { id: '...', name: 'Sample Enterprise', ... }
Created machine: { id: '...', name: 'Sample Machine 1', ... }
Created monitoring data: { id: '...', temperature: 185.5, ... }
Created 20 sample monitoring data points
Database seeding completed successfully!
```

**설명:**
- `prisma migrate reset`으로 기존 스키마를 삭제하고 Prisma 마이그레이션을 재적용
- 기존 수동 생성된 테이블을 Prisma 스키마에 맞게 재생성
- 시드 스크립트를 실행하여 초기 데이터 생성

---

## 해결 후 검증

### 서버 실행 테스트
```bash
npm run dev
```

**결과:**
```
Database connected successfully
Server running on port 5000
```

### 기능 확인
- ✅ 데이터베이스 연결 성공
- ✅ Prisma Client 정상 생성
- ✅ 서버 정상 시작
- ✅ 포트 5000에서 리스닝
- ✅ 초기 데이터 생성 완료

---

## 교훈 및 주의사항

### 1. 환경 변수 로딩 순서
- 환경 변수가 필요한 모듈 임포트 전에 반드시 dotenv를 로드해야 함
- 사이드 이펙트 임포트(`import 'dotenv/config'`)를 파일 최상단에 배치하는 것이 안전함

### 2. 데이터베이스 스키마 관리
- 수동으로 데이터베이스 스키마를 수정하지 말고 Prisma 마이그레이션 사용
- Prisma 스키마와 실제 데이터베이스 스키마 동기화 주기적으로 확인
- 드리프트 발생 시 `prisma migrate reset` 또는 `prisma db push` 사용

### 3. Prisma 7 마이그레이션
- Prisma 7에서는 driver adapter가 필수임
- `prisma.config.ts`가 중요한 설정 파일이 됨
- 모든 Prisma Client 인스턴스에 adapter를 전달해야 함

---

## 관련 파일

### 수정된 파일
- `src/index.ts` - dotenv 로딩 순서 수정
- `prisma.config.ts` - Prisma 7 설정 파일 (신규)
- `src/config/database.ts` - PrismaPg adapter 사용
- `prisma/seed.ts` - PrismaPg adapter 사용

### 마이그레이션 파일
- `prisma/migrations/20260622053236_init/migration.sql` - 초기 스키마 마이그레이션

---

## 참고 자료

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Prisma Config Reference](https://www.prisma.io/docs/orm/v6/reference/prisma-config-reference)
- [Database Drift Troubleshooting](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development)
