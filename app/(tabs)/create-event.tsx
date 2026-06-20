import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { format } from "date-fns";

import AppText from "@/components/common/AppText";
import AppButton from "@/components/common/AppButton";

import { Category, Event } from "@/types/Event";
import { COLORS } from "@/constants/colors";
import { useEvents } from "@/hooks/useEvents";

const categories: Category[] = ["Tech", "Music", "Sports", "Food", "Other"];

export default function CreateEventScreen() {
  const { dispatch } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<Category>("Tech");
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setShowPermissionModal(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("Tech");
    setEventDate(new Date());
    setShowDatePicker(false);
    setImageUri("");
  };

  const createEvent = () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      setShowValidationModal(true);
      return;
    }

    const newEvent: Event = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category,
      location,
      date: eventDate.toISOString(),
      attendeeCount: 0,
      hostName: "You",
      hostAvatar: "https://i.pravatar.cc/150?img=20",
      imageUrl: imageUri || "https://picsum.photos/600/400?random=999",
      isCustom: true,
    };

    dispatch({ type: "ADD_EVENT", payload: newEvent });
    resetForm();
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.heading}>Create Event</AppText>

        <View style={styles.field}>
          <AppText style={styles.label}>Title</AppText>
          <TextInput
            autoFocus
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Description</AppText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Event description"
            placeholderTextColor="#9CA3AF"
            multiline
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Category</AppText>
          <View style={styles.categoryContainer}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,
                  category === item && styles.activeCategoryChip,
                ]}
                onPress={() => setCategory(item)}
              >
                <AppText
                  style={[
                    styles.categoryText,
                    category === item && styles.activeCategoryText,
                  ]}
                >
                  {item}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Date</AppText>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.primary}
            />
            <AppText style={styles.dateText}>
              {format(eventDate, "dd MMM yyyy")}
            </AppText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="compact"
              minimumDate={new Date()}
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setEventDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Location</AppText>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Event location"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Event Image</AppText>
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                <AppText style={styles.imageText}>Tap to select image</AppText>
              </>
            )}
          </TouchableOpacity>
        </View>

        <AppButton title="Create Event" onPress={createEvent} />
      </ScrollView>

      {/* ── Success Modal ── */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color="#FFF" />
            </View>

            <AppText style={styles.modalTitle}>Event Created!</AppText>
            <AppText style={styles.modalSubtitle}>
              Your event has been published and is now live for others to
              discover.
            </AppText>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/");
              }}
            >
              <AppText style={styles.modalPrimaryBtnText}>
                View All Events
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={() => {
                setShowSuccessModal(false);
              }}
            >
              <AppText style={styles.modalSecondaryBtnText}>
                Create Another
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Validation Modal ── */}
      <Modal visible={showValidationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="alert" size={36} color="#FFF" />
            </View>

            <AppText style={styles.modalTitle}>Missing Fields</AppText>
            <AppText style={styles.modalSubtitle}>
              Please fill in the title, description, and location before
              creating your event.
            </AppText>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setShowValidationModal(false)}
            >
              <AppText style={styles.modalPrimaryBtnText}>Got it</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Permission Modal ── */}
      <Modal visible={showPermissionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="images-outline" size={32} color="#FFF" />
            </View>

            <AppText style={styles.modalTitle}>Gallery Access Needed</AppText>
            <AppText style={styles.modalSubtitle}>
              Please allow gallery access in your device settings to upload an
              event image.
            </AppText>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={() => setShowPermissionModal(false)}
            >
              <AppText style={styles.modalPrimaryBtnText}>OK</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFF",
    fontSize: 15,
    color: "#111827",
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  activeCategoryChip: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },

  activeCategoryText: {
    color: COLORS.primary,
  },

  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#FFF",
  },

  dateText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },

  imagePlaceholder: {
    height: 180,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
    gap: 8,
  },

  imageText: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  warningIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  modalPrimaryBtn: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  modalPrimaryBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  modalSecondaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },

  modalSecondaryBtnText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
});
