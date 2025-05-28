import { getUsersInCompany } from "@/lib/user/utils";
import { useQuery } from "@tanstack/react-query";



export const useUsersInCompany = () => {
  return useQuery({
    queryKey: ["usersInCompany"],
    queryFn: getUsersInCompany,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}