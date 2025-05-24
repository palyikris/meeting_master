import React, { useState } from "react";
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
  EventInput
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { RoomEvent } from "@/types";


interface MainCalendarProps {
  focusedDate: Date;
  isLoading: boolean;
  events: RoomEvent[];
  setEvents: (events: RoomEvent[]) => void;
}

function MainCalendar(props: MainCalendarProps) {

  const { focusedDate, isLoading, events, setEvents } = props;
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const newEvent: EventInput = {
        id: String(new Date().getTime()), // Unique ID based on current timestamp
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };

      calendarApi.addEvent(newEvent);
      const newRoomEvent: RoomEvent = {
        id: newEvent.id || "",
        title: newEvent.title || "",
        start_time: newEvent.start?.toString() || "",
        end_time: newEvent.end ? newEvent.end.toString() : newEvent.start?.toString() || "",
        created_at: new Date().toISOString(),
        room_id: "default_room" // Assuming a default room ID, replace with actual logic if needed
      };
      setEvents((prevEvents) => [...prevEvents, newRoomEvent]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events: EventApi[]) => {
    const updatedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      start_time: event.start?.toISOString(),
      end_time: event.end ? event.end.toISOString() : event.start?.toISOString(),
      created_at: new Date().toISOString() // Assuming created_at is the current time
    })) as RoomEvent[];

    setEvents(updatedEvents);
    setCurrentEvents(
      events
    );
  };

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={false}
          events={events}
          initialDate={focusedDate}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          timeZone="Europe/Budapest"
          dayHeaderFormat={{ weekday: "long" }}
          slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit"
          }}
          slotDuration="00:20:00"
          height={"auto"}
          themeSystem="bootstrap5"
          eventColor="#4E77E4"
          eventTextColor="#ffffff"
        />
      </div>
    </div>
  );
}



function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  );
}


export default MainCalendar;
