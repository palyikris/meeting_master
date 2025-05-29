"use client"

import { Room, RoomEvent, UserProfile } from "@/types";
import { useEffect, useState } from "react";
import MainCalendar from "../../features/dashboard/main-calendar/MainCalendar";
import { useEvents } from "@/hooks/event/useEvents";
import { Box, Grid } from "@mui/material";
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
import RoomAdder from "@/features/dashboard/room_adder/RoomAdder";

export default function DashboardPage() {
  const [focusedDate] = useState(new Date());
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const { data, isLoading, error } = useEvents();
  const [selectInfo, setSelectInfo] = useState<DateSelectArg | null>(null);
  const [updateEventId, setUpdateEventId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { data: fetchedRooms } = useRooms();
  const [rooms, setRooms] = useState<Room[] | null>([]);
  const [isRoomAdderDisplayed, setIsRoomAdderDisplayed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (fetchedRooms) {
      setRooms(fetchedRooms);
    }
  }, [fetchedRooms]);

  useEffect(() => {
    const fetcher = async () => {
      const supabase = createClient();
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user profile:", error);
        router.push("/login");
        return;
      }
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        setUserProfile(profile);
      } else {
        router.push("/login");
      }
    };

    fetcher();
  }, []);

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
        {userProfile && userProfile.role === "company_admin" && (
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
        )}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: 2,
            margin: "0 1rem",
            marginTop:
              userProfile && userProfile.role === "company_admin"
                ? "0"
                : "2rem",
            overflowX: "hidden",
            boxShadow: "rgba(78,119,228, 0.3) 0px 2px 8px 0px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {isRoomAdderDisplayed ? (
            <RoomAdder
              setIsRoomAdderDisplayed={setIsRoomAdderDisplayed}
            ></RoomAdder>
          ) : (
            <Grid container spacing={2}>
              <Grid
                size={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={"/logo.png"}
                  width={150}
                  height={75}
                  alt="Meeting master logo"
                ></Image>
              </Grid>
              <Grid
                size={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  className={styles.logoutButton}
                  onClick={() => setIsRoomAdderDisplayed(true)}
                >
                  Add Room
                </Button>
              </Grid>
              <Grid
                size={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
              </Grid>
            </Grid>
          )}
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
              .slice(0, userProfile?.role === "company_admin" ? 2 : 6)}
            rooms={rooms || []}
            isLoading={isLoading}
            setUpdateEventId={setUpdateEventId}
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