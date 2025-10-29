import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivitiesAsync } from "../reducers/activities";
import KWModal from "../components/KWModal";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

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
    <View style={{ flex: 1 }}>
      {/* Header avec icône cloche */}
      <View style={styles.header}>
        <Text style={styles.title}>KidsWeek</Text>
        <TouchableOpacity onPress={toggleModal} style={styles.bellContainer}>
          <Ionicons
            name="notifications-outline"
            size={28}
            color={colors.primary || "black"}
          />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Mon planning</Text>

        {/* --- Sélection des enfants (mock pour l’instant) --- */}
        <View style={styles.childSelector}>
          {["Enfant 1", "Enfant 2"].map((child, index) => (
            <TouchableOpacity
              key={child + index}
              style={[
                styles.childButton,
                selectedChild === child && styles.childButtonSelected,
              ]}
              onPress={() => setSelectedChild(child)}
            >
              <Text
                style={[
                  styles.childText,
                  selectedChild === child && styles.childTextSelected,
                ]}
              >
                {child}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Liste des activités par jour --- */}
        <ScrollView style={styles.listContainer}>
          {sortedDays.map((day) => (
            <View
              key={day + (groupedActivities[day][0]?._id || Math.random())}
              style={styles.dayContainer}
            >
              <Text style={styles.dayTitle}>{day}</Text>
              {groupedActivities[day].map((a) => (
                <TouchableOpacity
                  key={a._id}
                  style={styles.activityCard}
                  onPress={() =>
                    navigation.navigate("ActivityDetails", { activity: a })
                  }
                >
                  <Text style={styles.activityTitle}>{a.name}</Text>
                  <Text style={styles.activityTime}>
                    {formatTime(a.dateBegin)} → {formatTime(a.dateEnd)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Modal de notifications */}
      <KWModal visible={isModalVisible} onRequestClose={toggleModal}>
        <Text style={styles.modalTitle}>Notifications</Text>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>Aucune notification.</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>

                {/*bouton pour valider/refuser invitation*/}
                {item.type === "validation" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.acceptButtonText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </KWModal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bellContainer: {
    position: "relative",
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  childSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  childButton: {
    borderWidth: 1,
    borderColor: "#A78BFA",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  childButtonSelected: {
    backgroundColor: "#A78BFA",
  },
  childText: {
    color: "#A78BFA",
    fontWeight: "600",
  },
  childTextSelected: {
    color: "#FFF",
  },
  listContainer: {
    flex: 1,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  activityCard: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  activityTime: {
    color: "#64748B",
    fontSize: 14,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    color: "gray",
    fontStyle: "italic",
  },
  notificationItem: {
    width: "100%",
    backgroundColor: colors.background?.[1] || "#f7f7f7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  acceptButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
  },
});

export default HomeScreen;
