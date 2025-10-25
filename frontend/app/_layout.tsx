import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = { anchor: "((auth))" };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Здесь позже можно добавить вкладки (tabs) */}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
  );
}
