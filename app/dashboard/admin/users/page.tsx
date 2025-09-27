"use client";

import withRoleProtection from "@/components/auth/withRoleProtection";
import { useSession } from "next-auth/react";

import Logout from "@/components/auth/Logout";
import Loading from "@/components/Loading";
import UserDisplay from "./UserDisplay";
import NewUser from "@/components/forms/NewUser";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";

function Users() {
  const { data: session, status } = useSession();
  const [isShowing, setIsShowing] = useState<string | null>(null);
  const { mutate } = useUsers();

  const handleFormClose = () => {
    setIsShowing(null);
    mutate();
  };

  if (status === "loading") {
    return <Loading text="..." />;
  }

  return (
    <>
      <div className="text-text font-plex">
        <div className="flex items-center justify-between px-5 lg:px-8 pt-5 lg:pt-8">
          <div className="flex flex-col items-start gap-1">
            <span className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
              Users
            </span>
          </div>
          <Logout />
        </div>
        <div className="flex flex-col justify-center md:justify-start lg:pl-20 items-center lg:items-start gap-5 mt-5 lg:mt-10">
          <div className="w-fit bg-gray-900 p-4 rounded-xl border border-gray-800">
            <button className="Qa-button" onClick={() => setIsShowing("user")}>
              <UserRoundPlus className="form-icons p-1" />
              <span className="px-3 text-lg lg:text-2xl">Add User</span>
            </button>
          </div>
          <div>
            <UserDisplay />
          </div>
        </div>
      </div>

      {isShowing === "user" && <NewUser onClose={handleFormClose} />}
    </>
  );
}

export default withRoleProtection(Users, { allowedRoles: [1] });
