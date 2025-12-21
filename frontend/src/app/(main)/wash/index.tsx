import { WashBoxesScreen } from "@/features/wash/screens/WashBoxesScreen";
import {Stack} from "expo-router";

export default function WashScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <WashBoxesScreen />
        </>
    );
}
