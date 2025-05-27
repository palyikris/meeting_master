"use client"

import { Room, RoomEvent } from "@/types";
import { useEffect, useState } from "react";
import MainCalendar from "../../features/dashboard/main-calendar/MainCalendar";
import { useEvents } from "@/hooks/event/useEvents";
import { Box } from "@mui/material";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import EventAdder from "@/features/dashboard/event-adder/EventAdder";
import { Toaster } from "react-hot-toast";
import UpcomingEvents from "@/features/dashboard/upcoming-events/UpcomingEvents";
import { useRooms } from "@/hooks/room/useRooms";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import styles from "./styles/styles.module.css";

export default function DashboardPage() {
  const [focusedDate] = useState(new Date());
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const { data, isLoading, error } = useEvents();
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);
  const [updateEventId, setUpdateEventId] = useState<string | null>(null);

  const { data: fetchedRooms } = useRooms();
  const [rooms, setRooms] = useState<Room[] | null>([]);

  const router = useRouter();

  useEffect(() => {
    if (fetchedRooms) {
      setRooms(fetchedRooms);
    }
  }, [fetchedRooms]);

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
        justifyContent: "center",
        height: "auto",
        width: "100%",
        overflowX: "hidden",
        gap: "1rem",
      }}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#1E293B",
          },

          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#10B981",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#EF4444",
            },
          },
          loading: {
            iconTheme: {
              primary: "#4E77E4",
              secondary: "#4E77E4",
            },
          },
        }}
      ></Toaster>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: 2,
            margin: "2rem 1rem",
            overflowX: "hidden",
            boxShadow: "rgba(78,119,228, 0.3) 0px 2px 8px 0px",
          }}
        >
          <EventAdder
            selectInfo={selectInfo}
            setSelectInfo={setSelectInfo}
            updateEvent={
              events.find((event) => event.id === updateEventId) || null
            }
            setUpdateEventId={setUpdateEventId}
            rooms={rooms || []}
          ></EventAdder>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: 2,
            margin: "0 1rem",
            overflowX: "hidden",
            boxShadow: "rgba(78,119,228, 0.3) 0px 2px 8px 0px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Image
            src={"/logo.png"}
            width={150}
            height={75}
            alt="Meeting master logo"
          ></Image>
          <Button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className={styles.logoutButton}
          >
            <LogoutRoundedIcon />
            Logout
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: 2,
            margin: "2rem 1rem",
            overflowX: "hidden",
            boxShadow: "rgba(78,119,228, 0.3) 0px 2px 8px 0px",
          }}
        >
          <UpcomingEvents
            events={[...events]
              .filter((event) => new Date(event.start_time) > new Date())
              .sort(
                (a, b) =>
                  new Date(a.start_time).getTime() -
                  new Date(b.start_time).getTime()
              )
              .slice(0, 2)}
            rooms={rooms || []}
            isLoading={isLoading}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: 2,
          margin: "2rem 1rem",
          overflowX: "hidden",
          boxShadow: "rgba(78,119,228, 0.3) 0px 2px 8px 0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <MainCalendar
          focusedDate={focusedDate}
          isLoading={isLoading}
          events={events}
          selectInfo={selectInfo}
          setSelectInfo={setSelectInfo}
          setUpdateEventId={setUpdateEventId}
        ></MainCalendar>
      </Box>
    </Box>
  );
}