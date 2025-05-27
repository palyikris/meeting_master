import { getRooms } from "@/lib/room/utils"
import { useQuery } from "@tanstack/react-query"


export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}