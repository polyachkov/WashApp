import { SessionScreen } from "@/features/main/wash/screens/SessionScreen";
import {Stack} from "expo-router";

export default function Session() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SessionScreen />
        </>
    );
}
