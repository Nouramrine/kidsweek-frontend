import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const activities = useSelector((state) => state.activities.value);

  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [activitiesOfDay, setActivitiesOfDay] = useState([]);

  // Marquer les dates avec des activités

  useEffect(() => {
    const marks = {};
    activities.forEach((activity) => {
      const date = activity.dateBegin?.split("T")[0];
      if (date) {
        marks[date] = { marked: true, dotColor: "#8E7EED" };
      }
    });
    setMarkedDates(marks);
  }, [activities]);

  // Gérer la sélection d'une date

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);

    // Filtrer les activités de cette date
    const filtred = activities.filter(
      (a) => a.dateBegin.split("T")[0] === day.dateString
    );
    setActivitiesOfDay(filtred);
  };

  // Cliquer sur une activité = ouvre ActivityDetailsScreen

  const handleActivityPress = (activity) => {
    navigation.navigate("ActivityDetailsScreen", { activity });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#8E7EED",
                  marked: markedDates[selectedDate]?.marked,
                  dotColor: "#fff",
                },
              }
            : {}),
        }}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: "#8E7EED",
          arrowColor: "#8E7EED",
          textSectionTitleColor: "#94A3B8",
        }}
      />

      <View style={styles.listContainer}>
        {selectedDate ? (
          <>
            <Text style={styles.dateTitle}>Activités du {selectedDate}</Text>

            {activitiesOfDay.length > 0 ? (
              <FlatList
                data={activitiesOfDay}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.activityCard}
                    onPress={() => handleActivityPress(item)}
                  >
                    <Text style={styles.activityTitle}>{item.name}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(item.dateBegin).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(item.dateEnd).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noActivity}>
                Aucune activité ce jour-là.{" "}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.selectedDayText}>
            Sélectionnez une date pour voir les activités.
          </Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { flex: 1, padding: 15 },
  dateTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  activityCard: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  activityTitle: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  activityTime: { color: "#64748B" },
  noActivity: { textAlign: "center", color: "#94A3B8", marginTop: 20 },
  selectDayText: { textAlign: "center", color: "#94A3B8", marginTop: 30 },
});
