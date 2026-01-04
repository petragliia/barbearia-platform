import { notificationDispatcher } from "./services/NotificationDispatcher";

// This file is intended to be run manually or imported in a temporary test route
export async function runTest() {
    console.log("Starting Notification Dispatcher Test...");

    // Test 1: Send WhatsApp Message (Mock)
    console.log("\n--- Test 1: WhatsApp Mock ---");
    const result1 = await notificationDispatcher.dispatch({
        barberId: "barber_123",
        customerId: "customer_456",
        to: "5511999999999",
        message: "Olá! Teste de integração do Dispatcher.",
        channel: "whatsapp",
        type: "reminder_24h"
    });
    console.log("Result 1:", result1);

    // Test 2: Send Email (Console Provider)
    console.log("\n--- Test 2: Email Console ---");
    const result2 = await notificationDispatcher.dispatch({
        barberId: "barber_123",
        customerId: "customer_456",
        to: "cliente@email.com",
        message: "Email de teste.",
        channel: "email",
        type: "win_back"
    });
    console.log("Result 2:", result2);


    console.log("\nTest Completed.");
}
