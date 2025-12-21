import { WashBoxesScreen } from "@/features/main/wash/screens/WashBoxesScreen";
import {Stack} from "expo-router";

export default function WashScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <WashBoxesScreen />
        </>
    );
}
