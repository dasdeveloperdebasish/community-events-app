import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event } from "@/types/Event";

const STORAGE_KEY = "MY_EVENTS";

export const saveMyEvents = async (events: Event[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.log(error);
  }
};

export const getMyEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
