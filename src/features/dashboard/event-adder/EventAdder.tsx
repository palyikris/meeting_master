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

import { z } from "zod";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date"
  }),
  end_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date"
  }),
  room_id: z.string().min(1, "Room ID is required"),
  recurrence_rule: z.string().optional(),
  recurrence_exceptions: z.array(z.date()).optional(),
  background_color: z.string()
});

interface EventAdderProps {
  selectInfo: DateSelectArg | null;
  setSelectInfo: (selectInfo: DateSelectArg | null) => void;
}

const EventAdder = (props: EventAdderProps) => {
  const { selectInfo } = props;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start_time: selectInfo?.startStr,
      end_time: selectInfo?.endStr,
      room_id: "",
      recurrence_rule: "",
      recurrence_exceptions: [],
      background_color: "#4E77E4"
    }
  });

  useEffect(() => {
    form.reset({
      title: "",
      start_time: selectInfo?.startStr,
      end_time: selectInfo?.endStr,
      room_id: "",
      recurrence_rule: "",
      recurrence_exceptions: [],
      background_color: "#4E77E4"
    });
  }, [selectInfo, form]);


  return (
    <div>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event title"
                    {...field}
                    type="text"
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "20em",
                      height: "3em",
                      padding: "0.5rem"
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
              <FormItem>
                <FormLabel>
                  Start Time (Change this on the Main Calendar)
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "20em",
                      height: "3em",
                      padding: "0.5rem",
                      opacity: 0.6,
                      borderStyle: "dashed"
                    }}
                    disabled
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
              <FormItem>
                <FormLabel>
                  End Time (Change this on the Main Calendar)
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "20em",
                      height: "3em",
                      padding: "0.5rem",
                      opacity: 0.6,
                      borderStyle: "dashed"
                    }}
                    disabled
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
              <FormItem>
                <FormLabel>Room ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter room ID"
                    {...field}
                    type="text"
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "20em",
                      height: "3em",
                      padding: "0.5rem"
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="recurrence_rule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence Rule (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. FREQ=DAILY;INTERVAL=1"
                    {...field}
                    type="text"
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "20em",
                      height: "3em",
                      padding: "0.5rem"
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Add Event</Button>
        </form>
      </Form>
    </div>
  );
};

export default EventAdder;
