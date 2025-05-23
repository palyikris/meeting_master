import { deleteCompany } from "@/lib/company/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface DeleteCompanyPayload {
  id: string;
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteCompanyPayload) => {
      const { id } = payload;
      await deleteCompany(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};