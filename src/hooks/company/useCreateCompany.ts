import { createCompany } from '@/lib/company/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateCompanyPayload {
  name: string;
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCompanyPayload) => {
      createCompany(payload.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};
