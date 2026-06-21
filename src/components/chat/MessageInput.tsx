import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { COLORS } from "@/constants/colors";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export default function MessageInput({ value, onChangeText, onSend }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        style={styles.input}
      />

      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Text style={styles.sendText}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  sendText: {
    color: "#FFF",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 48,
  },
});
