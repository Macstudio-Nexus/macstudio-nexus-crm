import { useState, useEffect } from "react";

export function useBrandingProjects() {
  const [brandingProjects, setBrandingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBrandingProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getBrandProjects } = await import("@/actions/projects/projects");
      const projects = await getBrandProjects();
      setBrandingProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch"));
      console.error("Error fetching branding projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandingProjects();

    const handleRefetch = () => fetchBrandingProjects();
    window.addEventListener("projectCreated", handleRefetch);

    return () => window.removeEventListener("projectCreated", handleRefetch);
  }, []);

  return { brandingProjects, isLoading, error, refetch: fetchBrandingProjects };
}