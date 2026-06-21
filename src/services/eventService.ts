import { Event } from "@/types/Event";
import events from "../data/events.json";

export const getEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return events as Event[];
};
