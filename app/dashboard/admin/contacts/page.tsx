"use client";

import withRoleProtection from "@/components/auth/withRoleProtection";
import { useSession } from "next-auth/react";

import Logout from "@/components/auth/Logout";
import { Contact } from "@/types";
import Loading from "@/components/Loading";
import ContactDisplay from "./ContactDisplay";
import { UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import NewContact from "@/components/forms/NewContact";

function Contacts() {
  const { data: session, status } = useSession();
  const [isShowing, setIsShowing] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const { getContacts } = await import("@/app/actions/contacts");
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const handleFormClose = async () => {
    setIsShowing(null);
    // Refresh contacts
    const { getContacts } = await import("@/app/actions/contacts");
    const data = await getContacts();
    setContacts(data);
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
        <div className="flex flex-col justify-center md:justify-start lg:pl-20 items-center lg:items-start gap-5 mt-5 lg:mt-10">
          <div className="w-fit bg-component-bg p-4 rounded-xl border border-border">
            <button
              className="Qa-button"
              onClick={() => setIsShowing("contact")}
            >
              <UserRoundPlus className="form-icons p-1" />
              <span className="px-3 text-lg lg:text-2xl">Add Contact</span>
            </button>
          </div>
          <div className="mb-3">
            <ContactDisplay initialContacts={contacts} />
          </div>
        </div>
      </div>

      {isShowing === "contact" && <NewContact onClose={handleFormClose} />}
    </>
  );
}

export default withRoleProtection(Contacts, { allowedRoles: [1] });
