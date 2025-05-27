import { createEvent } from "@/lib/event/utils";
import { RoomEvent } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type AddEventPayLoad = Omit<RoomEvent, "id" | "created_at">

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddEventPayLoad) => {
      
      await createEvent({
        title: payload.title,
        start_time: payload.start_time,
        end_time: payload.end_time,
        room_id: payload.room_id,
        recurrence_rule: payload.recurrence_rule,
        background_color: payload.background_color,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
}