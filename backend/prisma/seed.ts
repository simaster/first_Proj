import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');

  // Create sample user
  const hashedPassword = await bcrypt.hash('8227', 12);

  const user = await prisma.user.upsert({
    where: { email: 'si' },
    update: {},
    create: {
      email: 'si',
      password: hashedPassword,
      name: 'master',
      role: 'ADMIN',
    },
  });

  console.log('Created user:', user);

  // Create sample enterprise
  const enterprise = await prisma.enterprise.upsert({
    where: { code: 'ENT001' },
    update: {},
    create: {
      name: 'Sample Enterprise',
      code: 'ENT001',
      address: '123 Sample Street',
      contact: 'contact@example.com',
    },
  });

  console.log('Created enterprise:', enterprise);

  // Create sample machine
  const machine = await prisma.machine.upsert({
    where: { code: 'MCH001' },
    update: {},
    create: {
      name: 'Sample Machine 1',
      code: 'MCH001',
      enterpriseId: enterprise.id,
      status: 'ONLINE',
    },
  });

  console.log('Created machine:', machine);

  await prisma.monitoringData.deleteMany({
    where: { machineId: machine.id },
  });

  // Create sample monitoring data
  const monitoringData = await prisma.monitoringData.create({
    data: {
      machineId: machine.id,
      temperature: 185.5,
      pressure: 120.3,
      cycleTime: 45,
    },
  });

  console.log('Created monitoring data:', monitoringData);

  // Create more sample monitoring data
  for (let i = 0; i < 20; i++) {
    await prisma.monitoringData.create({
      data: {
        machineId: machine.id,
        temperature: 180 + Math.random() * 20,
        pressure: 115 + Math.random() * 15,
        cycleTime: 40 + Math.random() * 15,
        timestamp: new Date(Date.now() - i * 3600000), // Every hour
      },
    });
  }

  console.log('Created 20 sample monitoring data points');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
