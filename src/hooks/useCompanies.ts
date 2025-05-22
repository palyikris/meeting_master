import { getCompanies } from "@/lib/company/utils";
import { useQuery } from "@tanstack/react-query";

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 2,
  });
