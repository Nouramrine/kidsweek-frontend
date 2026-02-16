import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";
import KWText from "../components/KWText";
import { updateTaskAsync } from "../reducers/activities";
import ActivityItem from "./Home/components/ActivityItem";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const activities = useSelector((state) => state.activities.value);
  const user = useSelector((state) => state.user.value || {});
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [activitiesOfDay, setActivitiesOfDay] = useState([]);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const membersList = useSelector((state) => state.members.value);

  const dispatch = useDispatch();

  const toggleActivity = (id) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  // Code couleur par jour
  const dayColors = {
    lundi: colors.blue,
    mardi: colors.green,
    mercredi: colors.purple,
    jeudi: colors.orange,
    vendredi: colors.pink,
    samedi: colors.yellow,
    dimanche: colors.skin,
  };

  // Configuration du calendrier en français
  LocaleConfig.locales["fr"] = {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Janv.",
      "Févr.",
      "Mars",
      "Avr.",
      "Mai",
      "Juin",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    today: "Aujourd'hui",
  };

  LocaleConfig.defaultLocale = "fr";

  // Marquer les dates avec des activités
  useEffect(() => {
    const marks = {};
    const activitiesByDateAndMember = {};

    activities.forEach((activity) => {
      if (!activity.members || activity.members.length === 0) {
        console.warn("Activité sans membres :", activity._id);
        return;
      }

      const dateBeginStr = activity.dateBegin
        ? activity.dateBegin.split("T")[0]
        : null;
      const dateEndStr = activity.dateEnd
        ? activity.dateEnd.split("T")[0]
        : null;
      if (!dateBeginStr) return;

      // Gestion des activités sur plusieurs jours
      if (dateEndStr && dateBeginStr !== dateEndStr) {
        const startDate = new Date(dateBeginStr);
        const endDate = new Date(dateEndStr);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split("T")[0];

          activity.members?.forEach((member) => {
            const memberId = member._id;
            if (!activitiesByDateAndMember[dateString]) {
              activitiesByDateAndMember[dateString] = {};
            }
            if (!activitiesByDateAndMember[dateString][memberId]) {
              activitiesByDateAndMember[dateString][memberId] = [];
            }
            activitiesByDateAndMember[dateString][memberId].push(activity);
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        activity.members?.forEach((member) => {
          const memberId = member._id;
          if (!activitiesByDateAndMember[dateBeginStr]) {
            activitiesByDateAndMember[dateBeginStr] = {};
          }
          if (!activitiesByDateAndMember[dateBeginStr][memberId]) {
            activitiesByDateAndMember[dateBeginStr][memberId] = [];
          }
          activitiesByDateAndMember[dateBeginStr][memberId].push(activity);
        });
      }
    });

    // Créer les marques pour le calendrier
    Object.keys(activitiesByDateAndMember).forEach((dateStr) => {
      const members = activitiesByDateAndMember[dateStr];
      const memberIds = Object.keys(members);

      const periods = memberIds.slice(0, 3).map((memberId) => {
        const memberObj = membersList.find((m) => m._id === memberId);
        const memberColor = colors[memberObj?.color]?.[2] || colors.purple[2];
        return {
          startingDay: true,
          endingDay: true,
          color: memberColor,
        };
      });

      if (periods.length === 0) {
        periods.push({
          startingDay: true,
          endingDay: true,
          color: colors.purple[2],
        });
      }

      marks[dateStr] = { periods };
    });

    setMarkedDates(marks);
  }, [activities, membersList]);

  // Gérer la sélection d'une date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setExpandedActivityId(null);

    const filtered = activities.filter(
      (a) => a.dateBegin && a.dateBegin.split("T")[0] === day.dateString,
    );
    setActivitiesOfDay(filtered);
  };

  // Mettre la date sous la forme DD/MM/YYYY
  const formatDateFR = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
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
        setActivitiesOfDay((prev) =>
          prev.map((activity) =>
            activity._id === activityId
              ? {
                  ...activity,
                  tasks: activity.tasks.map((t) =>
                    t._id === taskId ? { ...t, isOk: isChecked } : t,
                  ),
                }
              : activity,
          ),
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        firstDay={1}
        enableSwipeMonths={true}
        markingType="multi-period"
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  periods: markedDates[selectedDate]?.periods || [],
                  selected: true,
                  selectedColor: palette[1],
                },
              }
            : {}),
        }}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: "#FAFAFA",
          calendarBackground: "#FFFFFF",
          textSectionTitleColor: palette[2],
          selectedDayBackgroundColor: palette[0],
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: palette[2],
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          selectedDotColor: "#FFFFFF",
          arrowColor: palette[2],
          monthTextColor: palette[2],
          textDayFontFamily: "JosefinSans_400Regular",
          textMonthFontFamily: "JosefinSans_600SemiBold",
          textDayHeaderFontFamily: "JosefinSans_400Regular",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
          "stylesheet.calendar.header": {
            week: {
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: palette[0],
              paddingVertical: 8,
              borderRadius: 10,
              paddingHorizontal: 15,
            },
          },
        }}
        style={{
          borderRadius: 15,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          margin: 10,
          backgroundColor: "#FFFFFF",
        }}
      />

      <View style={styles.listContainer}>
        {selectedDate ? (
          <>
            <KWText type="h2" style={{ marginBottom: 5 }}>
              Activités du {formatDateFR(selectedDate)}
            </KWText>

            {activitiesOfDay.length > 0 ? (
              <FlatList
                data={activitiesOfDay}
                keyExtractor={(item) => item._id}
                extraData={activitiesOfDay}
                renderItem={({ item }) => (
                  <ActivityItem
                    activity={item}
                    isExpanded={expandedActivityId === item._id}
                    onToggle={() => toggleActivity(item._id)}
                    onTaskToggle={handleTaskToggle}
                    onEdit={(activity) =>
                      navigation.navigate("AddScreen", {
                        activityToEdit: activity,
                      })
                    }
                  />
                )}
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
    paddingHorizontal: 20,
  },
  noActivity: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 5,
    borderRadius: 10,
  },
});
