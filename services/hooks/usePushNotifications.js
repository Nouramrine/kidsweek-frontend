import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  registerForPushNotificationsAsync,
  savePushTokenToBackend,
  setupNotificationListeners,
  setBadgeCount,
} from "../notificationService";
import { fetchNotificationsAsync } from "../../reducers/notifications";

export function usePushNotifications() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.value);
  const { invitations, reminders } = useSelector(
    (state) => state.notifications,
  );

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // 1. Enregistrer l'appareil pour les notifications push
    if (user?.token) {
      registerAndSaveToken();
    }

    // 2. Configurer les listeners
    const listeners = setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationTapped,
    );

    notificationListener.current = listeners;

    // 3. Mettre à jour le badge avec le nombre de notifications
    updateBadgeCount();

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [user?.token]);

  // Mettre à jour le badge quand les notifications changent
  useEffect(() => {
    updateBadgeCount();
  }, [invitations.length, reminders.length]);

  /**
   * Enregistre l'appareil et sauvegarde le token
   */
  const registerAndSaveToken = async () => {
    try {
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken && user?.token) {
        await savePushTokenToBackend(pushToken, user.token);
      }
    } catch (error) {
      console.error("Erreur enregistrement push:", error);
    }
  };

  /**
   * Gère la réception d'une notification (app au premier plan)
   */
  const handleNotificationReceived = (notification) => {
    console.log("📬 Notification reçue:", notification.request.content);

    // Recharger les notifications depuis le serveur
    if (user?.token) {
      dispatch(fetchNotificationsAsync(user.token));
    }
  };

  /**
   * Gère le tap sur une notification
   */
  const handleNotificationTapped = (response) => {
    const data = response.notification.request.content.data;
    console.log("👆 Notification tapée:", data);

    // Navigation selon le type de notification
    if (data.type === "invitation") {
      navigation.navigate("Home");
    } else if (data.type === "reminder") {
      if (data.activityId) {
        navigation.navigate("AddScreen", {
          activityToEdit: { _id: data.activityId },
        });
      }
    }

    // Recharger les notifications
    if (user?.token) {
      dispatch(fetchNotificationsAsync(user.token));
    }
  };

  /**
   * Met à jour le badge avec le nombre total de notifications
   */
  const updateBadgeCount = async () => {
    const totalNotifications = invitations.length + reminders.length;
    await setBadgeCount(totalNotifications);
  };

  return {
    updateBadgeCount,
  };
}
