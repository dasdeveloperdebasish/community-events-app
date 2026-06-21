import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import ChatBubble from "@/components/chat/ChatBubble";
import MessageInput from "@/components/chat/MessageInput";
import { getChatMessages, saveChatMessages } from "@/storage/chatStorage";
import { ChatMessage } from "@/types/ChatMessage";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "@/components/common/AppText";

const defaultMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "John",
    text: "Looking forward to this event!",
    createdAt: new Date().toISOString(),
    isMine: false,
  },
  {
    id: "2",
    sender: "Sarah",
    text: "Can't wait 🚀",
    createdAt: new Date().toISOString(),
    isMine: false,
  },
];

const autoReplies = [
  "See you there! 👋",
  "Looking forward to meeting everyone!",
  "Can't wait for this event 🚀",
  "This one looks exciting!",
  "Who's joining from nearby?",
  "Really interested in this topic.",
  "Looking forward to the discussions!",
  "Hope to meet some new people there.",
];

export default function ChatScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const listRef = useRef<FlatList>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const insets = useSafeAreaInsets();

  const scrollToBottom = () => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    loadMessages();

    const onShow = (e: KeyboardEvent) => {
      const kbHeight = e.endCoordinates.height;
      setKeyboardOffset(kbHeight);
      scrollToBottom();
    };

    const onHide = () => setKeyboardOffset(0);

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const loadMessages = async () => {
    const storedMessages = await getChatMessages(eventId);
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      setMessages(defaultMessages);
      await saveChatMessages(eventId, defaultMessages);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: input.trim(),
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    await saveChatMessages(eventId, updatedMessages);
    setInput("");

    timeoutRef.current = setTimeout(() => {
      const randomReply =
        autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const randomSender = Math.random() > 0.5 ? "John" : "Sarah";

      const reply: ChatMessage = {
        id: `${Date.now()}-reply`,
        sender: randomSender,
        text: randomReply,
        createdAt: new Date().toISOString(),
        isMine: false,
      };

      setMessages((prev) => {
        const next = [...prev, reply];
        saveChatMessages(eventId, next);
        return next;
      });
    }, 2000);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          marginBottom: keyboardOffset || insets.bottom,
        },
      ]}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <AppText style={styles.chatTitle}>Event Discussion</AppText>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />

      <MessageInput
        value={input}
        onChangeText={setInput}
        onSend={sendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  messages: {
    padding: 16,
    paddingBottom: 24,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  backIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
});
