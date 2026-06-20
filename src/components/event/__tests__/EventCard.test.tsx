import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import EventCard from "../EventCard";
import { Event } from "@/types/Event";

const mockEvent: Event = {
  id: "evt-001",
  title: "Dubai Tech Meetup",
  category: "Tech",
  description: "Test event",
  date: "2026-09-15T18:00:00Z",
  location: "Dubai Internet City",
  attendeeCount: 142,
  hostName: "GDG Dubai",
  hostAvatar: "avatar.jpg",
  imageUrl: "image.jpg",
  isRSVPed: false,
};

describe("EventCard", () => {
  it("renders event information", async () => {
    const { getByText } = await render(
      <EventCard
        event={mockEvent}
        onPress={jest.fn()}
        onRSVPPress={jest.fn()}
      />,
    );

    expect(getByText("Dubai Tech Meetup")).toBeTruthy();
    expect(getByText("142 Attendees")).toBeTruthy();
    expect(getByText("RSVP Event")).toBeTruthy();
  });

  it("calls RSVP handler", async () => {
    const onRSVPPress = jest.fn();

    const { getByText } = await render(
      <EventCard
        event={mockEvent}
        onPress={jest.fn()}
        onRSVPPress={onRSVPPress}
      />,
    );

    fireEvent.press(getByText("RSVP Event"));

    expect(onRSVPPress).toHaveBeenCalledTimes(1);
  });
});
