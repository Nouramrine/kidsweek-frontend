import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
//import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { KWCard } from "../components/KWCard";
import KWText from "../components/KWText";
import KWCollapsible from "../components/KWCollapsible";
import KWButton from "../components/KWButton";
import {
  updateActivityAsync,
  updateTaskAsync,
  fetchActivitiesAsync,
} from "../reducers/activities";
import { FontAwesome5 } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
export default function CalendarScreen() {
  const navigation = useNavigation();
  const activities = useSelector((state) => state.activities.value);
  const user = useSelector((state) => state.user.value || {});
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [activitiesOfDay, setActivitiesOfDay] = useState([]);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };
  const dispatch = useDispatch();

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
  }, [activities, selectedDate]);

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

  const handleTaskToggle = async (activityId, taskId, isChecked) => {
    try {
      const result = await dispatch(
        updateTaskAsync({
          activityId,
          taskId,
          isOk: isChecked,
          token: user.token,
        })
      ).unwrap();

      if (result) {
        // console.log("Tâche mise à jour avec succès");
        await dispatch(fetchActivitiesAsync(user.token));
        if (selectedDate) {
          const filtred = activities.filter(
            (a) => a.dateBegin && a.dateBegin.split("T")[0] === selectedDate
          );
          setActivitiesOfDay(filtred);
        }
      }
    } catch (error) {
      console.error(" Erreur lors de la mise à jour de la tâche:", error);
    }
  };
  const calculateTaskCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.isOk).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  console.log(activities);
  return (
    <View style={[styles.container, { fontFamily: "JosefinSans_400Regular" }]}>
      <Calendar
        enableSwipeMonths={true}
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
                extraData={activitiesOfDay}
                renderItem={({ item }) => {
                  // ✅ Utilise la couleur de l'activité au lieu de celle du jour
                  const activityPalette = colors[item.color] || colors.purple;
                  // Calcul du pourcentage de tâches complétées
                  const completionPercentage =
                    calculateTaskCompletionPercentage(item.tasks);
                  return (
                    <KWCollapsible
                      title={item.name}
                      subtitle={`${formatTime(item.dateBegin)} → ${formatTime(
                        item.dateEnd
                      )}`}
                      palette={activityPalette}
                      isExpanded={expandedActivityId === item._id}
                      onToggle={() => toggleActivity(item._id)}
                      rightHeader={
                        item.tasks && item.tasks.length > 0 ? (
                          <View style={styles.percentageContainer}>
                            <KWText style={styles.percentageText}>
                              Tache(s): {completionPercentage}%
                            </KWText>
                          </View>
                        ) : null
                      }
                    >
                      <KWText>📍 {item.place || "Lieu non précisé"}</KWText>
                      {item.note && <KWText>📝 {item.note}</KWText>}
                      {item.members?.length > 0 && (
                        <View style={{ marginTop: 8 }}>
                          <KWText type="h3">👥 Membres :</KWText>
                          {item.members.map((m) => (
                            <KWText key={m._id}>• {m.firstName}</KWText>
                          ))}
                          {/* affichages des tasks */}
                          <View style={styles.checklistContainer}>
                            <View style={styles.cheklistHeader}>
                              <FontAwesome5
                                name="check-square"
                                size={18}
                                color={colors.green[2]}
                              />
                              <KWText style={styles.checklistTextHeader}>
                                A faire :
                              </KWText>
                            </View>
                            {item &&
                              item.tasks.length > 0 &&
                              item.tasks.map((c, i) => (
                                <View key={i} style={styles.checklistItem}>
                                  {/*<KWText
                                      type="text"
                                      style={styles.checklistItemText}
                                    >
                                      {c.text}
                                    </KWText>*/}
                                  <BouncyCheckbox
                                    size={20}
                                    fillColor={colors.green[2]}
                                    unFillColor="#FFFFFF"
                                    text={c.text}
                                    iconStyle={{ borderColor: "red" }}
                                    innerIconStyle={{ borderWidth: 2 }}
                                    textStyle={{
                                      fontFamily: "JosefinSans_400Regular",
                                    }}
                                    isChecked={c.isOk} // État initial
                                    onPress={(isChecked) =>
                                      handleTaskToggle(
                                        item._id,
                                        c._id,
                                        isChecked
                                      )
                                    }
                                  />
                                </View>
                              ))}
                          </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
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
  checklistContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  cheklistHeader: {
    flex: 1,
    flexDirection: "row",
  },
  checklistTextHeader: {
    marginLeft: 8,
  },
  checklistItem: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.blue[1],
    marginBottom: 4,
    paddingLeft: 5,
  },
});
