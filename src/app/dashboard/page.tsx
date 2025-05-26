"use client"

import { RoomEvent } from "@/types";
import { useEffect, useState } from "react";
import MainCalendar from "../../features/dashboard/main-calendar/MainCalendar";
import { useEvents } from "@/hooks/event/useEvents";
import { Box } from "@mui/material";

export default function DashboardPage() {
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const { data, isLoading, error } = useEvents();

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <Box sx={{ width: "50%", height: "100%" }}></Box>
      <Box sx={{ width: "100%", height: "100%" }}>
        <MainCalendar
          focusedDate={focusedDate}
          isLoading={isLoading}
          events={events}
        ></MainCalendar>
      </Box>
    </Box>
  );
}