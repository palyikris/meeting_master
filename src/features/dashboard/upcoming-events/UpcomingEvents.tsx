import { Room, RoomEvent } from "@/types";
import EventCard from "./EventCard";
import styles from "./styles/upcoming/styles.module.css"
import { CircularProgress } from "@mui/material";


interface UpcomingEventProps {
  events: RoomEvent[];
  rooms: Room[];
  isLoading: boolean;
  setUpdateEventId: (id: string | null) => void;
}

const UpcomingEvents: React.FC<UpcomingEventProps> = ({
  events,
  rooms,
  isLoading,
  setUpdateEventId,
}) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>Upcoming events</h2>
        <div className={styles.separator}></div>
        <CircularProgress color="primary" size={55}></CircularProgress>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Upcoming events</h2>
      <div className={styles.separator}></div>
      <div className={styles.eventList}>
        {events.map((event) => {
          const room = rooms.find((room) => room.id === event.room_id);
          if (!room) return null;
          return (
            <EventCard
              key={event.id}
              event={event}
              room={room}
              onClick={() => setUpdateEventId(event.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;