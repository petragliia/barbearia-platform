import { collection, CollectionReference, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper to get typed collection references
// Note: We are not enforcing full type safety on the collection reference *read* here 
// to avoid complexity with Firestore's Converter, but we return the standard CollectionReference.

export const NOTIFICATION_SETTINGS_COLLECTION = "notification_settings";
export const NOTIFICATION_TEMPLATES_COLLECTION = "notification_templates";
export const NOTIFICATION_LOGS_COLLECTION = "notification_logs";
export const BARBERSHOPS_COLLECTION = "barbershops";

export function getNotificationSettingsRef(): CollectionReference<DocumentData> {
    return collection(db, NOTIFICATION_SETTINGS_COLLECTION);
}

export function getNotificationTemplatesRef(): CollectionReference<DocumentData> {
    return collection(db, NOTIFICATION_TEMPLATES_COLLECTION);
}

export function getNotificationLogsRef(): CollectionReference<DocumentData> {
    return collection(db, NOTIFICATION_LOGS_COLLECTION);
}

export function getBarbershopsRef(): CollectionReference<DocumentData> {
    return collection(db, BARBERSHOPS_COLLECTION);
}
