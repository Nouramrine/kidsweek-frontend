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

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const user = useSelector((state) => state.user.value);

  const [selectedChild, setSelectedChild] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //Mock notification pour le test

  const notifications = [
    {
      id: 1,
      type: "reminder",
      message: "Rappel: Activité 'Piscine' dans 30 minutes.",
    },
    {
      id: 2,
      type: "validation",
      message: "Nouvelle activité 'Atelier Peinture' à valider.",
    },
  ];

  // Afficher la modal de notification au chargement si il y a des notifications

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  // recupérer les activité du membre connecté
  useEffect(() => {
    if (user.token) {
      dispatch(fetchActivitiesAsync(user.token));
    }
  }, [user.token]);

  // regrouper les activités par jour
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.dateBegin);
    const daykey = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
    if (!acc[daykey]) acc[daykey] = [];
    acc[daykey].push(activity);
    return acc;
  }, {});

  //Trier les jours par date réelle
  const sortedDays = Object.keys(groupedActivities).sort((a, b) => {
    const parseDate = (str) => {
      const [weekday, datePart] = str.split(" ");
      const [day, month] = datePart.split("/");
      return new Date(2025, month - 1, day);
    };
    return parseDate(a) - parseDate(b);
  });

  // fonction pour afficher l'heure au format HH:MM
  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header avec icône cloche */}
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
            {notifications.length > 0 && (
              <View
                style={[styles.badge, { backgroundColor: colors.orange[1] }]}
              >
                <KWText style={styles.badgeText}>{notifications.length}</KWText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* --- Sélection des enfants (mock pour l’instant) --- */}
          <KWCard
            style={{ backgroundColor: colors.background[0], marginBottom: 10 }}
          >
            <KWCardBody style={styles.childSelector}>
              {["Enfant 1", "Enfant 2"].map((child, index) => (
                <KWButton
                  key={child + index}
                  title={child}
                  bgColor={
                    selectedChild === child
                      ? colors.purple[1]
                      : colors.background[1]
                  }
                  color={selectedChild === child ? "white" : colors.purple[2]}
                  onPress={() => setSelectedChild(child)}
                />
              ))}
            </KWCardBody>
          </KWCard>

          {/* --- Liste des activités par jour --- */}
          <KWCard
            style={{ backgroundColor: colors.background[0], marginBottom: 15 }}
          >
            <KWCardHeader>
              <KWCardIcon>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.purple[2]}
                />
              </KWCardIcon>
              <KWCardTitle>
                <KWText type="h2" style={{ color: colors.purple[2] }}>
                  Mon planning
                </KWText>
              </KWCardTitle>
            </KWCardHeader>

            <KWCardBody>
              {sortedDays.length === 0 && (
                <KWText color={colors.text[0]}>
                  Aucune activité prévue pour le moment.
                </KWText>
              )}
              {sortedDays.map((day) => (
                <View
                  key={day + (groupedActivities[day][0]?._id || Math.random())}
                  style={{ marginBottom: 12 }}
                >
                  <KWText
                    type="h3"
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: colors.purple[2],
                    }}
                  >
                    {day}
                  </KWText>
                  {groupedActivities[day].map((a) => (
                    <TouchableOpacity
                      key={a._id}
                      onPress={() =>
                        navigation.navigate("ActivityDetails", { activity: a })
                      }
                    >
                      <KWCard
                        style={{
                          backgroundColor: colors.blue[0],
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <KWText
                          style={{ fontWeight: "600", color: colors.blue[2] }}
                        >
                          {a.name}
                        </KWText>
                        <KWText color={colors.text[0]}>
                          {formatTime(a.dateBegin)} → {formatTime(a.dateEnd)}
                        </KWText>
                      </KWCard>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </KWCardBody>
          </KWCard>
        </ScrollView>

        {/* Modal de notifications */}
        <KWModal visible={isModalVisible} onRequestClose={toggleModal}>
          <KWText
            type="h2"
            style={{ marginBottom: 10, color: colors.purple[2] }}
          >
            Notifications
          </KWText>
          {notifications.length === 0 ? (
            <KWText color={colors.text[0]}>Aucune notification.</KWText>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
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

                  {/*bouton pour valider/refuser invitation*/}
                  {item.type === "validation" && (
                    <View style={styles.actionButtons}>
                      <KWButton
                        title="Accepter"
                        bgColor={colors.green[1]}
                        onPress={() => console.log("accept")}
                      />
                      <KWButton
                        title="Refuser"
                        bgColor={colors.red[1]}
                        onPress={() => console.log("decline")}
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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    padddingTop: 10,
    position: "relative",
    marginBottom: 10,
  },
  logo: {
    width: "80%",
    height: undefined,
    aspectRatio: 3,
    marginBottom: 10,
  },
  title: {
    color: colors.blue[2],
  },
  scroll: {
    padding: 15,
    paddingBottom: 100,
  },
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
    backgroundColor: colors.red[2],
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  childSelector: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
});

export default HomeScreen;
