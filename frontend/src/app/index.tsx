import { Stack } from "expo-router";
import { WelcomeScreen } from "@/features/auth/screens/WelcomeScreen";

export default function Index() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <WelcomeScreen />
        </>
    );
}
