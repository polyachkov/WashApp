import { Stack } from "expo-router";

export default function MainLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="wash"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
