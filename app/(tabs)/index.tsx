import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  TextInput,
  useWindowDimensions,
  View,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, usePathname } from "expo-router";

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

  const numColumns = width >= 900 ? 2 : 1;
  const horizontalGap = 16;
  const cardWidth = numColumns === 2 ? (width - 32 - horizontalGap) / 2 : width;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const listRef = useRef<FlatList>(null);
  const previousPath = useRef<string>("");
  const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      if (previousPath.current === "/create-event") {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
      return () => {
        previousPath.current = pathname;
      };
    }, [pathname]),
  );

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const events = await getEvents();
      dispatch({ type: "FETCH_SUCCESS", payload: events });
    } catch {
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
      <View style={styles.stickyWrapper}>
        <View style={styles.header}>
          <AppText style={styles.title}>Discover Events</AppText>
          <AppText style={styles.subtitle}>
            Explore local events around you
          </AppText>

          <View
            style={[
              styles.searchContainer,
              isSearchFocused && styles.searchContainerFocused,
            ]}
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
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        <CategoryTabs
          selectedCategory={state.selectedCategory}
          onSelectCategory={(category) =>
            dispatch({ type: "SET_CATEGORY", payload: category })
          }
        />
      </View>

      <FlatList
        ref={listRef}
        data={filteredEvents}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>
              {state.selectedCategory === "All"
                ? "All Events"
                : `${state.selectedCategory} Events`}
            </AppText>
            <AppText style={styles.resultCount}>
              {filteredEvents.length} found
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.cardContainer,
              numColumns > 1 ? { width: cardWidth } : styles.mobileCard,
            ]}
          >
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

const styles = StyleSheet.create({
  stickyWrapper: {
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#F8FAFC",
  },

  header: {
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 34,
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  searchContainerFocused: {
    borderColor: "#2563EB",
    shadowOpacity: 0.07,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 13,
    marginLeft: 9,
    fontSize: 15,
    color: "#111827",
  },

  contentContainer: {
    paddingBottom: 120,
    paddingTop: 0,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },

  resultCount: {
    fontSize: 13,
    color: "#6B7280",
  },

  cardContainer: {
    marginBottom: 16,
  },

  mobileCard: {
    width: "100%",
  },
});
