import { getUserProfileFromRequest } from "@/lib/auth/get_user_profile";
import { createClient } from "@/lib/supabase/server";
import { RoomEvent } from "@/types";
import { NextRequest } from "next/server";
import { RRule } from "rrule";

export async function GET() {
  const userProfile = await getUserProfileFromRequest();
  const supabase = await createClient();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" && userProfile.role !== "admin")
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }

  if (!userProfile.company_id) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404
    });
  }

  const { data: rooms, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("company_id", userProfile.company_id);

  if (roomError) {
    console.error("Error fetching rooms:", roomError);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  const roomIds = rooms.map((room) => room.id);

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .in("room_id", roomIds);

  if (error) {
    console.error("Error fetching events:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  const allOccurrences: RoomEvent[] = [];

  for (const event of events) {
    const {
      id,
      room_id,
      title,
      start_time,
      end_time,
      recurrence_rule,
      recurrence_exceptions
    } = event;

    if (!recurrence_rule) {
      allOccurrences.push({
        id,
        room_id,
        title,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time).toISOString(),
        created_at: new Date(event.created_at).toISOString(),
        background_color: event.background_color
      });
    } else {
      const rule = RRule.fromString(recurrence_rule);
      const occurrences = rule.all(); // You could add a count or date limit here if needed

      const exceptions = (recurrence_exceptions || []) as string[];

      for (const occ of occurrences) {
        const iso = occ.toISOString().split("T")[0];
        if (exceptions.includes(iso)) continue;

        const duration =
          new Date(end_time).getTime() - new Date(start_time).getTime();

        allOccurrences.push({
          id: `${id}_${iso}`,
          room_id,
          title,
          start_time: occ.toISOString(),
          end_time: new Date(occ.getTime() + duration).toISOString(),
          created_at: new Date(event.created_at).toISOString(),
          background_color: event.background_color
        });
      }
    }
  }

  allOccurrences.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return new Response(JSON.stringify(allOccurrences), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST(request: NextRequest) {
  const userProfile = await getUserProfileFromRequest();
  const supabase = await createClient();

  if (
    !userProfile ||
    !userProfile.role ||
    (userProfile.role !== "company_admin" && userProfile.role !== "admin")
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401
    });
  }

  if (!userProfile.company_id) {
    return new Response(JSON.stringify({ error: "Company not found." }), {
      status: 404
    });
  }

  const body = await request.json();
  const {
    room_id,
    title,
    start_time,
    end_time,
    recurrence_rule,
    background_color,
    recurrence_exceptions
  } = body;

  if (!room_id || !title || !start_time || !end_time) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400
    });
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      room_id,
      title,
      start_time,
      end_time,
      recurrence_rule,
      recurrence_exceptions: recurrence_exceptions,
      background_color,
      created_at: new Date().toISOString()
    })
    .select("*");

  if (error) {
    console.error("Error creating event:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }

  return new Response(JSON.stringify(data[0]), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}