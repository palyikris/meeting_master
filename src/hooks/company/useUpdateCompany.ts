import { updateCompany } from "@/lib/company/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";



interface UpdateCompanyPayLoad {
  name: string;
  is_active: boolean;
  id: string;
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCompanyPayLoad) => { 
      updateCompany(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  })
}