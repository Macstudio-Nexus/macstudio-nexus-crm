"use server"

  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";

  export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    return session;
  }

  export async function requireAdmin() {
    const session = await requireAuth();
    if (session.user.roleId !== 1) {
      throw new Error("Forbidden");
    }
    return session;
  }
