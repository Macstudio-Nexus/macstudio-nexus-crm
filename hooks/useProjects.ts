import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getProjects } = await import("@/actions/projects/projects");
      const projects = await getProjects();
      setProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching web projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const handleRefetch = () => fetchProjects();
    window.addEventListener("projectCreated", handleRefetch);

    return () => window.removeEventListener("projectCreated", handleRefetch);
  }, []);

  return { projects, isLoading, error, refetch: fetchProjects };
}