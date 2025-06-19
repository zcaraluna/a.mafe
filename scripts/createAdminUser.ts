import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const name = 'admin';
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
  console.log('Usuario administrador creado/actualizado:', user);
}

main().then(() => prisma.$disconnect()); 