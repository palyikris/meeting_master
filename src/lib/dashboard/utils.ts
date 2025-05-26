import { RoomEvent } from "@/types";
import { EventInput } from "@fullcalendar/core/index.js";


export const convertRoomEventToEventInput = (roomEvent: RoomEvent): EventInput => {

  return {
    id: roomEvent.id,
    title: roomEvent.title,
    start: roomEvent.start_time
      ? new Date(roomEvent.start_time).toISOString()
      : undefined,
    end: roomEvent.end_time
      ? new Date(roomEvent.end_time).toISOString()
      : undefined,
    backgroundColor: roomEvent.background_color
      ? `rgba(${convertHexToRgb(roomEvent.background_color)}, 0.3)`
      : "rgba(78, 119, 228, 0.3)",
    borderColor: "transparent",
    textColor: roomEvent.background_color ? roomEvent.background_color : "#4E77E4",
  };
}

export const convertHexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return "0, 0, 0"; // Default to black if conversion fails
  }
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
}