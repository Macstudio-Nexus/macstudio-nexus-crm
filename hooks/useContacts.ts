import { useState, useEffect } from "react";

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getContacts } = await import("@/actions/contacts");
      const contactsData = await getContacts();
      setContacts(contactsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching contacts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    const handleRefetch = () => fetchContacts();
    window.addEventListener("contactCreated", handleRefetch);

    return () => window.removeEventListener("contactCreated", handleRefetch);
  }, []);

  return { contacts, isLoading, error, refetch: fetchContacts };
}