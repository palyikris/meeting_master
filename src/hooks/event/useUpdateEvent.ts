import { updateEvent } from "@/lib/event/utils";
import { RoomEvent } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type UpdateEventPayLoad = Omit<RoomEvent, "created_at">

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateEventPayLoad) => {
      const { id, ...eventData } = payload;
      await updateEvent({ id, ...eventData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};