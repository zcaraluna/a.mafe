"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@admin.com';
    const name = 'admin';
    const password = 'admin123';
    const hash = await bcryptjs_1.default.hash(password, 10);
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
