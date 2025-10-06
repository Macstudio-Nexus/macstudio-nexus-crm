import { UserRound } from "lucide-react";
import { BasicContact } from "@/types";

export default function ProjectContactViewer({
  name,
  email,
  phoneNumber,
}: BasicContact) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 bg-component-bg rounded-xl border border-border max-w-fit 2xl:min-w-sm p-4">
      <div className="flex items-center justify-left gap-3 w-full">
        <UserRound className="text-neon-green size-12 bg-neon-green-trans rounded-xl p-2" />
        <h1 className="text-2xl">Contact Information</h1>
      </div>
      <div className="grid grid-cols-[100px_1fr] grid-rows-3 text-lg">
        <div>Name: </div>
        <div className="text-accent">{name}</div>
        <div>Email: </div>
        <div className="text-accent">{email}</div>
        <div>Phone:</div> <div className="text-accent">{phoneNumber}</div>
      </div>
    </div>
  );
}
