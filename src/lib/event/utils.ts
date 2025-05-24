import { RoomEvent } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";


export async function getEvents(): Promise<RoomEvent[] | null> {
  const { data } = await axios.get("/api/events");

  if (!data || data.error) {
    console.error("Error fetching events:", data.error);
    toast.error("Error fetching events!");
    return null;
  }

  return data;
}

export async function createEvent(
  event: Omit<RoomEvent, "id" | "created_at">
): Promise<RoomEvent | null> {
  const { data } = await axios.post("/api/events", event);

  if (!data || data.error) {
    console.error("Error creating event:", data.error);
    toast.error("Error creating event!");
    return null;
  }

  toast.success("Event created successfully!");
  return data;
}

export async function updateEvent(
  event: RoomEvent
): Promise<RoomEvent | null> {
  const { data } = await axios.put(`/api/events/${event.id}`, event);

  if (!data || data.error) {
    console.error("Error updating event:", data.error);
    toast.error("Error updating event!");
    return null;
  }

  toast.success("Event updated successfully!");
  return data;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { data } = await axios.delete(`/api/events/${id}`);

  if (!data || data.error) {
    console.error("Error deleting event:", data.error);
    toast.error("Error deleting event!");
    return false;
  }

  toast.success("Event deleted successfully!");
  return true;
}

export async function getEventById(id: string): Promise<RoomEvent | null> {
  const { data } = await axios.get(`/api/events/${id}`);

  if (!data || data.error) {
    console.error("Error fetching event:", data.error);
    toast.error("Error fetching event!");
    return null;
  }

  return data;
}