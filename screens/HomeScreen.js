import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivitiesAsync } from "../reducers/activities";
import { fetchMembersAsync } from "../reducers/members";
import {
  fetchNotificationsAsync,
  respondToInvitationAsync,
} from "../reducers/notifications";
import { dismissTutorialAsync } from "../reducers/user";

import KWModal from "../components/KWModal";
import {
  KWCard,
  KWCardHeader,
  KWCardTitle,
  KWCardBody,
  KWCardIcon,
} from "../components/KWCard";
import KWText from "../components/KWText";
import KWButton from "../components/KWButton";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import KWCollapsible from "../components/KWCollapsible";

//  IMPORT DU SERVICE DE NOTIFICATIONS
import { scheduleLocalNotification } from "../components/notificationService";
import TutorialBanner from "../components/TutorialBanner";

// Fonction utilitaire pour déterminer la couleur du texte adaptée
const getContrastColor = (hexColor) => {
  if (!hexColor) return "white";
  const c = hexColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 180 ? "black" : "white";
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const activities = useSelector((state) => state.activities.value || []);
  const user = useSelector((state) => state.user.value || {});
  const members = useSelector((state) => state.members.value || []);
  const { invitations, reminders, loading } = useSelector(
    (state) => state.notifications
  );

  const [selectedChild, setSelectedChild] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  // logique tuto
  const [shouldShowHomeTutorial, setShouldShowHomeTutorial] = useState(false);

  useEffect(() => {
    const dismissedTooltips = user?.tutorialState?.dismissedTooltips || [];
    setShouldShowHomeTutorial(!dismissedTooltips.includes("goToFamily"));
  }, [user]);

  const handleDismissTooltip = async (tooltipId) => {
    setShouldShowHomeTutorial(false);

    try {
      await dispatch(
        dismissTutorialAsync({
          token: user.token,
          tooltipId,
        })
      ).unwrap();
    } catch (err) {
      console.error("Erreur dismissTutorialAsync:", err);
    }
  };

  //  Référence pour suivre le nombre de notifications précédent
  const previousNotifCount = useRef(0);

  useEffect(() => {
    if (!user.token || isModalVisible) return;
    const interval = setInterval(() => {
      dispatch(fetchNotificationsAsync(user.token));
    }, 10000);
    return () => clearInterval(interval);
  }, [user.token, dispatch, isModalVisible]);

  //  State local pour notifications affichées
  const [modalNotifications, setModalNotifications] = useState([]);
  const children = members.filter((m) => m.isChildren);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  // Fetch data
  useEffect(() => {
    if (user.token) {
      dispatch(fetchActivitiesAsync(user.token));
      dispatch(fetchMembersAsync());
      dispatch(fetchNotificationsAsync(user.token));
    }
  }, [user.token]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
    const time = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} à ${time}`;
  };

  //  Met à jour la liste des notifications dès que le fetch est fini
  useEffect(() => {
    const allNotifs = [
      ...reminders.map((r) => ({
        id: r._id,
        type: "reminder",
        message:
          r.message ||
          `Rappel : ${r.activityId?.name || "Activité"} le ${formatDateTime(
            r.activityId?.dateBegin
          )}.`,
        activityId: r.activityId?._id,
        activityName: r.activityId?.name,
        activityDate: r.activityId?.dateBegin,
      })),
      ...invitations.map((i) => ({
        id: i._id,
        type: "validation",
        message:
          i.message ||
          `Nouvelle activité "${i.activityId?.name || "Sans nom"}" à valider.`,
        activityId: i.activityId?._id,
        activityName: i.activityId?.name,
        activityDate: i.activityId?.dateBegin,
        notificationId: i._id,
      })),
    ];

    // console.log("🔍 NOTIFICATIONS REÇUES :", {
    //   invitations: invitations.map((i) => ({ ...i, memberId: i.memberId })),
    //   reminders,
    // });
    // console.log("🔍 NOTIFICATIONS TRANSFORMÉES :", allNotifs);

    setModalNotifications((prev) => {
      const prevIds = prev
        .map((n) => n.id)
        .sort()
        .join(",");
      const newIds = allNotifs
        .map((n) => n.id)
        .sort()
        .join(",");
      if (prevIds === newIds) return prev;
      return allNotifs;
    });
  }, [reminders, invitations]);

  // 🔔 NOUVEAU : Détecter les nouvelles notifications et déclencher une notification locale
  useEffect(() => {
    const totalNotifs = invitations.length + reminders.length;

    // Si on a plus de notifications qu'avant, déclencher une notification locale
    if (totalNotifs > previousNotifCount.current) {
      // console.log("🔔 Nouvelle notification détectée !");

      // Vérifier si c'est une invitation
      if (invitations.length > 0) {
        const lastInvitation = invitations[invitations.length - 1];
        scheduleLocalNotification(
          "Nouvelle invitation ! 🎉",
          lastInvitation.message || `Vous avez une nouvelle invitation`,
          {
            type: "invitation",
            activityId: lastInvitation.activityId?._id,
            notificationId: lastInvitation._id,
          }
        );
      }
      // Sinon vérifier si c'est un reminder
      else if (reminders.length > 0) {
        const lastReminder = reminders[reminders.length - 1];
        scheduleLocalNotification(
          "Rappel d'activité ⏰",
          lastReminder.message || `Vous avez un nouveau rappel`,
          {
            type: "reminder",
            activityId: lastReminder.activityId?._id,
            notificationId: lastReminder._id,
          }
        );
      }
    }

    previousNotifCount.current = totalNotifs;
  }, [invitations, reminders]);

  const handleResponse = async (activityId, validate) => {
    try {
      await dispatch(
        respondToInvitationAsync({
          token: user.token,
          activityId,
          validate,
        })
      ).unwrap();

      // Supprimer la notification de la liste
      setModalNotifications((prev) => {
        const updated = prev.filter(
          (n) => !(n.type === "validation" && n.activityId === activityId)
        );

        // Fermer la modal si plus de notifications
        if (updated.length === 0) {
          setIsModalVisible(false);
        }

        return updated;
      });

      dispatch(fetchActivitiesAsync(user.token));
    } catch (err) {
      console.error("Erreur réponse invitation:", err);
    }
  };

  // Fonction pour marquer un rappel comme lu
  const handleDismissReminder = async (notificationId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/activities/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erreur lors du marquage");

      // Supprimer la notification de la liste
      setModalNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== notificationId);

        // Fermer la modal si plus de notifications
        if (updated.length === 0) {
          setIsModalVisible(false);
        }

        return updated;
      });

      // Refetch les notifications
      dispatch(fetchNotificationsAsync(user.token));
    } catch (err) {
      console.error("Erreur dismiss reminder:", err);
      alert("Erreur lors du marquage de la notification");
    }
  };

  // Tri des activités
  const now = new Date();
  const upcomingActivities = activities.filter(
    (a) => new Date(a.dateBegin) >= now
  );

  const filteredActivities = selectedChild
    ? upcomingActivities.filter((a) =>
        a.members?.some((m) => m._id === selectedChild._id)
      )
    : upcomingActivities;

  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    const date = new Date(activity.dateBegin);
    const key = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(activity);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedActivities).sort((a, b) => {
    const parseDate = (str) => {
      const [, datePart] = str.split(" ");
      const [day, month] = datePart.split("/");
      return new Date(2025, month - 1, day);
    };
    return parseDate(a) - parseDate(b);
  });

  const dayColors = {
    lundi: colors.blue,
    mardi: colors.green,
    mercredi: colors.purple,
    jeudi: colors.orange,
    vendredi: colors.pink,
    samedi: colors.yellow,
    dimanche: colors.skin,
  };

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  // Activités passées
  const pastActivities = activities
    .filter((a) => new Date(a.dateEnd || a.dateBegin) < now)
    .filter((a) =>
      selectedChild ? a.members?.some((m) => m._id === selectedChild._id) : true
    )
    .sort((a, b) => new Date(b.dateBegin) - new Date(a.dateBegin))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/titre.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={toggleModal} style={styles.bellContainer}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color={colors.purple[2]}
            />
            {modalNotifications.length > 0 && (
              <View
                style={[styles.badge, { backgroundColor: colors.orange[1] }]}
              >
                <KWText style={styles.badgeText}>
                  {modalNotifications.length}
                </KWText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* BODY */}
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Sélecteur d'enfant */}
          <KWCard style={styles.childCard}>
            <KWCardBody style={styles.childSelector}>
              {children.length === 0 ? (
                <KWText>Aucun enfant enregistré.</KWText>
              ) : (
                children.map((child) => {
                  const palette = colors[child.color] || colors.purple;
                  const isSelected = selectedChild?._id === child._id;
                  return (
                    <KWButton
                      key={child._id}
                      title={child.firstName}
                      bgColor={isSelected ? palette[1] : colors.background[1]}
                      color={isSelected ? "white" : palette[2]}
                      onPress={() => setSelectedChild(child)}
                      style={{
                        borderWidth: isSelected ? 0 : 1,
                        borderColor: palette[2],
                      }}
                    />
                  );
                })
              )}
            </KWCardBody>
          </KWCard>

          {/* tuto */}
          {shouldShowHomeTutorial && (
            <TutorialBanner
              id="goToFamily"
              message="Commencez par créer votre première zone familiale pour planifier vos activités."
              ctaLabel="Aller à ma famille"
              onCta={() => {
                navigation.navigate("Famille", { screen: "FamillyScreen" });
                handleDismissTooltip("goToFamily");
              }}
              onDismiss={() => handleDismissTooltip("goToFamily")}
              visible={shouldShowHomeTutorial}
              bgColor={colors.yellow[0]}
            />
          )}

          {/* Planning à venir */}
          <KWCard style={styles.planningCard}>
            <KWCardHeader>
              <KWCardIcon>
                <Ionicons
                  name="calendar-outline"
                  size={30}
                  color={colors.purple[2]}
                />
              </KWCardIcon>
              <KWCardTitle>
                <TouchableOpacity
                  onPress={() => setSelectedChild(null)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  {selectedChild && (
                    <Ionicons
                      name="arrow-back"
                      size={22}
                      color={colors.purple[2]}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <KWText type="h2" style={{ color: colors.purple[2] }}>
                    {selectedChild
                      ? `Planning de ${selectedChild.firstName}`
                      : "Mon planning"}
                  </KWText>
                </TouchableOpacity>
              </KWCardTitle>
            </KWCardHeader>

            <KWCardBody>
              {sortedDays.length === 0 ? (
                <KWText>Aucune activité prévue.</KWText>
              ) : (
                sortedDays.map((day) => {
                  const dayName = day.split(" ")[0].toLowerCase();
                  const palette = dayColors[dayName] || colors.blue;
                  const activitiesOfDay = groupedActivities[day];

                  return (
                    <View key={day} style={{ marginBottom: 15 }}>
                      <KWText
                        type="h3"
                        style={{
                          fontWeight: "bold",
                          marginBottom: 8,
                          color: palette[2],
                        }}
                      >
                        {day}
                      </KWText>

                      {activitiesOfDay.map((a) => {
                        const activityPalette =
                          colors[a.color] || colors.purple;

                        return (
                          <KWCollapsible
                            key={a._id}
                            title={a.name}
                            subtitle={`${formatTime(
                              a.dateBegin
                            )} → ${formatTime(a.dateEnd)}`}
                            palette={activityPalette}
                            isExpanded={expandedActivityId === a._id}
                            onToggle={() => toggleActivity(a._id)}
                          >
                            <KWText>📍 {a.place || "Lieu non précisé"}</KWText>
                            {a.note && <KWText>📝 {a.note}</KWText>}
                            {a.members?.length > 0 && (
                              <View>
                                <KWText type="h3" style={{ marginTop: 8 }}>
                                  👥 Membres :
                                </KWText>
                                {a.members.map((m) => (
                                  <KWText key={m._id}>• {m.firstName}</KWText>
                                ))}
                              </View>
                            )}
                            <View
                              style={{ alignItems: "center", marginTop: 10 }}
                            >
                              <KWButton
                                title="Modifier"
                                icon="edit"
                                bgColor={activityPalette[1]}
                                color={getContrastColor(activityPalette[1])}
                                style={{ minWidth: 150 }}
                                onPress={() =>
                                  navigation.navigate("AddScreen", {
                                    activityToEdit: a,
                                  })
                                }
                              />
                            </View>
                          </KWCollapsible>
                        );
                      })}
                    </View>
                  );
                })
              )}
            </KWCardBody>
          </KWCard>

          {/* Activités passées */}
          <KWCard style={styles.planningCard}>
            <KWCardHeader>
              <KWCardIcon>
                <Ionicons
                  name="time-outline"
                  size={30}
                  color={colors.purple[2]}
                />
              </KWCardIcon>
              <KWCardTitle>
                <KWText type="h2" style={{ color: colors.purple[2] }}>
                  Activités passées
                </KWText>
              </KWCardTitle>
            </KWCardHeader>

            <KWCardBody>
              {pastActivities.length === 0 ? (
                <KWText>Aucune activité récente.</KWText>
              ) : (
                pastActivities.map((a) => {
                  const palette = colors[a.color] || colors.gray;
                  return (
                    <View
                      key={a._id}
                      style={{
                        marginBottom: 10,
                        backgroundColor: palette[0],
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      <KWText
                        type="h3"
                        style={{ color: palette[2], fontWeight: "bold" }}
                      >
                        {a.name}
                      </KWText>
                      <KWText>{`📅 ${new Date(a.dateBegin).toLocaleDateString(
                        "fr-FR"
                      )}`}</KWText>
                      <KWText>{`🕒 ${formatTime(a.dateBegin)} → ${formatTime(
                        a.dateEnd
                      )}`}</KWText>
                      {a.place && <KWText>📍 {a.place}</KWText>}
                    </View>
                  );
                })
              )}
            </KWCardBody>
          </KWCard>
        </ScrollView>

        {/* MODAL Notifications */}
        <KWModal visible={isModalVisible} onRequestClose={toggleModal}>
          <KWText
            type="h2"
            style={{ marginBottom: 10, color: colors.purple[2] }}
          >
            Notifications
          </KWText>
          {loading ? (
            <KWText>Chargement...</KWText>
          ) : modalNotifications.length === 0 ? (
            <KWText>Aucune notification.</KWText>
          ) : (
            <FlatList
              data={modalNotifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <KWCard
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    backgroundColor:
                      item.type === "reminder"
                        ? colors.purple[0]
                        : colors.pink[0],
                  }}
                >
                  <KWText>{item.message}</KWText>
                  {item.type === "validation" && (
                    <View style={styles.actionButtons}>
                      <KWButton
                        title="Accepter"
                        bgColor={colors.green[1]}
                        onPress={() => handleResponse(item.activityId, true)}
                        style={{ minWidth: 100 }}
                      />
                      <KWButton
                        title="Refuser"
                        bgColor={colors.red[1]}
                        onPress={() => handleResponse(item.activityId, false)}
                        style={{ minWidth: 100 }}
                      />
                    </View>
                  )}
                  {item.type === "reminder" && (
                    <View style={styles.actionButtons}>
                      <KWButton
                        title="OK"
                        bgColor={colors.purple[1]}
                        onPress={() => handleDismissReminder(item.id)}
                        style={{ minWidth: 100 }}
                      />
                    </View>
                  )}
                </KWCard>
              )}
            />
          )}
        </KWModal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  screen: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: { width: "80%", aspectRatio: 3, marginBottom: 10 },
  bellContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 10,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: "white", fontSize: 12 },
  scroll: { padding: 15, paddingBottom: 100 },
  childCard: { backgroundColor: colors.background[0], marginBottom: 15 },
  childSelector: { flexDirection: "row", justifyContent: "space-evenly" },
  planningCard: { backgroundColor: colors.background[0], marginBottom: 15 },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
});

export default HomeScreen;
