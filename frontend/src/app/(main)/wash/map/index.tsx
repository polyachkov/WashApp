import {Stack} from "expo-router";
import SelectWashOnMapScreen from "@/features/main/map/screens/SelectWashOnMapScreen.web";

export default function SelectWashOnMap() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SelectWashOnMapScreen />
        </>
    );
}
