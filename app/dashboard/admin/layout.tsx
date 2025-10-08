import Provider from "@/components/auth/provider";
import SideBar from "@/components/layout/SideBar";

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
      <main className="bg-main-bg flex-1">{children}</main>
    </div>
  );
}
