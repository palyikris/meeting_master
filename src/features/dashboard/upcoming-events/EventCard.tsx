import { Room, RoomEvent } from "@/types";
import styles from "./styles/card/styles.module.css"


interface EventCardProps {
  event: RoomEvent;
  room: Room;
  onClick: () => void;
}
const EventCard: React.FC<EventCardProps> = ({ event, room, onClick }) => {
  return (
    <div
      className={styles.eventCard}
      style={{
        borderLeftColor: event.background_color ?? "#4E77E4",
      }}
      onClick={onClick}
    >
      <h3 className={styles.cardHeader}>{event.title}</h3>
      <p className={styles.dateTime}>
        {new Date(event.start_time).toLocaleString("hu-HU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(event.end_time).toLocaleString("hu-HU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {(() => {
          const now = new Date();
          const start = new Date(event.start_time);
          const diff = start.getTime() - now.getTime();

          if (diff <= 0)
            return <span style={{ color: "#888" }}> (véget ért)</span>;

          const minutes = Math.floor(diff / (1000 * 60)) % 60;
          const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));

          return (
            <span style={{ marginLeft: ".5rem" }}>
              {" ("}
              {days > 0 && (
                <span style={{ color: "#4E77E4" }}>+ {days} days </span>
              )}
              {hours > 0 && days <= 0 && (
                <span style={{ color: "#FBCB0A" }}>+ {hours} hours </span>
              )}
              {minutes > 0 && days <= 0 && hours <= 0 && (
                <span style={{ color: "#EF4444" }}>+ {minutes} mins</span>
              )}
              {")"}
            </span>
          );
        })()}
      </p>
      <p
        className={styles.room}
        style={{
          color: event.background_color ?? "#4E77E4",
        }}
      >
        {room.name}
      </p>
    </div>
  );
};

export default EventCard;