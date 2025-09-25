import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useClients() {
  const { data, error, isLoading, mutate } = useSWR("/api/clients", fetcher);

  return {
    clients: data,
    isLoading,
    isError: error,
    mutate
  };
}
