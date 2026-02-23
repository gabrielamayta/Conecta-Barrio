import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; 
import { comparePassword } from "@/lib/auth.utils";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Buscamos al usuario en tu SQLite
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Si no existe o no tiene contraseña, rechazamos
        if (!user || !user.passwordHash) return null;

        // Usamos tu función de lib/auth.utils.ts para comparar
        const isPasswordCorrect = await comparePassword(
          credentials.password,
          user.passwordHash // <-- Usamos el nombre exacto de tu schema.prisma
        );

        if (!isPasswordCorrect) return null;

        // Retornamos el objeto que NextAuth guardará en el token
        return {
          id: user.id,
          email: user.email,
          name: `${user.nombre} ${user.apellido}`, // Combinamos tus campos nombre y apellido
          role: user.role, // Pasamos el ENUM (VECINO, COMERCIANTE, etc)
        };
      }
    })
  ],
  callbacks: {
    // Para que el ID y el ROL estén disponibles en el cliente (useSession)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirige aquí si no está autenticado
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };