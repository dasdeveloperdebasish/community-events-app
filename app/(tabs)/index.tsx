import { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  useWindowDimensions,
  View,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Screen from "@/components/common/Screen";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import AppText from "@/components/common/AppText";
import EventCard from "@/components/event/EventCard";
import CategoryTabs from "@/components/event/CategoryTabs";

import { getEvents } from "@/services/eventService";
import { useEvents } from "@/hooks/useEvents";

export default function HomeScreen() {
  const { state, dispatch } = useEvents();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const events = await getEvents();
      dispatch({ type: "FETCH_SUCCESS", payload: events });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to load events" });
    }
  };

  const eventsWithRSVP = state.events.map((event) => ({
    ...event,
    isRSVPed: state.myEvents.some((item) => item.id === event.id),
  }));

  const filteredEvents = eventsWithRSVP.filter((event) => {
    const matchesCategory =
      state.selectedCategory === "All" ||
      event.category === state.selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (state.loading) return <Loader />;
  if (state.error) return <EmptyState title={state.error} />;
  if (!state.events.length) return <EmptyState title="No Events Found" />;

  return (
    <Screen>
      <FlatList
        data={filteredEvents}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        columnWrapperStyle={numColumns > 1 ? { gap: 16 } : undefined}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                paddingTop: 8,
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <AppText
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    letterSpacing: -0.5,
                    lineHeight: 34,
                    color: "#111827",
                  }}
                >
                  Discover Events
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    marginTop: 2,
                    lineHeight: 20,
                  }}
                >
                  Explore local events around you
                </AppText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFF",
                borderWidth: 1.5,
                borderColor: isSearchFocused ? "#2563EB" : "#E5E7EB",
                borderRadius: 14,
                paddingHorizontal: 14,
                marginBottom: 14,
                shadowColor: "#000",
                shadowOpacity: isSearchFocused ? 0.07 : 0.03,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: isSearchFocused ? 3 : 1,
              }}
            >
              <Ionicons
                name="search"
                size={18}
                color={isSearchFocused ? "#2563EB" : "#9CA3AF"}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search events, locations..."
                placeholderTextColor="#9CA3AF"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  marginLeft: 9,
                  fontSize: 15,
                  color: "#111827",
                }}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            <CategoryTabs
              selectedCategory={state.selectedCategory}
              onSelectCategory={(category) =>
                dispatch({ type: "SET_CATEGORY", payload: category })
              }
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 18,
                marginBottom: 12,
              }}
            >
              <AppText
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#111827",
                  letterSpacing: -0.2,
                }}
              >
                {state.selectedCategory === "All"
                  ? "All Events"
                  : `${state.selectedCategory} Events`}
              </AppText>
              <AppText style={{ fontSize: 13, color: "#6B7280" }}>
                {filteredEvents.length} found
              </AppText>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <EventCard
              event={item}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: { id: item.id },
                })
              }
              onRSVPPress={() =>
                dispatch({ type: "TOGGLE_RSVP", payload: item.id })
              }
            />
          </View>
        )}
        ListEmptyComponent={<EmptyState title="No matching events found" />}
      />
    </Screen>
  );
}
