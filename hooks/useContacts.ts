import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR("/api/contacts", fetcher);

  return {
    contacts: data,
    isLoading,
    isError: error,
    mutate
  };
}
