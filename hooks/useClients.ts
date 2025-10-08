import { useState, useEffect } from "react";

export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getClients } = await import("@/actions/contacts");
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    const handleRefetch = () => fetchClients();
    window.addEventListener("contactCreated", handleRefetch);

    return () => window.removeEventListener("contactCreated", handleRefetch);
  }, []);

  return { clients, isLoading, error, refetch: fetchClients };
}