import Provider from "@/components/provider";
import SideBar from "@/app/components/admin/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
        <header className="z-50 ">
          <SideBar />
        </header>
        <main className="bg-gray-950 flex-1">{children}</main>
    </div>
  );
}
