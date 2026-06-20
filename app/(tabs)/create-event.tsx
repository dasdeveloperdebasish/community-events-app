import { useState } from "react";
import {
  Alert,
  Image,
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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access.");

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
      Alert.alert("Validation Error", "Please fill all required fields.");

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

    dispatch({
      type: "ADD_EVENT",
      payload: newEvent,
    });

    resetForm();

    Alert.alert("Success", "Event created successfully.", [
      {
        text: "OK",
        onPress: () => router.replace("/"),
      },
    ]);
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
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Description</AppText>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Event description"
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

                if (selectedDate) {
                  setEventDate(selectedDate);
                }
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
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Event Image</AppText>

          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            {imageUri ? (
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.previewImage}
              />
            ) : (
              <>
                <Ionicons name="image-outline" size={40} color="#6B7280" />

                <AppText style={styles.imageText}>Select Event Image</AppText>
              </>
            )}
          </TouchableOpacity>
        </View>

        <AppButton title="Create Event" onPress={createEvent} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFF",
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
  },

  activeCategoryChip: {
    backgroundColor: COLORS.primary,
  },

  categoryText: {
    color: "#374151",
    fontWeight: "600",
  },

  activeCategoryText: {
    color: "#FFF",
  },

  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#FFF",
  },

  dateText: {
    marginLeft: 10,
    fontSize: 16,
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
  },

  imageText: {
    marginTop: 10,
    color: "#6B7280",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },
});
