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
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { KWCard } from "../components/KWCard";
import KWText from "../components/KWText";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const activities = useSelector((state) => state.activities.value);

  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [activitiesOfDay, setActivitiesOfDay] = useState([]);

  //code couleur par jour
  const dayColors = {
    lundi: colors.blue,
    mardi: colors.green,
    mercredi: colors.purple,
    jeudi: colors.orange,
    vendredi: colors.pink,
    samedi: colors.yellow,
    dimanche: colors.skin,
  };

  // Marquer les dates avec des activités

  useEffect(() => {
    const marks = {};
    activities.forEach((activity) => {
      const date = activity.dateBegin?.split("T")[0];
      if (date) {
        marks[date] = { marked: true, dotColor: colors.purple[2] };
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
  //mettre la date sous la forme DD/MM/YYYY

  const formatDateFR = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };
  // Cliquer sur une activité = ouvre ActivityDetailsScreen

  const handleActivityPress = (activity) => {
    navigation.navigate("ActivityDetails", { activity });
  };

  // Couleur dominante du jour sélectionné
  const getDayPalette = (dateStr) => {
    if (!dateStr) return colors.blue;
    const dayIndex = new Date(dateStr).getDay();
    const dayNames = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const dayName = dayNames[dayIndex];
    return dayColors[dayName] || colors.blue;
  };

  const palette = getDayPalette(selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Calendar
          markedDates={{
            ...markedDates,
            ...(selectedDate
              ? {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: palette[2],
                    marked: markedDates[selectedDate]?.marked,
                    dotColor: "#fff",
                  },
                }
              : {}),
          }}
          onDayPress={handleDayPress}
          theme={{
            todayTextColor: palette[2],
            arrowColor: palette[2],
            textSectionTitleColor: "#94A3B8",
          }}
        />

        <View style={styles.listContainer}>
          {selectedDate ? (
            <>
              <KWText type="h2" style={{ marginBottom: 10 }}>
                Activités du {formatDateFR(selectedDate)}
              </KWText>

              {activitiesOfDay.length > 0 ? (
                <FlatList
                  data={activitiesOfDay}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.activityCard}
                      onPress={() => handleActivityPress(item)}
                    >
                      <KWCard
                        style={{
                          backgroundColor: palette[0],
                          borderLeftWidth: 5,
                          borderLeftColor: palette[2],
                          marginBottom: 10,
                          paddingVertical: 10,
                        }}
                      >
                        <KWText
                          type="h3"
                          style={{
                            fontWeight: "600",
                            color: palette[2],
                          }}
                        >
                          {item.name}
                        </KWText>
                        <KWText style={{ color: "#222" }}>
                          {new Date(item.dateBegin).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(item.dateEnd).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </KWText>
                      </KWCard>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <KWText style={styles.noActivity}>
                  Aucune activité ce jour-là.{" "}
                </KWText>
              )}
            </>
          ) : (
            <KWText style={styles.noActivity}>
              Sélectionnez une date pour voir les activités.
            </KWText>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    flex: 1,
    padding: 15,
  },
  noActivity: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
  },
});
