import { useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

import Screen from "@/components/common/Screen";
import AppText from "@/components/common/AppText";
import EmptyState from "@/components/common/EmptyState";
import EventCard from "@/components/event/EventCard";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function MyEventsScreen() {
  const { state, dispatch } = useEvents();
  const { width } = useWindowDimensions();

  const numColumns = width >= 900 ? 2 : 1;

  const horizontalGap = 16;

  const cardWidth = numColumns === 2 ? (width - horizontalGap - 32) / 2 : width;

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const now = new Date();

  const upcomingEvents = state.myEvents.filter(
    (event) => new Date(event.date) > now,
  );

  const pastEvents = state.myEvents.filter(
    (event) => new Date(event.date) <= now,
  );

  const events = activeTab === "upcoming" ? upcomingEvents : pastEvents;

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
        data={events}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <AppText style={styles.title}>My Events</AppText>

              <AppText style={styles.subtitle}>
                {state.myEvents.length} Saved Events
              </AppText>
            </View>

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "upcoming" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("upcoming")}
              >
                <AppText
                  style={[
                    styles.tabText,
                    activeTab === "upcoming" && styles.activeTabText,
                  ]}
                >
                  Upcoming ({upcomingEvents.length})
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === "past" && styles.activeTab]}
                onPress={() => setActiveTab("past")}
              >
                <AppText
                  style={[
                    styles.tabText,
                    activeTab === "past" && styles.activeTabText,
                  ]}
                >
                  Past ({pastEvents.length})
                </AppText>
              </TouchableOpacity>
            </View>

            {events.length > 0 && (
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>
                  {activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}
                </AppText>

                <AppText style={styles.sectionSubtitle}>
                  {activeTab === "upcoming"
                    ? "Events you're planning to attend"
                    : "Events you've already attended"}
                </AppText>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              title={
                activeTab === "upcoming"
                  ? "No Upcoming Events"
                  : "No Past Events"
              }
            />
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.cardContainer,
              numColumns > 1 && {
                width: cardWidth,
              },
            ]}
          >
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
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },

  header: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: COLORS.textSecondary,
  },

  tabsContainer: {
    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 4,

    marginBottom: SPACING.xl,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tab: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 12,

    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  activeTabText: {
    color: "#FFFFFF",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },

  cardContainer: {
    marginBottom: 16,
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

  emptyContainer: {
    marginTop: 40,
  },
});
