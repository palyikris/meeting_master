import { deleteEvent } from "@/lib/event/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface DeleteEventPayload {
  id: string;
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteEventPayload) => {
      const { id } = payload;
      await deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}