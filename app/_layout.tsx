import { Stack } from "expo-router";
import EventProvider from "@/context/EventProvider";

export default function RootLayout() {
  return (
    <EventProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="event/[id]"
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="host/[id]"
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </EventProvider>
  );
}
