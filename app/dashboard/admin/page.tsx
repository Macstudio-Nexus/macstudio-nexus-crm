"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    // Only allow roleId 1 (admin) to access this page
    if (session.user?.roleId !== 1) {
      router.push("/dashboard/user"); // Redirect non-admins to user dashboard
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user?.roleId !== 1) {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <div>Admin Dashboard</div>
    </>
  );
}
