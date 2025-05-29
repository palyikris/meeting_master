import { createRoom } from "@/lib/room/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreateRoomPayload {
  name: string;
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(payload: CreateRoomPayload) => {
      await createRoom(payload)
    },
    onSuccess: () => {
      toast.success("Room created successfully!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  })
}