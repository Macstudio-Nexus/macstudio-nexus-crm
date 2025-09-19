 import useSWR from 'swr'

  const fetcher = (url: string) => fetch(url).then(res => res.json())

  export function useSites() {
    const { data, error, isLoading } = useSWR('/api/sites', fetcher)

    return {
      sites: data,
      isLoading,
      isError: error
    }
  }