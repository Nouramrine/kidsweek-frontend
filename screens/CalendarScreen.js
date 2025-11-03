import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { KWCard } from "../components/KWCard";
import KWText from "../components/KWText";
import KWCollapsible from "../components/KWCollapsible";
import KWButton from "../components/KWButton";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const activities = useSelector((state) => state.activities.value);

  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [activitiesOfDay, setActivitiesOfDay] = useState([]);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

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
      const date = activity.dateBegin ? activity.dateBegin.split("T")[0] : null;
      if (date) {
        marks[date] = { marked: true, dotColor: colors.purple[2] };
      }
    });
    setMarkedDates(marks);
  }, [activities]);

  // Gérer la sélection d'une date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setExpandedActivityId(null); // Fermer toutes les activités lors du changement de date

    // Filtrer les activités de cette date
    const filtred = activities.filter(
      (a) => a.dateBegin && a.dateBegin.split("T")[0] === day.dateString
    );
    setActivitiesOfDay(filtred);
  };

  //mettre la date sous la forme DD/MM/YYYY
  const formatDateFR = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

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
                  renderItem={({ item }) => {
                    // ✅ Utilise la couleur de l'activité au lieu de celle du jour
                    const activityPalette = colors[item.color] || colors.purple;

                    return (
                      <KWCollapsible
                        title={item.name}
                        subtitle={`${formatTime(item.dateBegin)} → ${formatTime(
                          item.dateEnd
                        )}`}
                        palette={activityPalette}
                        isExpanded={expandedActivityId === item._id}
                        onToggle={() => toggleActivity(item._id)}
                      >
                        <KWText>📍 {item.place || "Lieu non précisé"}</KWText>
                        {item.note && <KWText>📝 {item.note}</KWText>}
                        {item.members?.length > 0 && (
                          <View style={{ marginTop: 8 }}>
                            <KWText type="h3">👥 Membres :</KWText>
                            {item.members.map((m) => (
                              <KWText key={m._id}>• {m.firstName}</KWText>
                            ))}
                          </View>
                        )}
                        <View style={{ alignItems: "center", marginTop: 10 }}>
                          <KWButton
                            title="Modifier"
                            icon="edit"
                            bgColor={activityPalette[1]}
                            color="white"
                            style={{ minWidth: 150 }}
                            onPress={() =>
                              navigation.navigate("AddScreen", {
                                activityToEdit: item,
                              })
                            }
                          />
                        </View>
                      </KWCollapsible>
                    );
                  }}
                />
              ) : (
                <KWText style={styles.noActivity}>
                  Aucune activité ce jour-là.
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
