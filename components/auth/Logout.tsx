import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const logOut = async () => {
  signOut();
};

export default function Logout() {
  return (
    <div className="bg-component-bg rounded-xl border-1 border-border p-1 flex items-center hover:bg-border">
      <button onClick={logOut} className=" cursor-pointer">
        <LogOut className="size-8 lg:size-12 2xl:size-14" />
      </button>
    </div>
  );
}
