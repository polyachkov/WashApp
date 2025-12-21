import {Stack} from "expo-router";
import BoxInfoScreen from "@/features/wash/screens/BoxInfoScreen";

export default function WashScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <BoxInfoScreen />
        </>
    );
}
