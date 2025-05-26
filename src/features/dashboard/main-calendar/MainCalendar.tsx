import React from "react";
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { RoomEvent } from "@/types";
import { convertRoomEventToEventInput } from "@/lib/dashboard/utils";
import { Box, CircularProgress } from "@mui/material";
import "./styles/style.css";

interface MainCalendarProps {
  focusedDate: Date;
  isLoading: boolean;
  events: RoomEvent[];
  selectInfo: DateSelectArg | null;
  setSelectInfo: (selectInfo: DateSelectArg | null) => void;
}

function MainCalendar(props: MainCalendarProps) {
  const { focusedDate, isLoading, events, setSelectInfo } = props;

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    setSelectInfo(selectInfo);

    // const title = prompt("Please enter a new title for your event");

    // if (title) {
    //   const newEvent: EventInput = {
    //     id: String(new Date().getTime()), // Unique ID based on current timestamp
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   };

    //   calendarApi.addEvent(newEvent);
    // }
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

  const handleEventDrop = (eventDropInfo: EventClickArg) => {
    const updatedEvent = eventDropInfo.event;
    console.log("Event dropped:", updatedEvent.title, updatedEvent.start);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: isLoading ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress color="primary" size={60}></CircularProgress>
        </Box>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={false}
          events={events.map(convertRoomEventToEventInput)}
          initialDate={focusedDate}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
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
          datesSet={(dateInfo) => {
            console.log("Current date range:", dateInfo.start, dateInfo.end);
          }}
          eventBackgroundColor="rgba(78, 119, 228, 0.3)"
          eventTextColor="#4E77E4"
          eventBorderColor="transparent"
        />
      </div>
    </div>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: "10px",
        paddingTop: "5px"
      }}
    >
      <b
        style={{
          marginBottom: "5px",
          fontSize: "1.2em"
        }}
      >
        {eventContent.event.title}
      </b>
      <i
        style={{
          fontSize: "1.05em"
        }}
      >
        {eventContent.timeText}
      </i>
    </Box>
  );
}

export default MainCalendar;
