import { ReactNode, useEffect, useReducer } from "react";

import { EventContext } from "./EventContext";
import { eventReducer } from "./EventReducer";

import { getMyEvents, saveMyEvents } from "@/storage/eventStorage";

const initialState = {
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
  }, []);

  useEffect(() => {
    saveMyEvents(state.myEvents);
  }, [state.myEvents]);

  const loadPersistedEvents = async () => {
    const events = await getMyEvents();

    dispatch({
      type: "LOAD_PERSISTED_EVENTS",
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
