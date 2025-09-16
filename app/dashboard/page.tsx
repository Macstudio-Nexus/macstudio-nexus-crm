import { auth } from "@/auth"
  import { redirect } from "next/navigation"
  import AdminDashboard from "@/app/components/admin/AdminDashboard"
  import UserDashboard from "@/app/components/user/UserDashboard"

  // Extend the User type to include 'role'
  declare module "next-auth" {
    interface User {
      role?: string;
    }
  }

  export default async function Dashboard() {
    const session = await auth()

    if (!session) {
        redirect("/")
    }

    const userRole = session.user?.role

    if (userRole === "1") {
        return <AdminDashboard />
    } else if (userRole === "2") {
        return <UserDashboard />
    } else {
        return <div>You are a guest</div>
    }

}