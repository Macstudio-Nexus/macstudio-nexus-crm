import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects", fetcher);

  return {
    projects: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useWebProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects/web-dev", fetcher);

  return {
    webProjects: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useBrandingProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects/branding", fetcher);

  return {
    BrandingProjects: data,
    isLoading,
    isError: error,
    mutate
  };
}


