import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivitiesAsync } from "../reducers/activities";
import { fetchMembersAsync } from "../reducers/members";
import {
  fetchNotificationsAsync,
  respondToInvitationAsync,
} from "../reducers/notifications";

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

// petite animation - Commenté pour éviter le warning avec la nouvelle architecture
// if (
//   Platform.OS === "android" &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const activities = useSelector((state) => state.activities.value || []);
  const user = useSelector((state) => state.user.value || {});
  const members = useSelector((state) => state.members.value || []);

  // --- Notifications Redux ---
  const { invitations, reminders, loading } = useSelector(
    (state) => state.notifications
  );

  const [selectedChild, setSelectedChild] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  const children = members.filter((m) => m.isChildren);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  // 🔥 Fetch data
  useEffect(() => {
    if (user.token) {
      dispatch(fetchActivitiesAsync(user.token));
      dispatch(fetchMembersAsync());
      dispatch(fetchNotificationsAsync(user.token)); // récupère les notifs
    }
  }, [user.token]);

  // 🔥 Réponse invitation
  const handleResponse = (activityId, validate) => {
    dispatch(
      respondToInvitationAsync({
        token: user.token,
        activityId,
        validate,
      })
    );
  };

  // --- Tri des activités ---
  const filteredActivities = selectedChild
    ? activities.filter((a) =>
        a.members?.some((m) => m._id === selectedChild._id)
      )
    : activities;

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

  // 🔥 Notifications fusionnées
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

          {/* Planning */}
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
                  onPress={() => {
                    // Animation alternative sans LayoutAnimation
                    setSelectedChild(null);
                  }}
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
                        // ✅ Utilise la couleur de l'activité au lieu de celle du jour
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
                                color="white"
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
                  {item.type === "validation" && (
                    <View style={styles.actionButtons}>
                      <KWButton
                        title="Accepter"
                        bgColor={colors.green[1]}
                        onPress={() => handleResponse(item.id, true)}
                        style={{ minWidth: 100 }}
                      />
                      <KWButton
                        title="Refuser"
                        bgColor={colors.red[1]}
                        onPress={() => handleResponse(item.id, false)}
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
