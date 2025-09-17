"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    // Only allow roleId 2 (user) to access this page
    if (session.user?.roleId !== 2) {
      router.push("/dashboard/admin"); // Redirect non-users to admin dashboard
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.roleId !== 2) {
    return <div>Redirecting...</div>;
  }

  return <div>User Dashboard</div>;
}