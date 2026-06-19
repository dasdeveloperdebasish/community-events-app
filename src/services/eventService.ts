import events from "../data/events.json";

export const getEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return events;
};
