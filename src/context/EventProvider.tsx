import { ReactNode, useEffect, useReducer } from "react";

import { EventContext } from "./EventContext";
import { eventReducer } from "./EventReducer";
import { EventState } from "./types";

import {
  getCreatedEvents,
  getMyEvents,
  saveCreatedEvents,
  saveMyEvents,
} from "@/storage/eventStorage";

const initialState: EventState = {
  events: [],
  myEvents: [],
  loading: false,
  error: null,
  selectedCategory: "All",
};

type Props = {
  children: ReactNode;
};

export default function EventProvider({ children }: Props) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    loadPersistedEvents();
    loadCreatedEvents();
  }, []);

  useEffect(() => {
    saveMyEvents(state.myEvents);
  }, [state.myEvents]);

  useEffect(() => {
    const customEvents = state.events.filter((event) => event.isCustom);

    saveCreatedEvents(customEvents);
  }, [state.events]);
  const loadPersistedEvents = async () => {
    const events = await getMyEvents();

    dispatch({
      type: "LOAD_PERSISTED_EVENTS",
      payload: events,
    });
  };

  const loadCreatedEvents = async () => {
    const events = await getCreatedEvents();

    dispatch({
      type: "LOAD_CREATED_EVENTS",
      payload: events,
    });
  };
  return (
    <EventContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
