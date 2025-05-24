"use client"

import { RoomEvent } from "@/types";
import { useEffect, useState } from "react";
import MainCalendar from "../../features/dashboard/main-calendar/MainCalendar";
import { useEvents } from "@/hooks/event/useEvents";

export default function DashboardPage() {
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const { data, isLoading, error } = useEvents();

  useEffect(() => {
    if (data) {
      console.log("Fetched events:", data);
      setEvents(data);
    }
  }, [data]);

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  return (
    <div>
      <MainCalendar
        focusedDate={focusedDate}
        isLoading={isLoading}
        events={events}
        setEvents={setEvents}
      ></MainCalendar>
    </div>
  );
}