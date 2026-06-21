import { ReactNode, useEffect, useReducer } from "react";

import { EventContext } from "./EventContext";
import { eventReducer } from "./EventReducer";
import { EventState } from "./types";

import { getEvents } from "@/services/eventService";

import {
  getCreatedEvents,
  getMyEvents,
  saveCreatedEvents,
  saveMyEvents,
} from "@/storage/eventStorage";

const initialState: EventState = {
  events: [],
  myEvents: [],
  loading: true,
  error: null,
  selectedCategory: "All",
};

type Props = {
  children: ReactNode;
};

export default function EventProvider({ children }: Props) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    initializeEvents();
  }, []);

  useEffect(() => {
    saveMyEvents(state.myEvents);
  }, [state.myEvents]);

  useEffect(() => {
    const customEvents = state.events.filter((event) => event.isCustom);

    saveCreatedEvents(customEvents);
  }, [state.events]);

  const initializeEvents = async () => {
    try {
      dispatch({ type: "FETCH_START" });

      const [events, myEvents, createdEvents] = await Promise.all([
        getEvents(),
        getMyEvents(),
        getCreatedEvents(),
      ]);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: events,
      });

      dispatch({
        type: "LOAD_PERSISTED_EVENTS",
        payload: myEvents,
      });

      dispatch({
        type: "LOAD_CREATED_EVENTS",
        payload: createdEvents,
      });
    } catch {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Failed to load events",
      });
    }
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
