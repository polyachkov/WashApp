import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { MenuProvider } from "@/shared/ui/menu/MenuContext";
import { SideMenu } from "@/shared/ui/menu/SideMenu";

import { useColorScheme } from "@/shared/hooks/use-color-scheme";

export const unstable_settings = { anchor: "((auth))" };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(main)" />
          </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
  );
}
