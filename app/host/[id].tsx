import { FlatList, Image, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/common/AppText";
import EventCard from "@/components/event/EventCard";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function HostScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { state, dispatch } = useEvents();

  const hostedEvents = state.events.filter((event) => event.hostName === id);

  const host = hostedEvents[0];

  if (!host) {
    return (
      <View style={styles.center}>
        <AppText>Host not found</AppText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={hostedEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: host.hostAvatar,
                }}
                style={styles.avatar}
              />

              <AppText style={styles.name}>{host.hostName}</AppText>

              <View style={styles.badgeRow}>
                <Ionicons name="ribbon" size={16} color={COLORS.primary} />

                <AppText style={styles.badgeText}>
                  Verified Community Host
                </AppText>
              </View>

              <View style={styles.statsPill}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={COLORS.primary}
                />

                <AppText style={styles.statsText}>
                  {hostedEvents.length} Hosted Events
                </AppText>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Hosted Events</AppText>

              <AppText style={styles.sectionSubtitle}>
                Explore events organized by this host
              </AppText>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            event={{
              ...item,
              isRSVPed: state.myEvents.some((saved) => saved.id === item.id),
            }}
            onPress={() =>
              router.push({
                pathname: "/event/[id]",
                params: {
                  id: item.id,
                },
              })
            }
            onRSVPPress={() =>
              dispatch({
                type: "TOGGLE_RSVP",
                payload: item.id,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  profileCard: {
    backgroundColor: "#FFF",

    borderRadius: 24,

    alignItems: "center",

    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,

    marginBottom: SPACING.xl,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 4,
  },

  avatar: {
    width: 120,
    height: 120,

    borderRadius: 60,

    marginBottom: SPACING.md,

    borderWidth: 4,
    borderColor: "#FFF",
  },

  name: {
    fontSize: 28,
    fontWeight: "800",

    color: COLORS.text,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.sm,

    backgroundColor: "#EFF6FF",

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 999,
  },

  badgeText: {
    marginLeft: 6,

    color: COLORS.primary,

    fontWeight: "600",
    fontSize: 14,
  },

  statsPill: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.md,

    backgroundColor: "#F8FAFC",

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 999,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statsText: {
    marginLeft: 8,

    fontWeight: "600",
  },

  sectionHeader: {
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",

    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 4,

    color: COLORS.textSecondary,
  },
});
