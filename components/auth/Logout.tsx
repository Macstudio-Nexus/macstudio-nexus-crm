import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const logOut = async () => {
  signOut();
};

export default function Logout() {
  return (
    <div className="bg-gray-900 rounded-xl border-1 border-gray-800 p-1 flex items-center hover:bg-gray-700">
      <button onClick={logOut} className=" cursor-pointer">
        <LogOut className="size-8 lg:size-12 2xl:size-14"/>
      </button>
    </div>
  );
}
