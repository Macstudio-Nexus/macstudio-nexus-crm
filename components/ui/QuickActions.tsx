import withRoleProtection from "@/components/auth/withRoleProtection";
import {
  FolderPlus,
  MonitorCheck,
  Plus,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";
import NewUser from "@/components/features/users/NewUser";
import NewProject from "@/components/features/projects/NewProject";

import { useState } from "react";
import NewContact from "@/components/features/contacts/NewContact";

function QuickActions() {
  const [isShowing, setIsShowing] = useState<string | null>(null);

  const handleFormClose = () => setIsShowing(null);

  return (
    <>
      <div className="bg-component-bg h-fit w-fit p-4 rounded-xl border-1 border-border font-plex flex flex-col space-y-6 justify-center items-center mx-2">
        <div className="flex justify-center items-center">
          <Plus className="form-icons bg-neon-green-trans" />
          <span className="px-3 text-2xl lg:text-3xl">Quick Actions</span>
        </div>
        <div className="flex flex-col justify-center items-center w-full space-y-3">
          <button className="Qa-button" onClick={() => setIsShowing("user")}>
            <UserRoundPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add User</span>
          </button>
          <button className="Qa-button" onClick={() => setIsShowing("contact")}>
            <UserPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add Contact</span>
          </button>
          <button className="Qa-button" onClick={() => setIsShowing("project")}>
            <FolderPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add Project</span>
          </button>
        </div>
      </div>

      {isShowing === "user" && <NewUser onClose={handleFormClose} />}
      {isShowing === "project" && <NewProject onClose={handleFormClose} />}
      {isShowing === "contact" && <NewContact onClose={handleFormClose} />}
    </>
  );
}

export default withRoleProtection(QuickActions, { allowedRoles: [1] });
