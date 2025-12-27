import { SettingsService } from "./services/settingsService";

export async function runFoundationTest() {
    const TEST_BARBER_ID = "test_barber_foundation_1";

    console.log(`\n--- Foundation Test: ${TEST_BARBER_ID} ---`);

    // 1. Get Default Settings (should be all false)
    const initialSettings = await SettingsService.getSettings(TEST_BARBER_ID);
    console.log("1. Initial Settings (Expect Default):", JSON.stringify(initialSettings, null, 2));

    // 2. Update Settings
    console.log("2. Updating Settings...");
    await SettingsService.updateSettings(TEST_BARBER_ID, {
        channels: { whatsapp: true, email: true },
        triggers: {
            reminder24h: true,
            birthday: false,
            winBack: { enabled: true, daysInactive: 45 }
        }
    });

    // 3. Get Updated Settings
    const updatedSettings = await SettingsService.getSettings(TEST_BARBER_ID);
    console.log("3. Updated Settings (Expect Changes):", JSON.stringify(updatedSettings, null, 2));

    console.log("--- Test Complete ---\n");
}
