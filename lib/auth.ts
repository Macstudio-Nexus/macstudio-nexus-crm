import { NextAuthOptions, Session } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/lib/db';

// Extend the Session type to include id and roleId
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roleId: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log('SignIn callback called with user:', user.email);

            // Only allow sign in if user exists in database
            if (account?.provider === 'email') {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                });

                // console.log('Found existing user:', existingUser ? 'Yes' : 'No');
                // console.log('User roleId:', existingUser?.roleId, 'Type:', typeof existingUser?.roleId);

                return !!existingUser; // Only allow if user exists
            }
            return true;
        },
        async session({ session, user }) {
            // Add user info to session
            const dbUser = await prisma.user.findUnique({
                where: { email: session?.user?.email! }
            });

            if (dbUser && session.user) {
                session.user.id = dbUser.id.toString();
                session.user.roleId = dbUser.roleId;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            // console.log('Redirect callback called with URL:', url);

            // Allow relative URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;

            // Allow same origin URLs
            if (url.startsWith(baseUrl)) return url;

            // Default redirect to a landing page that will handle role-based routing
            return `${baseUrl}/dashboard`;
        }
    }
}