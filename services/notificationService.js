import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permission de notification refusée");
      return null;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;

    console.log("📱 Push Token:", token);
  } else {
    console.warn("Les notifications push nécessitent un appareil physique");
  }

  return token;
}

export async function savePushTokenToBackend(token, userToken) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/members/push-token`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ pushToken: token }),
      },
    );

    const data = await response.json();

    if (!data.result) {
      throw new Error(data.error || "Erreur lors de la sauvegarde du token");
    }

    console.log("✅ Token push sauvegardé");
    return true;
  } catch (error) {
    console.error("❌ Erreur sauvegarde token push:", error);
    return false;
  }
}

export async function scheduleLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  });
}

export function setupNotificationListeners(
  onNotificationReceived,
  onNotificationTapped,
) {
  // Listener pour les notifications reçues quand l'app est au premier plan
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📬 Notification reçue:", notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    },
  );

  // Listener pour les notifications tapées
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("👆 Notification tapée:", response);
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    });

  // Retourner les fonctions de nettoyage
  return {
    remove: () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    },
  };
}

/**
 * Obtient le badge count actuel
 */
export async function getBadgeCount() {
  return await Notifications.getBadgeCountAsync();
}

export async function setBadgeCount(count) {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Efface toutes les notifications
 */
export async function clearAllNotifications() {
  await Notifications.dismissAllNotificationsAsync();
  await setBadgeCount(0);
}
