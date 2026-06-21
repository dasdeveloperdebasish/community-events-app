import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { formatDate } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useState } from "react";

import AppText from "@/components/common/AppText";
import AppButton from "@/components/common/AppButton";
import AttendeeAvatars from "@/components/event/AttendeeAvatars";

import { useEvents } from "@/hooks/useEvents";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

import { generateICS } from "@/utils/calendar";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { state, dispatch } = useEvents();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

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

  const exportToCalendar = async () => {
    try {
      const icsContent = generateICS(event);
      const fileUri = FileSystem.cacheDirectory + `${event.id}.ics`;
      await FileSystem.writeAsStringAsync(fileUri, icsContent);
      const available = await Sharing.isAvailableAsync();
      if (!available) return;
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: SPACING.xl }}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      {heroError ? (
        <View style={styles.heroFallback}>
          <Ionicons name="image-outline" size={48} color="#CBD5E1" />
          <AppText style={styles.fallbackText}>No Image</AppText>
        </View>
      ) : (
        <View>
          {heroLoading && (
            <View style={styles.heroSkeleton}>
              <ActivityIndicator size="large" color="#CBD5E1" />
            </View>
          )}

          <Image
            source={{ uri: event.imageUrl }}
            style={[styles.image, heroLoading && styles.imageHidden]}
            resizeMode="cover"
            fadeDuration={200}
            progressiveRenderingEnabled
            onLoad={() => setHeroLoading(false)}
            onError={() => {
              setHeroLoading(false);
              setHeroError(true);
            }}
          />
        </View>
      )}

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

        <View
          style={[
            styles.actionContainer,
            isLargeScreen && styles.actionContainerLarge,
          ]}
        >
          <View
            style={[
              styles.actionButtonWrapper,
              isLargeScreen && styles.actionButtonLarge,
            ]}
          >
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

          <View
            style={[
              styles.actionButtonWrapper,
              isLargeScreen && styles.actionButtonLarge,
            ]}
          >
            <AppButton title="📅 Add To Calendar" onPress={exportToCalendar} />
          </View>
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
            {avatarError ? (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={28} color="#CBD5E1" />
              </View>
            ) : (
              <View>
                {avatarLoading && (
                  <View style={styles.avatarSkeleton}>
                    <ActivityIndicator size="small" color="#CBD5E1" />
                  </View>
                )}

                <Image
                  source={{
                    uri: event.hostAvatar,
                  }}
                  style={[
                    styles.hostAvatar,
                    avatarLoading && styles.imageHidden,
                  ]}
                  fadeDuration={200}
                  progressiveRenderingEnabled
                  onLoad={() => setAvatarLoading(false)}
                  onError={() => {
                    setAvatarLoading(false);
                    setAvatarError(true);
                  }}
                />
              </View>
            )}

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

  imageHidden: {
    opacity: 0,
    position: "absolute",
  },

  heroSkeleton: {
    width: "100%",
    height: 360,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  heroFallback: {
    width: "100%",
    height: 360,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  fallbackText: {
    fontSize: 14,
    color: "#CBD5E1",
  },

  avatarSkeleton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
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
    shadowOffset: { width: 0, height: 2 },
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

  actionContainer: {
    marginTop: SPACING.lg,
  },

  actionContainerLarge: {
    flexDirection: "row",
    gap: 12,
  },

  actionButtonWrapper: {
    marginBottom: 12,
  },

  actionButtonLarge: {
    flex: 1,
    marginBottom: 0,
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
    shadowOffset: { width: 0, height: 2 },
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
