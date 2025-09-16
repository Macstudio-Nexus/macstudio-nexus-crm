import type { NextAuthConfig } from "next-auth";

// Middleware-safe config without nodemailer
export default {
  providers: [],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname === "/";

      if (isOnLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig