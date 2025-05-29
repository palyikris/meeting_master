import { Room } from "@/types";
import toast from "react-hot-toast";



export async function getRooms(): Promise<Room[] | null> {
  const response = await fetch("/api/rooms");

  if (!response.ok) {
    console.error("Error fetching rooms:", response.statusText);
    toast.error("Error fetching rooms!");
    return null;
  }

  const data = await response.json();

  if (data.error || !data) {
    console.error("Error fetching rooms:", data.error);
    toast.error("Error fetching rooms!");
    return null;
  }

  return data;
}

export async function getRoomById(id: string): Promise<Room | null> {
  const response = await fetch(`/api/rooms/${id}`);

  if (!response.ok) {
    console.error("Error fetching room:", response.statusText);
    toast.error("Error fetching room!");
    return null;
  }

  const data = await response.json();

  if (data.error || !data) {
    console.error("Error fetching room:", data.error);
    toast.error("Error fetching room!");
    return null;
  }

  return data;
}

export async function createRoom(
  room: Omit<Room, "id" | "created_at" | "company_id">
): Promise<Room | null> {
  const response = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  });

  if (!response.ok) {
    console.error("Error creating room:", response.statusText);
    toast.error("Error creating room!");
    return null;
  }

  const data = await response.json();

  if (data.error || !data) {
    console.error("Error creating room:", data.error);
    toast.error("Error creating room!");
    return null;
  }

  return data;
}

export async function updateRoom(
  room: Room
): Promise<Room | null> {
  const response = await fetch(`/api/rooms/${room.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(room)
  });

  if (!response.ok) {
    console.error("Error updating room:", response.statusText);
    toast.error("Error updating room!");
    return null;
  }

  const data = await response.json();

  if (data.error || !data) {
    console.error("Error updating room:", data.error);
    toast.error("Error updating room!");
    return null;
  }

  return data;
}

export async function deleteRoom(id: string): Promise<boolean> {
  const response = await fetch(`/api/rooms/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    console.error("Error deleting room:", response.statusText);
    toast.error("Error deleting room!");
    return false;
  }

  const data = await response.json();

  if (data.error || !data) {
    console.error("Error deleting room:", data.error);
    toast.error("Error deleting room!");
    return false;
  }

  return true;
}