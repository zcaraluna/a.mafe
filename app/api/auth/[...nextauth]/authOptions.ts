import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        username: { label: 'Usuario', type: 'text', placeholder: 'usuario o email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.username },
                { name: credentials.username },
              ],
              role: 'ADMIN',
            },
          });
          
          if (!user || !user.password) return null;
          
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error('Error en autenticación:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 300, // 5 minutos
    updateAge: 60, // Actualizar cada minuto
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300 // 5 minutos
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, ...message) {
      console.error(`[NextAuth Error] ${code}:`, ...message);
    },
    warn(code, ...message) {
      console.warn(`[NextAuth Warning] ${code}:`, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[NextAuth Debug] ${code}:`, ...message);
      }
    }
  }
}; 