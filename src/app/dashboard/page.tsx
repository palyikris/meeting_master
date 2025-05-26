"use client"

import { RoomEvent } from "@/types";
import { useEffect, useState } from "react";
import MainCalendar from "../../features/dashboard/main-calendar/MainCalendar";
import { useEvents } from "@/hooks/event/useEvents";
import { Box } from "@mui/material";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import EventAdder from "@/features/dashboard/event-adder/EventAdder";

export default function DashboardPage() {
  const [focusedDate] = useState(new Date());
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const { data, isLoading, error } = useEvents();
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);

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
        height: "auto",
        width: "100%",
        overflowX: "hidden"
      }}
    >
      <Box sx={{ width: "50%", height: "100%" }}>
        <EventAdder
          selectInfo={selectInfo}
          setSelectInfo={setSelectInfo}
        ></EventAdder>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: 2,
          margin: "2rem 1rem",
          overflowX: "hidden"
        }}
      >
        <MainCalendar
          focusedDate={focusedDate}
          isLoading={isLoading}
          events={events}
          selectInfo={selectInfo}
          setSelectInfo={setSelectInfo}
        ></MainCalendar>
      </Box>
    </Box>
  );
}