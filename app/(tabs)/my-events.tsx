import { FlatList, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Screen from "@/components/common/Screen";
import AppText from "@/components/common/AppText";
import EmptyState from "@/components/common/EmptyState";
import EventCard from "@/components/event/EventCard";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function MyEventsScreen() {
  const { state, dispatch } = useEvents();

  const now = new Date();

  const upcomingEvents = state.myEvents.filter(
    (event) => new Date(event.date) > now,
  );

  const pastEvents = state.myEvents.filter(
    (event) => new Date(event.date) <= now,
  );

  if (!state.myEvents.length) {
    return (
      <Screen>
        <EmptyState title="No RSVP Events Yet" />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={[...upcomingEvents, ...pastEvents]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <AppText style={styles.subtitle}>Your Schedule</AppText>

                <AppText style={styles.title}>My Events</AppText>

                <AppText style={styles.description}>
                  Keep track of all your RSVP'd events
                </AppText>
              </View>

              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={26} color={COLORS.primary} />
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <AppText style={styles.statNumber}>
                  {upcomingEvents.length}
                </AppText>

                <AppText style={styles.statLabel}>Upcoming</AppText>
              </View>

              <View style={styles.divider} />

              <View style={styles.statItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <AppText style={styles.statNumber}>{pastEvents.length}</AppText>

                <AppText style={styles.statLabel}>Attended</AppText>
              </View>
            </View>

            {upcomingEvents.length > 0 && (
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>Upcoming Events</AppText>

                <AppText style={styles.sectionSubtitle}>
                  Events you're planning to attend
                </AppText>
              </View>
            )}
          </>
        }
        renderItem={({ item, index }) => {
          const showPastHeader =
            index === upcomingEvents.length && pastEvents.length > 0;

          return (
            <>
              {showPastHeader && (
                <View style={styles.sectionHeader}>
                  <AppText style={styles.sectionTitle}>Past Events</AppText>

                  <AppText style={styles.sectionSubtitle}>
                    Events you've already attended
                  </AppText>
                </View>
              )}

              <EventCard
                event={{
                  ...item,
                  isRSVPed: true,
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
            </>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
  },

  description: {
    marginTop: 4,
    color: COLORS.textSecondary,
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: "#EFF6FF",

    justifyContent: "center",
    alignItems: "center",
  },

  statsCard: {
    flexDirection: "row",

    backgroundColor: "#FFF",

    borderRadius: 20,

    paddingVertical: SPACING.lg,

    marginBottom: SPACING.xl,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",

    marginTop: 6,
  },

  statLabel: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  divider: {
    width: 1,
    backgroundColor: COLORS.border,
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
