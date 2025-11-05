import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Demande la permission d'afficher des notifications
 * @returns {Promise<string|null>} Le token de notification (pour push futur) ou null
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

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
      // console.log("❌ Permission de notification refusée");
      return null;
    }

    //console.log("✅ Permission de notification accordée");

    // Récupérer le token (utile pour push serveur plus tard)
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log("📱 Push Token:", token);
  } else {
    /* console.log(
      "⚠️ Les notifications ne fonctionnent que sur un appareil physique"
    );*/
  }

  return token;
}

/**
 * Déclenche une notification locale
 * @param {string} title - Titre de la notification
 * @param {string} body - Corps de la notification
 * @param {object} data - Données supplémentaires (optionnel)
 */
export async function scheduleLocalNotification(title, body, data = {}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Déclencher immédiatement
    });
    console.log("🔔 Notification locale envoyée:", title);
  } catch (error) {
    console.error("❌ Erreur notification locale:", error);
  }
}

/**
 * Annule toutes les notifications programmées
 */
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("🗑️ Toutes les notifications programmées ont été annulées");
}

/**
 * Gère la réponse quand l'utilisateur clique sur une notification
 * @param {function} callback - Fonction à exécuter avec les données de la notification
 */
export function addNotificationResponseListener(callback) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    console.log("👆 Notification cliquée:", data);
    callback(data);
  });
}

/**
 * Gère la réception d'une notification pendant que l'app est ouverte
 * @param {function} callback - Fonction à exécuter avec les données de la notification
 */
export function addNotificationReceivedListener(callback) {
  return Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data;
    console.log("📬 Notification reçue (app ouverte):", data);
    callback(data);
  });
}
