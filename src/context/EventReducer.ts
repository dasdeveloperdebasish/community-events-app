import { EventAction, EventState } from "./types";

export const eventReducer = (
  state: EventState,
  action: EventAction,
): EventState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        events: action.payload,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case "LOAD_PERSISTED_EVENTS":
      return {
        ...state,
        myEvents: action.payload,
      };

    case "TOGGLE_RSVP": {
      const eventId = action.payload;

      const updatedEvents = state.events.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        const isRSVPed = !event.isRSVPed;

        return {
          ...event,
          isRSVPed,
          attendeeCount: isRSVPed
            ? event.attendeeCount + 1
            : event.attendeeCount - 1,
        };
      });

      const updatedEvent = updatedEvents.find((event) => event.id === eventId);

      if (!updatedEvent) {
        return state;
      }

      const alreadyInMyEvents = state.myEvents.some(
        (event) => event.id === eventId,
      );

      return {
        ...state,
        events: updatedEvents,

        myEvents: alreadyInMyEvents
          ? state.myEvents.filter((event) => event.id !== eventId)
          : [...state.myEvents, updatedEvent],
      };
    }

    default:
      return state;
  }
};
