import { View, Text, StyleSheet } from "react-native";

import { ChatMessage } from "@/types/ChatMessage";
import { COLORS } from "@/constants/colors";

type Props = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: Props) {
  return (
    <View
      style={[styles.container, message.isMine ? styles.mine : styles.other]}
    >
      {!message.isMine && <Text style={styles.sender}>{message.sender}</Text>}

      <Text style={[styles.text, message.isMine && styles.myText]}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
  },

  mine: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },

  other: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F2F2",
  },

  sender: {
    fontWeight: "700",
    marginBottom: 4,
  },

  text: {
    color: "#222",
  },

  myText: {
    color: "#FFF",
  },
});
