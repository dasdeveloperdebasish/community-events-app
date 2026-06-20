import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "date-fns";
import { useState } from "react";

import AppText from "@/components/common/AppText";
import AppButton from "../common/AppButton";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

import { Event } from "@/types/Event";

type Props = {
  event: Event;
  onPress: () => void;
  onRSVPPress: () => void;
};

export default function EventCard({ event, onPress, onRSVPPress }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View>
        {imageLoading && (
          <View style={styles.imageSkeleton}>
            <ActivityIndicator size="small" color="#CBD5E1" />
          </View>
        )}

        {imageError ? (
          <View style={styles.imageFallback}>
            <Ionicons name="image-outline" size={40} color="#CBD5E1" />
            <AppText style={styles.fallbackText}>No Image</AppText>
          </View>
        ) : (
          <Image
            source={{ uri: event.imageUrl }}
            style={[styles.image, imageLoading && styles.imageHidden]}
            resizeMode="cover"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            fadeDuration={200}
            progressiveRenderingEnabled
          />
        )}

        <View style={styles.categoryBadge}>
          <AppText style={styles.categoryText}>{event.category}</AppText>
        </View>

        {event.isRSVPed && (
          <View style={styles.goingBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#FFF" />
            <AppText style={styles.goingText}>Going</AppText>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <AppText numberOfLines={2} style={styles.title}>
          {event.title}
        </AppText>

        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <AppText style={styles.metaText}>
            {formatDate(new Date(event.date), "dd MMM yyyy, hh:mm a")}
          </AppText>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <AppText numberOfLines={1} style={styles.metaText}>
            {event.location}
          </AppText>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="people-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <AppText style={styles.metaText}>
            {event.attendeeCount} Attendees
          </AppText>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title={event.isRSVPed ? "Going ✓" : "RSVP Event"}
            onPress={onRSVPPress}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 220,
  },

  imageHidden: {
    opacity: 0,
    position: "absolute",
  },

  imageSkeleton: {
    width: "100%",
    height: 220,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  imageFallback: {
    width: "100%",
    height: 220,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  fallbackText: {
    fontSize: 13,
    color: "#CBD5E1",
  },

  categoryBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(37,99,235,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  categoryText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  goingBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  goingText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: SPACING.md,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  metaText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    flex: 1,
  },

  buttonContainer: {
    marginTop: SPACING.md,
  },
});
