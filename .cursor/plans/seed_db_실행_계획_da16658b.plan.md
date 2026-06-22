---
name: Seed DB 실행 계획
overview: PostgreSQL `injection_monitoring` DB에 스키마를 마이그레이션한 뒤, `backend/prisma/seed.ts` 샘플 데이터를 저장합니다. MonitoringData 중복 생성을 막도록 seed 스크립트를 idempotent하게 개선합니다.
todos:
  - id: env-setup
    content: backend/.env 생성 — DATABASE_URL 및 JWT 변수 설정
    status: completed
  - id: install-generate
    content: backend에서 npm install 및 prisma generate 실행
    status: completed
  - id: migrate
    content: npx prisma migrate deploy로 init 마이그레이션 적용
    status: completed
  - id: seed-idempotent
    content: seed.ts에 MonitoringData deleteMany 추가 (재실행 idempotent)
    status: completed
  - id: run-seed
    content: npm run seed 실행
    status: completed
  - id: verify
    content: Prisma Studio 또는 psql로 1/1/1/21건 확인
    status: completed
isProject: false
---

# seed.ts 샘플 데이터 DB 저장 계획

## 현재 상태

- 시드 스크립트: [`backend/prisma/seed.ts`](backend/prisma/seed.ts) — `User`, `Enterprise`, `Machine`, `MonitoringData` 생성
- 실행 명령: [`backend/package.json`](backend/package.json)의 `"seed": "tsx prisma/seed.ts"`
- Prisma 설정: [`backend/prisma.config.ts`](backend/prisma.config.ts) — `DATABASE_URL` 및 seed 경로 등록
- 초기 마이그레이션: [`backend/prisma/migrations/20260622053236_init/migration.sql`](backend/prisma/migrations/20260622053236_init/migration.sql)
- `.env` 파일 없음 — 사용자가 제공한 URL로 생성 필요
- DB 상태: DB는 존재하지만 **테이블 없음** (최초 설정)

```mermaid
flowchart TD
  env[backend/.env 설정] --> install[npm install]
  install --> generate[prisma generate]
  generate --> migrate[prisma migrate deploy]
  migrate --> seedFix[seed.ts idempotent 개선]
  seedFix --> runSeed[npm run seed]
  runSeed --> verify[Prisma Studio / psql 확인]
```

## 1. 사전 조건 확인

PostgreSQL이 `localhost:5432`에서 실행 중인지 확인합니다.

```powershell
# DB 존재 여부 확인 (psql 사용 가능 시)
psql -U postgres -h localhost -p 5432 -l
```

DB `injection_monitoring`이 없으면 생성:

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE injection_monitoring;"
```

## 2. 환경 변수 설정

[`backend/.env.example`](backend/.env.example)를 복사해 [`backend/.env`](backend/.env) 생성:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:8227@localhost:5432/injection_monitoring"
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

`seed.ts`는 `import "dotenv/config"`로 이 파일을 자동 로드합니다.

## 3. 의존성 설치 및 Prisma Client 생성

```powershell
cd c:\CODE\myProject\0622\first_Proj\backend
npm install
npm run prisma:generate
```

## 4. 스키마 마이그레이션 (테이블 생성)

DB가 비어 있으므로 init 마이그레이션을 적용합니다. 대화형 프롬프트 없이 적용하려면:

```powershell
npx prisma migrate deploy
```

또는 개발용으로:

```powershell
npm run prisma:migrate
```

적용 후 생성되는 테이블: `User`, `Enterprise`, `Machine`, `MonitoringData` (+ enum 타입 2개)

## 5. seed.ts idempotent 개선 (MonitoringData 중복 방지)

현재 `User` / `Enterprise` / `Machine`은 `upsert`로 재실행 안전하지만, `MonitoringData`는 `create`만 사용해 **실행할 때마다 21건씩 중복**됩니다.

[`backend/prisma/seed.ts`](backend/prisma/seed.ts)에서 machine upsert 이후, monitoring 데이터 생성 전에 아래 패턴 적용:

```typescript
// machine upsert 이후
await prisma.monitoringData.deleteMany({
  where: { machineId: machine.id },
});

// 이후 기존 create 로직 그대로 (1건 + 20건 루프)
```

효과:
- 1회 실행: 21건 생성
- 재실행: 기존 MCH001 관련 데이터 삭제 후 동일 21건 재생성 → **중복 없이 항상 동일 결과**

`User` / `Enterprise` / `Machine`은 기존 `upsert` 유지 (변경 없음).

참고: [`backend/insert-data.js`](backend/insert-data.js)는 구버전 CommonJS 스크립트이며 adapter 미사용 — **사용하지 않고 `seed.ts`만 사용**.

## 6. 시드 실행

```powershell
cd c:\CODE\myProject\0622\first_Proj\backend
npm run seed
```

또는 Prisma seed 명령:

```powershell
npx prisma db seed
```

### 저장될 샘플 데이터

| 엔티티 | 키 | 내용 |
|--------|-----|------|
| User | email: `si` | password: `8227` (bcrypt 해시), name: `master`, role: `ADMIN` |
| Enterprise | code: `ENT001` | Sample Enterprise |
| Machine | code: `MCH001` | Sample Machine 1, status: `ONLINE` |
| MonitoringData | machineId → MCH001 | 21건 (온도/압력/사이클타임, 시간별 timestamp) |

## 7. 결과 검증

**Prisma Studio (GUI):**

```powershell
npm run prisma:studio
```

**psql (CLI):**

```powershell
psql "postgresql://postgres:8227@localhost:5432/injection_monitoring" -c "SELECT COUNT(*) FROM \"User\";"
psql "postgresql://postgres:8227@localhost:5432/injection_monitoring" -c "SELECT COUNT(*) FROM \"MonitoringData\";"
```

기대값: User 1, Enterprise 1, Machine 1, MonitoringData 21

**API 로그인 확인 (선택):**

```powershell
npm run dev
# POST http://localhost:5000/api/v1/auth/login
# body: { "email": "si", "password": "8227" }
```

## 8. 문제 발생 시 체크리스트

| 증상 | 원인 | 조치 |
|------|------|------|
| `DATABASE_URL` 오류 | `.env` 미생성 또는 경로 오류 | `backend/.env` 확인, `backend` 디렉터리에서 실행 |
| relation does not exist | 마이그레이션 미적용 | `npx prisma migrate deploy` 재실행 |
| connection refused | PostgreSQL 미실행 | PostgreSQL 서비스 시작 |
| database does not exist | DB 미생성 | `CREATE DATABASE injection_monitoring` |
| `@prisma/client` 오류 | Client 미생성 | `npm run prisma:generate` |

## 변경 파일 요약

- **신규**: `backend/.env` (gitignore 대상, 커밋하지 않음)
- **수정**: [`backend/prisma/seed.ts`](backend/prisma/seed.ts) — MonitoringData `deleteMany` 추가 (약 3줄)
