import { useEffect, useState } from "react";
import { FlatList, TextInput, useWindowDimensions, View } from "react-native";
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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      dispatch({
        type: "FETCH_START",
      });

      const events = await getEvents();

      dispatch({
        type: "FETCH_SUCCESS",
        payload: events,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Failed to load events",
      });
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

  if (state.loading) {
    return <Loader />;
  }

  if (state.error) {
    return <EmptyState title={state.error} />;
  }

  if (!state.events.length) {
    return <EmptyState title="No Events Found" />;
  }

  return (
    <Screen>
      <FlatList
        data={filteredEvents}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AppText
              style={{
                fontSize: 28,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Discover Events
            </AppText>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search events..."
              style={{
                backgroundColor: "#FFF",

                borderWidth: 1,
                borderColor: "#E5E7EB",

                borderRadius: 14,

                paddingHorizontal: 16,
                paddingVertical: 14,

                marginBottom: 16,
              }}
            />

            <CategoryTabs
              selectedCategory={state.selectedCategory}
              onSelectCategory={(category) =>
                dispatch({
                  type: "SET_CATEGORY",
                  payload: category,
                })
              }
            />
          </>
        }
        columnWrapperStyle={
          numColumns > 1
            ? {
                gap: 16,
              }
            : undefined
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
            }}
          >
            <EventCard
              event={item}
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
        ListEmptyComponent={<EmptyState title="No matching events found" />}
      />
    </Screen>
  );
}
