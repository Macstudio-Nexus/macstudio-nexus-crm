import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getProjects } = await import("@/app/actions/projects");
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
    window.addEventListener('projectCreated', handleRefetch);

    return () => window.removeEventListener('projectCreated', handleRefetch);
  }, []);

  return { projects, isLoading, error, refetch: fetchProjects };
}


export function useWebProjects() {
  const [webProjects, setWebProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWebProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getWebProjects } = await import("@/app/actions/projects");
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
    window.addEventListener('projectCreated', handleRefetch);

    return () => window.removeEventListener('projectCreated', handleRefetch);
  }, []);

  return { webProjects, isLoading, error, refetch: fetchWebProjects };
}

export function useBrandingProjects() {
  const [brandingProjects, setBrandingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBrandingProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getBrandProjects } = await import("@/app/actions/projects");
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
    window.addEventListener('projectCreated', handleRefetch);

    return () => window.removeEventListener('projectCreated', handleRefetch);
  }, []);

  return { brandingProjects, isLoading, error, refetch: fetchBrandingProjects };
}

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getContacts } = await import("@/app/actions/contacts");
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
    window.addEventListener('contactCreated', handleRefetch);

    return () => window.removeEventListener('contactCreated', handleRefetch);
  }, []);

  return { contacts, isLoading, error, refetch: fetchContacts };
}

export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getClients } = await import("@/app/actions/contacts");
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
    window.addEventListener('contactCreated', handleRefetch);

    return () => window.removeEventListener('contactCreated', handleRefetch);
  }, []);

  return { clients, isLoading, error, refetch: fetchClients };
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getUsers } = await import("@/app/actions/users");
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
    window.addEventListener('userCreated', handleRefetch);

    return () => window.removeEventListener('userCreated', handleRefetch);
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}
