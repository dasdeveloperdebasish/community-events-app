import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function AppButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,

    minHeight: 48,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 14,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
  },

  text: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
