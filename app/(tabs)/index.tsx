import { useEffect } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
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

  useEffect(() => {
    loadEvents();
  }, []);

  const eventsWithRSVP = state.events.map((event) => ({
    ...event,
    isRSVPed: state.myEvents.some((item) => item.id === event.id),
  }));

  const filteredEvents =
    state.selectedCategory === "All"
      ? eventsWithRSVP
      : eventsWithRSVP.filter(
          (event) => event.category === state.selectedCategory,
        );

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
      />
    </Screen>
  );
}
