import { eventReducer } from "../EventReducer";
import { EventState } from "../types";

import { Event } from "@/types/Event";

const mockEvent: Event = {
  id: "evt-001",
  title: "Dubai Tech Meetup",
  category: "Tech",
  description: "Test event",
  date: "2026-09-15T18:00:00Z",
  location: "Dubai",
  attendeeCount: 100,
  hostName: "GDG Dubai",
  hostAvatar: "avatar.jpg",
  imageUrl: "image.jpg",
  isRSVPed: false,
};

describe("eventReducer", () => {
  const initialState: EventState = {
    events: [mockEvent],
    myEvents: [],
    selectedCategory: "All",
    loading: false,
    error: null,
  };

  it("should add RSVP event to myEvents", () => {
    const state = eventReducer(initialState, {
      type: "TOGGLE_RSVP",
      payload: "evt-001",
    });

    expect(state.myEvents).toHaveLength(1);
    expect(state.events[0].isRSVPed).toBe(true);
    expect(state.events[0].attendeeCount).toBe(101);
  });

  it("should remove RSVP event from myEvents", () => {
    const rsvpedState = eventReducer(initialState, {
      type: "TOGGLE_RSVP",
      payload: "evt-001",
    });

    const state = eventReducer(rsvpedState, {
      type: "TOGGLE_RSVP",
      payload: "evt-001",
    });

    expect(state.myEvents).toHaveLength(0);
    expect(state.events[0].isRSVPed).toBe(false);
    expect(state.events[0].attendeeCount).toBe(100);
  });

  it("should set selected category", () => {
    const state = eventReducer(initialState, {
      type: "SET_CATEGORY",
      payload: "Tech",
    });

    expect(state.selectedCategory).toBe("Tech");
  });

  it("should handle fetch start", () => {
    const state = eventReducer(initialState, {
      type: "FETCH_START",
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});
