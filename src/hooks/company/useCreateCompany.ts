import { createCompany } from '@/lib/company/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateCompanyPayload {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCompanyPayload) => {
      createCompany({
        name: payload.name,
        email: payload.email,
        address: payload.address,
        phone: payload.phone
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    }
  });
};
