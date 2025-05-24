import { getEvents } from "@/lib/event/utils"
import { useQuery } from "@tanstack/react-query"


export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}