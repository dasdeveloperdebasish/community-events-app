import { ActivityIndicator, View } from "react-native";
import AppText from "./AppText";
import { COLORS } from "@/constants/colors";

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />

      <AppText
        style={{
          color: COLORS.textSecondary,
        }}
      >
        Loading events...
      </AppText>
    </View>
  );
}
