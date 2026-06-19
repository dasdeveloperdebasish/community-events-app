import { createContext } from "react";
import { EventAction, EventState } from "./types";

type EventContextType = {
  state: EventState;
  dispatch: React.Dispatch<EventAction>;
};

export const EventContext = createContext<EventContextType | null>(null);
