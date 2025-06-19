const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'caiv@admin.com';
  const name = 'caiv';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN', name },
    create: {
      email,
      name,
      password: hash,
      role: 'ADMIN',
    },
  });
  console.log('Usuario creado/actualizado:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 