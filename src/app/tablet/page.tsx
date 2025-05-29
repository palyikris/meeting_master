// app/tablet/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Room, RoomEvent } from "@/types";
import dayjs from "dayjs";
import { useRooms } from "@/hooks/room/useRooms";
import { useEvents } from "@/hooks/event/useEvents";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import styles from "../dashboard/styles/styles.module.css"

const supabase = createClient();

export default function TabletPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    () => localStorage.getItem("selectedRoomId") || null
  );
  const [now, setNow] = useState(dayjs());
  const queryClient = useQueryClient();

  const { data: fetchedRooms } = useRooms();
  const { data: fetchedEvents } = useEvents();

  const router = useRouter();

  useEffect(() => {
    if (fetchedRooms) setRooms(fetchedRooms);
  }, [fetchedRooms]);

  useEffect(() => {
    if (fetchedEvents) setEvents(fetchedEvents);
  }, [fetchedEvents]);

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60000);

    const subscription = supabase
      .channel("events-table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          if (
            // @ts-expect-error - TypeScript doesn't know about the payload structure
            payload.new?.room_id === selectedRoomId ||
            // @ts-expect-error - TypeScript doesn't know about the payload structure
            payload.old?.room_id === selectedRoomId
          ) {
            queryClient.invalidateQueries({
              queryKey: ["events"],
            });
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, [selectedRoomId, queryClient]);

  const handleRoomSelect = (id: string) => {
    setSelectedRoomId(id);
    localStorage.setItem("selectedRoomId", id);
  };

  if (!selectedRoomId) {
    return (
      <div className="w-screen h-screen bg-white flex flex-col items-center justify-center text-black">
        <h1
          className="text-2xl mb-4"
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
            color: "#4E77E4",
          }}
        >
          Select a Room
        </h1>
        <FormControl style={{ width: "50%" }}>
          <InputLabel id="select-label">Rooms</InputLabel>
          <Select
            labelId="select-label"
            id="demo-simple-select"
            value={selectedRoomId || ""}
            label="Rooms"
            onChange={(e: SelectChangeEvent) =>
              handleRoomSelect(e.target.value as string)
            }
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={() => {
            const supabase = createClient();
            supabase.auth.signOut();
            router.push("/login");
          }}
          className={styles.logoutButton}
          style={{
            marginTop: "2rem"
          }}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");

  const todaysEvents = events
    .filter(
      (e) =>
        e.room_id === selectedRoomId &&
        dayjs(e.start_time).isAfter(today) &&
        dayjs(e.start_time).isBefore(tomorrow)
    )
    .sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time)));

  const currentEvent = todaysEvents.find(
    (e) => dayjs(e.start_time).isBefore(now) && dayjs(e.end_time).isAfter(now)
  );

  const nextEvent = todaysEvents.find((e) => dayjs(e.start_time).isAfter(now));

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center flex-col text-white`}
      style={{ backgroundColor: currentEvent ? "#EF4444" : "#1E293B" }}
      onDoubleClick={() => {
        localStorage.removeItem("selectedRoomId");
        setSelectedRoomId(null);
      }}
    >
      <h1
        className="text-4xl mb-4"
        style={{
          fontWeight: "bold",
          fontSize: "2.5rem",
        }}
      >
        {currentEvent
          ? `${dayjs(currentEvent.start_time).format("HH:mm")} - ${dayjs(
              currentEvent.end_time
            ).format("HH:mm")}`
          : nextEvent
          ? `Next: ${dayjs(nextEvent.start_time).format("HH:mm")} | ${
              nextEvent.title
            }`
          : "–"}
      </h1>
    </div>
  );
}
