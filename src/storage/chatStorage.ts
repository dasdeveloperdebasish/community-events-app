import AsyncStorage from "@react-native-async-storage/async-storage";

import { ChatMessage } from "@/types/ChatMessage";

const CHAT_PREFIX = "EVENT_CHAT_";

export const saveChatMessages = async (
  eventId: string,
  messages: ChatMessage[],
) => {
  try {
    await AsyncStorage.setItem(
      `${CHAT_PREFIX}${eventId}`,
      JSON.stringify(messages),
    );
  } catch (error) {
    console.log(error);
  }
};

export const getChatMessages = async (
  eventId: string,
): Promise<ChatMessage[]> => {
  try {
    const data = await AsyncStorage.getItem(`${CHAT_PREFIX}${eventId}`);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error);

    return [];
  }
};
