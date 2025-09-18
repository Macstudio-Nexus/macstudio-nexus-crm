"use client";

import withRoleProtection from "@/components/withRoleProtection";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Logout from "@/components/Logout";
import Loading from "@/components/Loading/Loading";

function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading text="Loading..." />;
  }

  return (
    <div className="text-text font-plex">
      <div className="flex items-center justify-between px-5 pt-10">
        <span className="text-3xl">Dashboard</span>
        <Logout />
      </div>
    </div>
  );
}

export default withRoleProtection(AdminDashboard, { allowedRoles: [1] });
