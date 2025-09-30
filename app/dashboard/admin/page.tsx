"use client";

import withRoleProtection from "@/components/auth/withRoleProtection";
import { useSession } from "next-auth/react";

import Logout from "@/components/auth/Logout";
import Loading from "@/components/Loading";
import QuickActions from "@/components/ui/QuickActions";

function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading text="..." />;
  }

  return (
    <div className="text-text-light font-plex px-5">
      <div className="flex items-center justify-between px-5 lg:px-8 pt-5 lg:pt-8">
        <div className="flex flex-col items-start gap-1">
          <span className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
            Dashboard
          </span>
          <span className="text-sm md:text-base lg:text-xl 2xl:text-2xl pl-1">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
          </span>
        </div>
        <Logout />
      </div>
      <div className="flex justify-start items-center py-8 lg:py-16 px-5 lg:px-6">
        <QuickActions />
      </div>
    </div>
  );
}

export default withRoleProtection(AdminDashboard, { allowedRoles: [1] });
