"use client"; // Ensure this runs on the client
import { LocalNotifications } from "@capacitor/local-notifications";

export async function sendWelcomeNotification() {
  // Request notification permission
  const permStatus = await LocalNotifications.requestPermissions();
  if (permStatus.display !== "granted") return;

  // Schedule a test notification
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: "🚀 Welcome to Weather Rush!",
        body: "Thanks for installing the app. Stay updated with the latest weather!",
        schedule: { at: new Date(new Date().getTime() + 5000) }, // 5 sec delay
      },
    ],
  });
}
