import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActivitiesAsync,
  updateTaskAsync,
} from "../../reducers/activities";
import { fetchMembersAsync } from "../../reducers/members";
import {
  fetchNotificationsAsync,
  respondToInvitationAsync,
} from "../../reducers/notifications";
import { dismissTutorialAsync } from "../../reducers/user";

import KWModal from "../../components/KWModal";
import {
  KWCard,
  KWCardHeader,
  KWCardTitle,
  KWCardBody,
  KWCardIcon,
} from "../../components/KWCard";
import KWText from "../../components/KWText";
import KWButton from "../../components/KWButton";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import TutorialBanner from "../../components/TutorialBanner";
import ChildSelector from "./components/ChildSelector";
import HomeHeader from "./components/HomeHeader";
import PlanningCard from "./components/PlaningCard";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const activities = useSelector((state) => state.activities.value || []);
  const user = useSelector((state) => state.user.value || {});
  const members = useSelector((state) => state.members.value || []);
  const { invitations, reminders, loading } = useSelector(
    (state) => state.notifications,
  );

  const [selectedChild, setSelectedChild] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [shouldShowHomeTutorial, setShouldShowHomeTutorial] = useState(false);
  const [modalNotifications, setModalNotifications] = useState([]);

  const previousNotifCount = useRef(0);
  const children = members.filter((m) => m.isChildren);
  const handleTaskToggle = async (activityId, taskId, isChecked) => {
    try {
      const result = await dispatch(
        updateTaskAsync({
          activityId,
          taskId,
          isOk: isChecked,
          token: user.token,
        }),
      ).unwrap();
      if (result) {
        dispatch(fetchActivitiesAsync(user.token));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

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
        }),
      ).unwrap();
    } catch (err) {
      console.error("Erreur dismissTutorialAsync:", err);
    }
  };

  // Polling des notifications toutes les 10 secondes
  useEffect(() => {
    if (!user.token || isModalVisible) return;
    const interval = setInterval(() => {
      dispatch(fetchNotificationsAsync(user.token));
    }, 10000);
    return () => clearInterval(interval);
  }, [user.token, dispatch, isModalVisible]);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  // Fetch initial
  useEffect(() => {
    if (user.token) {
      dispatch(fetchActivitiesAsync(user.token));
      dispatch(fetchMembersAsync());
      dispatch(fetchNotificationsAsync(user.token));
    }
  }, [user.token]);

  // Mise à jour des notifications dans la modal
  useEffect(() => {
    const allNotifs = [
      ...reminders.map((r) => ({
        id: r._id,
        type: "reminder",
        message:
          r.message ||
          `Rappel : ${r.activityId?.name || "Activité"} le ${formatDateTime(
            r.activityId?.dateBegin,
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

  // Suivi du nombre de notifications
  useEffect(() => {
    const totalNotifs = invitations.length + reminders.length;
    previousNotifCount.current = totalNotifs;
  }, [invitations, reminders]);

  const handleResponse = async (activityId, validate) => {
    try {
      await dispatch(
        respondToInvitationAsync({
          token: user.token,
          activityId,
          validate,
        }),
      ).unwrap();

      setModalNotifications((prev) => {
        const updated = prev.filter(
          (n) => !(n.type === "validation" && n.activityId === activityId),
        );

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
        },
      );

      if (!response.ok) throw new Error("Erreur lors du marquage");

      setModalNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== notificationId);

        if (updated.length === 0) {
          setIsModalVisible(false);
        }

        return updated;
      });

      dispatch(fetchNotificationsAsync(user.token));
    } catch (err) {
      console.error("Erreur dismiss reminder:", err);
      alert("Erreur lors du marquage de la notification");
    }
  };

  const now = new Date();
  const upcomingActivities = activities.filter(
    (a) => new Date(a.dateBegin) >= now,
  );

  const filteredActivities = selectedChild
    ? upcomingActivities.filter((a) =>
        a.members?.some((m) => m._id === selectedChild._id),
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

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const pastActivities = activities
    .filter((a) => new Date(a.dateEnd || a.dateBegin) < now)
    .filter((a) =>
      selectedChild
        ? a.members?.some((m) => m._id === selectedChild._id)
        : true,
    )
    .sort((a, b) => new Date(b.dateBegin) - new Date(a.dateBegin))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader
        notificationCount={modalNotifications.length}
        onBellPress={toggleModal}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.childSelector}>
          <ChildSelector
            childrenList={children}
            selectedChild={selectedChild}
            onSelect={setSelectedChild}
          />
        </View>

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
        <PlanningCard
          selectedChild={selectedChild}
          groupedActivities={groupedActivities}
          sortedDays={sortedDays}
          expandedActivityId={expandedActivityId}
          onToggleActivity={toggleActivity}
          onTaskToggle={handleTaskToggle}
          onEditActivity={(activity) =>
            navigation.navigate("AddScreen", { activityToEdit: activity })
          }
        />

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
              <KWText style={{ width: "100%", textAlign: "center" }}>
                Aucune activité récente.
              </KWText>
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
                      "fr-FR",
                    )}`}</KWText>
                    <KWText>{`🕒 ${formatTime(a.dateBegin)} → ${formatTime(
                      a.dateEnd,
                    )}`}</KWText>
                    {a.place && <KWText>📍 {a.place}</KWText>}
                  </View>
                );
              })
            )}
          </KWCardBody>
        </KWCard>
      </ScrollView>

      <KWModal visible={isModalVisible} onRequestClose={toggleModal}>
        <KWText type="h2" style={{ marginBottom: 10, color: colors.purple[2] }}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.background[0],
    paddingHorizontal: 10,
  },
  scroll: {},
  childSelector: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
  },
  planningCard: { backgroundColor: colors.background[0], marginBottom: 15 },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  activityContent: {
    padding: 15,
    gap: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  infoBlock: {
    marginTop: 6,
  },
  memberList: {
    flexDirection: "row",
    fontSize: 13,
    color: "#555",
    marginTop: 10,
  },
  activityInfo: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: colors.background[1],
    marginRight: 5,
  },
  checklistContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  checklistItem: {
    marginTop: 5,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.background[1],
    borderRadius: 10,
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  percentageText: {
    fontSize: 13,
    color: colors.green[0],
    fontWeight: "600",
  },
  checklistTextHeader: {
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default HomeScreen;
