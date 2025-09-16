import Resend from 'next-auth/providers/resend'
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Resend({
      id: 'resend',
      name: 'Resend',
      apiKey: process.env.RESEND_KEY,
      from: process.env.RESEND_FROM,
})
  ]
} satisfies NextAuthConfig