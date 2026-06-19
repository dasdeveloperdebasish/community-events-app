import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import { COLORS } from "@/constants/colors";

type Props = {
  title: string;
};

export default function EmptyState({ title }: Props) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 80,
        paddingHorizontal: 24,
      }}
    >
      <Ionicons name="calendar-outline" size={72} color={COLORS.border} />

      <AppText
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginTop: 16,
        }}
      >
        {title}
      </AppText>

      <AppText
        style={{
          marginTop: 8,
          textAlign: "center",
          color: COLORS.textSecondary,
        }}
      >
        Check back later for new community events.
      </AppText>
    </View>
  );
}
