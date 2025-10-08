import { useState, useEffect } from "react";

export function useWebProjects() {
  const [webProjects, setWebProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWebProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getWebProjects } = await import("@/actions/projects/projects");
      const projects = await getWebProjects();
      setWebProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching web projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebProjects();

    const handleRefetch = () => fetchWebProjects();
    window.addEventListener("projectCreated", handleRefetch);

    return () => window.removeEventListener("projectCreated", handleRefetch);
  }, []);

  return { webProjects, isLoading, error, refetch: fetchWebProjects };
}