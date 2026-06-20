import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import AppText from "@/components/common/AppText";
import EventCard from "@/components/event/EventCard";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function HostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useEvents();

  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  const hostedEvents = state.events.filter((event) => event.hostName === id);

  const totalAttendees = hostedEvents.reduce(
    (sum, event) => sum + event.attendeeCount,
    0,
  );

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
            {/* ── Top bar ── */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <AppText style={styles.headerTitle}>Host Profile</AppText>
            </View>

            {/* ── Profile Card ── */}
            <View style={styles.profileCard}>
              {/* Blue accent banner at top of card */}
              <View style={styles.cardBanner} />

              {/* Avatar — sits on top of banner */}
              <View style={styles.avatarRing}>
                {avatarError ? (
                  <View style={styles.avatarFallback}>
                    <Ionicons name="person" size={40} color="#CBD5E1" />
                  </View>
                ) : (
                  <>
                    {avatarLoading && (
                      <View style={styles.avatarSkeleton}>
                        <ActivityIndicator size="small" color="#CBD5E1" />
                      </View>
                    )}
                    <Image
                      source={{ uri: host.hostAvatar }}
                      style={[
                        styles.avatar,
                        avatarLoading && { opacity: 0, position: "absolute" },
                      ]}
                      fadeDuration={200}
                      progressiveRenderingEnabled
                      onLoad={() => setAvatarLoading(false)}
                      onError={() => {
                        setAvatarLoading(false);
                        setAvatarError(true);
                      }}
                    />
                  </>
                )}
              </View>

              {/* Name + badge */}
              <AppText style={styles.name}>{host.hostName}</AppText>

              <View style={styles.badgeRow}>
                <Ionicons name="ribbon" size={14} color={COLORS.primary} />
                <AppText style={styles.badgeText}>
                  Verified Community Host
                </AppText>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <AppText style={styles.statsValue}>
                    {hostedEvents.length}
                  </AppText>
                  <AppText style={styles.statsLabel}>Events</AppText>
                </View>

                <View style={styles.statsDivider} />

                <View style={styles.statItem}>
                  <AppText style={styles.statsValue}>{totalAttendees}</AppText>
                  <AppText style={styles.statsLabel}>Attendees</AppText>
                </View>
              </View>
            </View>

            {/* ── Section Header ── */}
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
              router.push({ pathname: "/event/[id]", params: { id: item.id } })
            }
            onRSVPPress={() =>
              dispatch({ type: "TOGGLE_RSVP", payload: item.id })
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
    paddingBottom: 120,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: COLORS.text,
  },

  // ── Profile Card ──
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    alignItems: "center",
    marginBottom: SPACING.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    // extra bottom padding for content below avatar
    paddingBottom: 24,
  },

  // Blue accent strip at card top
  cardBanner: {
    width: "100%",
    height: 80,
    backgroundColor: "#2563EB",
    marginBottom: 0,
  },

  // White ring around avatar
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -54, // pulls avatar up over the banner
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
    gap: 5,
  },

  badgeText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    width: "85%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 2,
  },

  statsDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  statsValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  statsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // ── Section Header ──
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
    fontSize: 14,
  },
});
