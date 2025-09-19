import withRoleProtection from "@/components/withRoleProtection";
import { FolderPlus, MonitorCheck, Plus, UserRoundPlus } from "lucide-react";

function QuickActions() {
  return (
    <div className="bg-gray-900 h-fit w-fit p-4 rounded-xl border-1 border-gray-800 font-plex flex flex-col space-y-6 justify-center items-center">
      <div className="flex justify-center items-center">
        <Plus className="form-icons bg-neon-green-trans" />
        <span className="px-3 text-2xl lg:text-3xl">Quick Actions</span>
      </div>
      <div className="flex flex-col justify-center items-center w-full space-y-3">
        <button className="Qa-button">
            <UserRoundPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add User</span>
        </button>
        <button className="Qa-button">
            <MonitorCheck className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add Site</span>
        </button>
        <button className="Qa-button">
            <FolderPlus className="form-icons p-1" />
            <span className="px-3 text-lg lg:text-2xl">Add Project</span>
        </button>
      </div>
    </div>
  );
}

export default withRoleProtection(QuickActions, { allowedRoles: [1] });
