import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles/styles.module.css"


const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

interface RoomAdderProps {
  setIsRoomAdderDisplayed: (isDisplayed: boolean) => void;
}

const RoomAdder = (props: RoomAdderProps) => {

  const { setIsRoomAdderDisplayed } = props;

  const { mutate: createRoom, isPending: isCreateRoomPending} = useCreateRoom();
  
  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    createRoom({ name: data.name });
    setIsRoomAdderDisplayed(false);
    form.reset();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter a room name"
                    {...field}
                    style={{
                      border: "2px solid #4E77E4",
                      borderRadius: "5px",
                      width: "100%",
                      height: "3em",
                      padding: "0.5rem",
                    }}
                    disabled={isCreateRoomPending}
                  ></Input>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <Button
            type="submit" 
            className={styles.submitButton}
          >
            {isCreateRoomPending ? "Creating Room..." : "Create Room"}
          </Button>
          <Button 
            type="button" 
            className={styles.submitButton}
            onClick={() => setIsRoomAdderDisplayed(false)}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </Box>
  );
}

export default RoomAdder;