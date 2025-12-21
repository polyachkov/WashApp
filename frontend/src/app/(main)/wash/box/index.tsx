import {Stack} from "expo-router";
import BoxInfoScreen from "@/features/main/wash/screens/BoxInfoScreen";

export default function BoxScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <BoxInfoScreen />
        </>
    );
}
