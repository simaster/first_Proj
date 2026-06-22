# Prisma 7.8.0 업그레이드 계획

Prisma 5.20.0에서 7.8.0으로 업그레이드하여 Prisma 7의 새로운 구성 방식을 적용합니다.

## 변경사항 개요

Prisma 7은 다음과 같은 주요 변경사항이 있습니다:
- `datasource.url`이 schema.prisma에서 제거되고 `prisma.config.ts`로 이동
- Prisma Client 생성 시 driver adapter가 필수 (PostgreSQL: `@prisma/adapter-pg`)
- `prisma.config.ts`가 프로젝트 루트에서 Prisma CLI 설정을 담당
- seed.ts도 adapter를 사용하도록 업데이트 필요

## 단계별 작업

### 1. 패키지 업그레이드
- `package.json`에서 Prisma 버전을 7.8.0으로 변경:
  - `@prisma/client`: `^7.8.0`
  - `prisma`: `^7.8.0`
- PostgreSQL adapter 추가: `@prisma/adapter-pg`
- `dotenv` 패키지 확인 (이미 설치됨)

### 2. schema.prisma 업데이트
- `datasource db` 블록에서 `url = env("DATABASE_URL")` 제거
- `provider = "postgresql"`만 유지

### 3. prisma.config.ts 생성 (프로젝트 루트)
- `backend/prisma.config.ts` 파일 생성
- 다음 내용 포함:
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

### 4. database.ts 업데이트
- `src/config/database.ts`에서 PrismaClient 생성 방식 변경:
  ```typescript
  import { PrismaClient } from '@prisma/client';
  import { PrismaPg } from '@prisma/adapter-pg';

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });
  ```

### 5. seed.ts 업데이트
- `prisma/seed.ts`에 adapter 사용 추가:
  ```typescript
  import "dotenv/config";
  import { PrismaClient } from '@prisma/client';
  import { PrismaPg } from '@prisma/adapter-pg';

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });
  ```

### 6. 의존성 설치 및 Prisma 생성
- `npm install` 실행하여 새 패키지 설치
- `npx prisma generate` 실행하여 Prisma Client 재생성

### 7. 테스트
- `npm run dev` 실행하여 서버가 정상적으로 시작되는지 확인
- 데이터베이스 연결 확인

## 주의사항

- Prisma 7은 Rust-free Prisma Client를 사용하므로 driver adapter가 필수
- `prisma.config.ts`는 프로젝트 루트(backend 폴더)에 위치해야 함
- 모든 Prisma Client 인스턴스 생성 시 adapter를 전달해야 함
- 기존 `datasourceUrl`, `datasources` 등의 옵션은 Prisma 7에서 제거됨
