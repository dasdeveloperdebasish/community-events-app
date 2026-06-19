import { useEvents } from "./useEvents";

export const useEvent = (id: string) => {
  const { state } = useEvents();

  return state.events.find((event) => event.id === id);
};
