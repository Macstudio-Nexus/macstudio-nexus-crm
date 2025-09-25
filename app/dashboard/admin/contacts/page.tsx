"use client";

import withRoleProtection from "@/components/withRoleProtection";
import { useSession } from "next-auth/react";

import Logout from "@/components/Logout";
import Loading from "@/components/Loading/Loading";
import ContactDisplay from "./ContactDisplay";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import NewContact from "@/components/forms/NewContact";


function Users() {
  const { data: session, status } = useSession();
  const [isShowing, setIsShowing] = useState<string | null>(null);
  const { mutate } = useContacts();

  const handleFormClose = () => {
    setIsShowing(null)
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
              Contacts
            </span>
          </div>
          <Logout />
        </div>
        <div className="flex flex-col md:flex-row justify-center lg:justify-start lg:pl-20 items-center md:items-start gap-5 space-x-5 mt-5 lg:mt-10">
          <div>
            <ContactDisplay />
          </div>
          <div className="w-fit bg-gray-900 p-4 rounded-xl border border-gray-800">
            <button className="Qa-button" onClick={() => setIsShowing("contact")}>
              <UserRoundPlus className="form-icons p-1" />
              <span className="px-3 text-lg lg:text-2xl">Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      {isShowing === "contact" && <NewContact onClose={handleFormClose} />}
    </>
  );
}

export default withRoleProtection(Users, { allowedRoles: [1] });
