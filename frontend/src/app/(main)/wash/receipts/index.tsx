import { ReceiptScreen } from "@/features/main/wash/screens/ReceiptScreen";
import {Stack} from "expo-router";

export default function Receipts() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ReceiptScreen />
        </>
    );
}
