"use client";

import withRoleProtection from "@/components/auth/withRoleProtection";
import { useSession } from "next-auth/react";

import Logout from "@/components/auth/Logout";
import Loading from "@/components/ui/Loading";
import ContactDisplay from "../../../../components/features/contacts/ContactDisplay";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import NewContact from "@/components/features/contacts/NewContact";

function Contacts() {
  const { data: session, status } = useSession();
  const [isShowing, setIsShowing] = useState<string | null>(null);

  const handleFormClose = () => {
    setIsShowing(null);
  };

  if (status === "loading") {
    return <Loading text="..." />;
  }

  return (
    <>
      <div className="text-text-light font-plex">
        <div className="flex items-center justify-between px-5 lg:px-8 pt-5 lg:pt-8">
          <div className="flex flex-col items-start gap-1">
            <span className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
              Contacts
            </span>
          </div>
          <Logout />
        </div>
        <div className="flex flex-col justify-center md:justify-start px-5 2xl:pl-20 items-center lg:items-start gap-5 mt-5 lg:mt-10">
          <button className="Qa-button" onClick={() => setIsShowing("contact")}>
            <UserRoundPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add Contact</span>
          </button>
          <div className="mb-3">
            <ContactDisplay />
          </div>
        </div>
      </div>

      {isShowing === "contact" && <NewContact onClose={handleFormClose} />}
    </>
  );
}

export default withRoleProtection(Contacts, { allowedRoles: [1] });
