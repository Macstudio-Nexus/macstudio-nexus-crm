import { useState, useEffect } from "react";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getUsers } = await import("@/actions/users");
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleRefetch = () => fetchUsers();
    window.addEventListener("userCreated", handleRefetch);

    return () => window.removeEventListener("userCreated", handleRefetch);
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}
