"use client";

// Used for redirecting user based on their role

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loading from "@/components/Loading/Loading";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard useEffect - Status:", status, "Session:", session);

    if (status === "loading") return; // Still loading

    if (!session) {
      console.log("No session, redirecting to homepage");
      router.push("/"); // Not authenticated, redirect to login
      return;
    }

    console.log("HEY BITCH", session.user?.roleId);

    // Redirect based on role
    if (session.user?.roleId === 1) {
      console.log("SHould be here for sure cocksucler");
      router.push("/dashboard/admin");
    } else if (session.user?.roleId === 2) {
      router.push("/dashboard/user");
    } else if (session.user?.roleId === 3) {
      router.push("/dashboard/guest");
    } else {
      // Default route
      console.log("why are you here?")
      router.push("/dashboard/user");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading text="Loading..."/>;
  }

  return <Loading text="Loading..."/>;
}