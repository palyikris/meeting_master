import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./styles/styles.module.css";
import { z } from "zod";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room, RoomEvent } from "@/types";
import { useAddEvent } from "@/hooks/event/useAddEvent";
import { Box } from "@mui/material";
import { useDeleteEvent } from "@/hooks/event/useDeleteEvent";
import { useUpdateEvent } from "@/hooks/event/useUpdateEvent";

function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function localToUTC(local: string) {
  if (!local) return "";
  // local is in 'YYYY-MM-DDTHH:mm' format
  const date = new Date(local);
  return date.toISOString();
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date",
  }),
  end_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date",
  }),
  room_id: z.string().min(1, "Room ID is required"),
  recurrence_rule: z.string().optional(),
  recurrence_exceptions: z.array(z.date()).optional(),
  background_color: z.string(),
});

interface EventAdderProps {
  selectInfo: DateSelectArg | null;
  setSelectInfo: (selectInfo: DateSelectArg | null) => void;
  updateEvent: RoomEvent | null;
  setUpdateEventId: (id: string | null) => void;
  rooms: Room[] | null;
}

const EventAdder = (props: EventAdderProps) => {
  const { selectInfo, setSelectInfo, updateEvent, setUpdateEventId, rooms } =
    props;

  const {
    mutate: createEvent,
    isPending: isCreateEventPending,
    isSuccess: isCreateEventSuccess,
  } = useAddEvent();
  const {
    mutate: deleteEvent,
    isPending: isDeleteEventPending,
    isSuccess: isDeleteEventSuccess,
  } = useDeleteEvent();
  const {
    mutate: updateEventFunction,
    isPending: isUpdateEventPending,
    isSuccess: isUpdateEventSuccess,
  } = useUpdateEvent();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const {
      title,
      start_time,
      end_time,
      room_id,
      recurrence_rule,
      background_color,
    } = data;

    if (updateEvent) {
      // Update existing event
      updateEventFunction({
        id: updateEvent.id,
        title,
        start_time: localToUTC(start_time),
        end_time: localToUTC(end_time),
        room_id,
        recurrence_rule,
        recurrence_exceptions: [],
        background_color,
      });
      if (isUpdateEventSuccess) {
        setUpdateEventId(null);
      }
      return;
    }

    createEvent({
      title,
      start_time: localToUTC(start_time),
      end_time: localToUTC(end_time),
      room_id,
      recurrence_rule,
      background_color,
    });
    if (isCreateEventSuccess) {
      setSelectInfo(null);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: updateEvent?.title || "",
      start_time: updateEvent
        ? toDatetimeLocal(updateEvent.start_time)
        : toDatetimeLocal(selectInfo?.start.toISOString()),
      end_time: updateEvent
        ? toDatetimeLocal(updateEvent.end_time)
        : toDatetimeLocal(selectInfo?.end.toISOString()),
      room_id: updateEvent?.room_id || "",
      recurrence_rule: updateEvent?.recurrence_rule || "",
      recurrence_exceptions: [],
      background_color: updateEvent?.background_color || "#4E77E4",
    },
  });

  useEffect(() => {
    if (updateEvent) {
      form.reset({
        title: updateEvent.title || "",
        start_time: updateEvent
          ? toDatetimeLocal(updateEvent.start_time)
          : toDatetimeLocal(selectInfo?.start.toISOString()),
        end_time: updateEvent
          ? toDatetimeLocal(updateEvent.end_time)
          : toDatetimeLocal(selectInfo?.end.toISOString()),
        room_id: updateEvent.room_id || "",
        recurrence_rule: updateEvent.recurrence_rule || "",
        recurrence_exceptions: [],
        background_color: updateEvent.background_color || "#4E77E4",
      });
    } else {
      form.reset({
        title: "",
        start_time: toDatetimeLocal(selectInfo?.start.toISOString()) || "",
        end_time: toDatetimeLocal(selectInfo?.end.toISOString()) || "",
        room_id: "",
        recurrence_rule: "",
        recurrence_exceptions: [],
        background_color: "#4E77E4",
      });
    }
  }, [updateEvent, selectInfo, form]);

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <h2 className={styles.header}>Add a new Event</h2>
          <div className={styles.separator}></div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title"
                    {...field}
                    type="text"
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "100%",
                      height: "3em",
                      padding: "0.5rem",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "100%",
                      height: "3em",
                      padding: "0.5rem",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "100%",
                      height: "3em",
                      padding: "0.5rem",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="room_id"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "100%",
                        height: "3em",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "auto",
                        height: "auto",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectGroup>
                        <SelectLabel
                          style={{
                            color: "#8892B0",
                            width: "100%",
                            padding: "0.5rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          Rooms
                        </SelectLabel>
                        {rooms?.map((room) => (
                          <SelectItem
                            key={room.id}
                            value={room.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0.5rem 0",
                              width: "100%",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(136,146,176,.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="background_color"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>Background color</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "100%",
                        height: "3em",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "auto",
                        height: "auto",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectGroup>
                        <SelectLabel
                          style={{
                            color: "#8892B0",
                            width: "100%",
                            padding: "0.5rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          Colors
                        </SelectLabel>
                        <SelectItem
                          value="#4E77E4"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#4E77E4",
                              width: "1.5em",
                              height: "1.5em",
                              borderRadius: "50%",
                            }}
                          ></span>
                        </SelectItem>
                        <SelectItem
                          value="#FBCB0A"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#FBCB0A",
                              width: "1.5em",
                              height: "1.5em",
                              borderRadius: "50%",
                            }}
                          ></span>
                        </SelectItem>
                        <SelectItem
                          value="#EF4444"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#EF4444",
                              width: "1.5em",
                              height: "1.5em",
                              borderRadius: "50%",
                            }}
                          ></span>
                        </SelectItem>
                        <SelectItem
                          value="#10B981"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#10B981",
                              width: "1.5em",
                              height: "1.5em",
                              borderRadius: "50%",
                            }}
                          ></span>
                        </SelectItem>
                        <SelectItem
                          value="#FF5C8D"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#FF5C8D",
                              width: "1.5em",
                              height: "1.5em",
                              borderRadius: "50%",
                            }}
                          ></span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="recurrence_rule"
            render={({ field }) => (
              <FormItem
                style={{
                  margin: ".5rem 0",
                }}
              >
                <FormLabel>Recurrence Rule (optional)</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue=""
                  >
                    <SelectTrigger
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "100%",
                        height: "3em",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectValue placeholder="Select recurrence" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        border: "2px solid #4E77E4",
                        borderRadius: "5px",
                        width: "auto",
                        height: "auto",
                        padding: "0.5rem",
                      }}
                    >
                      <SelectGroup>
                        <SelectLabel
                          style={{
                            color: "#8892B0",
                            width: "100%",
                            padding: "0.5rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          Recurrence
                        </SelectLabel>
                        <SelectItem
                          value="FREQ=DAILY;INTERVAL=1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          Daily
                        </SelectItem>
                        <SelectItem
                          value="FREQ=WEEKLY;INTERVAL=1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          Weekly
                        </SelectItem>
                        <SelectItem
                          value="FREQ=MONTHLY;INTERVAL=1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          Monthly
                        </SelectItem>
                        <SelectItem
                          value="FREQ=YEARLY;INTERVAL=1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 0",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(136,146,176,.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          Yearly
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            {!updateEvent && (
              <Button type="submit" className={styles.submitButton}>
                {isCreateEventPending ? "Adding Event..." : "Add Event"}
              </Button>
            )}
            {updateEvent && (
              <Button
                type="submit"
                className={styles.submitButton}
                style={{
                  width: "49%",
                  fontSize: "1rem",
                }}
              >
                {isUpdateEventPending ? "Updating Event..." : "Update Event"}
              </Button>
            )}
            {updateEvent && (
              <Button
                type="button"
                className={styles.submitButton}
                style={{
                  width: "49%",
                  fontSize: "1rem",
                }}
                onClick={() => {
                  if (updateEvent) {
                    deleteEvent({ id: updateEvent.id });
                    if (isDeleteEventSuccess) {
                      setUpdateEventId(null);
                      setSelectInfo(null);
                    }
                  }
                }}
              >
                {isDeleteEventPending ? "Deleting Event..." : "Delete Event"}
              </Button>
            )}
          </Box>
        </form>
      </Form>
    </div>
  );
};

export default EventAdder;
