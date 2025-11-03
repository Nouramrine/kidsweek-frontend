import React, { useEffect, useState } from "react";
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
import { saveTutorialStepAsync } from "../reducers/user";

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

  const tutorialStep = user.tutorialStep || 0;
  const children = members.filter((m) => m.isChildren);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  // 🔹 Fetch data
  useEffect(() => {
    if (user.token) {
      dispatch(fetchActivitiesAsync(user.token));
      dispatch(fetchMembersAsync());
      dispatch(fetchNotificationsAsync(user.token));
    }
  }, [user.token]);

  // 🔹 Réponse invitation
  const handleResponse = (activityId, validate) => {
    dispatch(
      respondToInvitationAsync({
        token: user.token,
        activityId,
        validate,
      })
    );
  };

  // 🔹 Tri des activités
  const now = new Date();
  const upcomingActivities = activities.filter(
    (a) => new Date(a.dateBegin) >= now
  );
  const pastActivities = activities
    .filter((a) => new Date(a.dateEnd) < now)
    .sort((a, b) => new Date(b.dateEnd) - new Date(a.dateEnd))
    .slice(0, 3);

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

  const allNotifications = [
    ...reminders.map((r) => ({
      id: r._id,
      type: "reminder",
      message: `Rappel: ${r.name} à ${formatTime(r.dateBegin)}.`,
    })),
    ...invitations.map((i) => ({
      id: i._id,
      type: "validation",
      message: `Nouvelle activité "${i.name}" à valider.`,
    })),
  ];

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
            {allNotifications.length > 0 && (
              <View
                style={[styles.badge, { backgroundColor: colors.orange[1] }]}
              >
                <KWText style={styles.badgeText}>
                  {allNotifications.length}
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
                          </KWCollapsible>
                        );
                      })}
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
          ) : allNotifications.length === 0 ? (
            <KWText>Aucune notification.</KWText>
          ) : (
            <FlatList
              data={allNotifications}
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
                </KWCard>
              )}
            />
          )}
        </KWModal>

        {/* MODAL Tutoriel - Étape 0 */}
        {tutorialStep === 0 && (
          <KWModal visible={true}>
            <KWText
              type="h2"
              style={{
                marginBottom: 15,
                fontWeight: "bold",
                color: colors.purple[2],
              }}
            >
              Bienvenue sur KidsWeek ! 👋
            </KWText>
            <KWText style={{ marginBottom: 20, lineHeight: 22 }}>
              Pour commencer, nous allons créer votre foyer familial ensemble.
            </KWText>
            <KWButton
              title="Créer mon foyer"
              bgColor={colors.purple[1]}
              onPress={() => {
                dispatch(saveTutorialStepAsync({ email: user.email, step: 1 }));
                navigation.navigate("Famille");
              }}
            />
          </KWModal>
        )}
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
});

export default HomeScreen;
