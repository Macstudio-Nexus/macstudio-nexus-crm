"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

import Loader from "@/components/Loading/Loading";

interface RoleProtectionOptions {
  allowedRoles: number[];
  redirectTo?: string;
  fallbackComponent?: ComponentType;
}

function withRoleProtection<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: RoleProtectionOptions
) {
  return function ProtectedComponent(props: T) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {
      allowedRoles,
      redirectTo = "/",
      fallbackComponent: FallbackComponent,
    } = options;

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        router.push("/");
        return;
      }

      // Check if user's role is in the allowed roles
      console.log("REDIRECT: session.user?.roleId:", session.user?.roleId);
      console.log("REDIRECT: allowedRoles:", allowedRoles);
      if (
        !session.user?.roleId ||
        !allowedRoles.includes(session.user?.roleId)
      ) {
        // Redirect based on user's actual role
        if (session.user?.roleId === 1) {
          router.push("/dashboard/admin");
        } else if (session.user?.roleId === 2) {
          router.push("/dashboard/user");
        } else if (session.user?.roleId === 3) {
          router.push("/dashboard/guest");
        } else {
          router.push(redirectTo);
        }
        return;
      }
    }, [session, status, router]);

    // Loading state
    if (status === "loading") {
      return <Loader text="Loading..." />;
    }

    // Not authenticated
    if (!session) {
      return <Loader text="Redirecting to login" />;
    }

    // Not authorized for this role
    console.log("REDIRECT: session.user?.roleId:", session.user?.roleId);
    console.log("REDIRECT: allowedRoles:", allowedRoles);
    if (!session.user?.roleId || !allowedRoles.includes(session.user?.roleId)) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <Loader text="Redirecting..." />;
    }

    console.log("allowedRoles:", allowedRoles);
    console.log("session.user?.roleId:", session.user?.roleId);
    console.log("includes check:", allowedRoles.includes(session.user?.roleId));

    // Authorized - render the wrapped component
    return <WrappedComponent {...props} />;
  };
}

export default withRoleProtection;
