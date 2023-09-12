import { Box, Card, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TimezoneSelector from "../TimezoneSelector";
import { Events, Timezones } from "../../services/EventsService";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import Timetable from "../TimeTable";
import { useEffect, useState } from "react";

const eventsState = atom<Events>({ key: "events" });
const timezonesState = atom<Timezones>({ key: "timezones" });

// select events keys
const eventsKeysState = selector({
  key: "eventsKeys",
  get: ({ get }) => {
    const events = get(eventsState) as Events;
    return Object.keys(events).map(Number);
  },
});

// Returns hooks for managing participants
export function useParticipants() {
  const eventsKeys = useRecoilValue(eventsKeysState);
  const setEvents = useSetRecoilState(eventsState);
  const setTimezones = useSetRecoilState(timezonesState);

  function addNewParticipant() {
    setEvents((events: Events) => ({
      ...events,
      [(eventsKeys?.at(-1) ?? 0) + 1]: [],
    }));
  }

  function removeParticipant(id: number = 0) {
    setEvents((events: Events) => {
      const newEvents = { ...events };
      delete newEvents[id];
      return newEvents;
    });
    setTimezones((timezones) => {
      const newTimezones = { ...timezones };
      delete newTimezones[id];
      return newTimezones;
    });
  }

  return {
    addNewParticipant,
    removeParticipant,
    participants: eventsKeys,
  };
}

// Component representing each participant in the scheduling process
export default function Participant({ id }: { id: number }) {
  const { removeParticipant } = useParticipants();
  const [currentTime, setCurrentTime] = useState(new Date());
  const timezones = useRecoilValue(timezonesState);

  useEffect(() => {
    setInterval(() => setCurrentTime(new Date()), 3000);
  }, []);

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "auto",
      }}
    >
      <Box width="300px" padding={2} display="flex" flexDirection="column">
        <Box
          color="#1565c0"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingBottom="0.5rem"
        >
          {timezones[id] && (
            <Typography variant="h5">
              {currentTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: timezones[id],
              })}
            </Typography>
          )}
          <IconButton         
            className="delete-participant-button"
            onClick={() => removeParticipant(id)}
          >
            <DeleteForeverIcon style={{ color: "#EC407A" }} fontSize="medium" />
          </IconButton>
        </Box>
        <Box 
          className="timezone-selector"
          pb={2}
        >
          <TimezoneSelector id={id} />
        </Box>
        <Box className="timetable-container" >
          <Timetable id={id} />
        </Box>
      </Box>
    </Card>
  );
}
