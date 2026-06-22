-- Create User table
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Enterprise table
CREATE TABLE "Enterprise" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT,
    contact TEXT,
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Machine table
CREATE TABLE "Machine" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OFFLINE',
    createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"(id)
);

-- Create MonitoringData table
CREATE TABLE "MonitoringData" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "machineId" TEXT NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    pressure DOUBLE PRECISION NOT NULL,
    "cycleTime" INTEGER NOT NULL,
    timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("machineId") REFERENCES "Machine"(id)
);
