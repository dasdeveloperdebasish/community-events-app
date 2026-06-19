import { Category, Event } from "@/types/Event";

export interface EventState {
  events: Event[];

  myEvents: Event[];

  loading: boolean;

  error: string | null;

  selectedCategory: Category | "All";
}

export type EventAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: Event[];
    }
  | {
      type: "FETCH_ERROR";
      payload: string;
    }
  | {
      type: "TOGGLE_RSVP";
      payload: string;
    }
  | {
      type: "SET_CATEGORY";
      payload: Category | "All";
    }
  | {
      type: "LOAD_PERSISTED_EVENTS";
      payload: Event[];
    };
