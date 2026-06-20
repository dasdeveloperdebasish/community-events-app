import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { formatDate } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/common/AppText";
import AppButton from "@/components/common/AppButton";
import AttendeeAvatars from "@/components/event/AttendeeAvatars";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();

  const { state, dispatch } = useEvents();

  const event = state.events
    .map((item) => ({
      ...item,
      isRSVPed: state.myEvents.some((savedEvent) => savedEvent.id === item.id),
    }))
    .find((item) => item.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <AppText>Event not found</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: SPACING.xl,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      <Image
        source={{
          uri: event.imageUrl,
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <AppText style={styles.categoryText}>{event.category}</AppText>
        </View>

        <AppText style={styles.title}>{event.title}</AppText>

        <AppText style={styles.description}>{event.description}</AppText>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.primary}
            />

            <AppText style={styles.infoText}>
              {formatDate(new Date(event.date), "dd MMM yyyy, hh:mm a")}
            </AppText>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={COLORS.primary}
            />

            <AppText style={styles.infoText}>{event.location}</AppText>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={18} color={COLORS.primary} />

            <AppText style={styles.infoText}>
              {event.attendeeCount} Attendees
            </AppText>
          </View>

          <AttendeeAvatars attendeeCount={event.attendeeCount} />
        </View>

        <View style={styles.rsvpContainer}>
          <AppButton
            title={event.isRSVPed ? "Going ✓" : "RSVP Event"}
            onPress={() =>
              dispatch({
                type: "TOGGLE_RSVP",
                payload: event.id,
              })
            }
          />
        </View>

        <View style={styles.hostSection}>
          <AppText style={styles.hostTitle}>Hosted By</AppText>

          <TouchableOpacity
            style={styles.hostCard}
            onPress={() =>
              router.push({
                pathname: "/host/[id]",
                params: {
                  id: event.hostName,
                },
              })
            }
          >
            <Image
              source={{
                uri: event.hostAvatar,
              }}
              style={styles.hostAvatar}
            />

            <View style={styles.hostContent}>
              <AppText style={styles.hostName}>{event.hostName}</AppText>

              <AppText style={styles.hostSubtitle}>
                {event.attendeeCount}+ attendees joined events
              </AppText>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 360,
  },

  backButton: {
    position: "absolute",

    top: 60,
    left: SPACING.md,

    zIndex: 10,

    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: "rgba(0,0,0,0.45)",

    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: SPACING.lg,
  },

  categoryBadge: {
    alignSelf: "flex-start",

    backgroundColor: "#EFF6FF",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,

    marginBottom: SPACING.md,
  },

  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",

    color: COLORS.text,

    marginBottom: SPACING.md,
  },

  description: {
    color: COLORS.textSecondary,

    fontSize: 16,

    lineHeight: 28,

    marginBottom: SPACING.lg,
  },

  infoCard: {
    backgroundColor: "#FFF",

    borderRadius: 16,

    padding: SPACING.md,

    marginBottom: SPACING.sm,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 10,
    flex: 1,
  },

  rsvpContainer: {
    marginTop: SPACING.lg,
  },

  hostSection: {
    marginTop: SPACING.xl,
  },

  hostTitle: {
    fontSize: 22,
    fontWeight: "800",

    marginBottom: SPACING.md,
  },

  hostCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF",

    borderRadius: 20,

    padding: SPACING.md,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  hostAvatar: {
    width: 64,
    height: 64,

    borderRadius: 32,
  },

  hostContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  hostName: {
    fontSize: 18,
    fontWeight: "800",
  },

  hostSubtitle: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
