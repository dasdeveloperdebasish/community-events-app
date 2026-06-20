import { View, Image, StyleSheet } from "react-native";

import AppText from "@/components/common/AppText";
import { COLORS } from "@/constants/colors";

type Props = {
  attendeeCount: number;
};

export default function AttendeeAvatars({ attendeeCount }: Props) {
  const visibleAttendees = Math.min(attendeeCount, 5);

  const avatars = Array.from(
    { length: visibleAttendees },
    (_, index) => `https://i.pravatar.cc/150?img=${index + 20}`,
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarGroup}>
        {avatars.map((avatar, index) => (
          <Image
            key={index}
            source={{
              uri: avatar,
            }}
            style={[
              styles.avatar,
              {
                marginLeft: index === 0 ? 0 : -10,
              },
            ]}
          />
        ))}
      </View>

      {attendeeCount > 5 && (
        <AppText style={styles.countText}>+{attendeeCount - 5}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
  },

  avatarGroup: {
    flexDirection: "row",
  },

  avatar: {
    width: 34,
    height: 34,

    borderRadius: 17,

    borderWidth: 2,
    borderColor: "#FFF",
  },

  countText: {
    marginLeft: 10,

    color: COLORS.textSecondary,

    fontWeight: "600",
  },
});
