import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
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
  const membersList = useSelector((state) => state.members.value);

  const dispatch = useDispatch();

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
    //  Regrouper les activités par date et par membre
    const activitiesByDateAndMember = {};
    activities.forEach((activity) => {
      // Vérification que activity.members existe et n'est pas vide
      if (!activity.members || activity.members.length === 0) {
        console.warn("Activité sans membres :", activity._id);
        return;
      }

      // Formatage des dates
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

        // Pour chaque jour de l'activité
        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split("T")[0];

          // Pour chaque membre de l'activité
          activity.members?.forEach((member) => {
            const memberId = member._id;
            // Si date inexistante dans l'objet
            if (!activitiesByDateAndMember[dateString]) {
              // Init de l'objet pour cette date
              activitiesByDateAndMember[dateString] = {};
            }
            if (!activitiesByDateAndMember[dateString][memberId]) {
              // Init du tableau des activités pour le membre s'il n'existe pas
              activitiesByDateAndMember[dateString][memberId] = [];
            }
            // Ajout de l'activité
            activitiesByDateAndMember[dateString][memberId].push(activity);
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Idem pour activité sur un seul jour
        activity.members?.forEach((member) => {
          const memberId = member._id;
          // Initialisation de l'objet pour la date de début (si inexistante)
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

    // Étape 2 : Créer les marques pour le calendrier
    Object.keys(activitiesByDateAndMember).forEach((dateStr) => {
      const members = activitiesByDateAndMember[dateStr];
      const memberIds = Object.keys(members);
      // Compter le nombre total d'activités pour cette date
      let totalActivities = 0;
      memberIds.forEach((memberId) => {
        totalActivities += members[memberId].length;
      });

      // Limiter à 3 marqueurs maximum par jour (un par membre)
      const periods = memberIds.slice(0, 3).map((memberId) => {
        const memberObj = membersList.find((m) => m._id === memberId);
        const memberColor = colors[memberObj?.color]?.[2] || colors.purple[2];
        return {
          startingDay: true,
          endingDay: true,
          color: memberColor,
        };
      });

      // Garantir au moins un marqueur si totalActivities > 0
      if (periods.length === 0 && totalActivities > 0) {
        periods.push({
          startingDay: true,
          endingDay: true,
          color: colors.purple[2],
        });
      }

      marks[dateStr] = { periods };
    });

    setMarkedDates(marks);
  }, [activities, selectedDate]);

  // Gérer la sélection d'une date
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setExpandedActivityId(null); // Fermer toutes les activités lors du changement de date

    // Filtrer les activités de cette date
    const filtred = activities.filter(
      (a) => a.dateBegin && a.dateBegin.split("T")[0] === day.dateString,
    );
    setActivitiesOfDay(filtred);
  };

  //mettre la date sous la forme DD/MM/YYYY
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
        // Mise à jour locale immédiate de activitiesOfDay
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
  const calculateTaskCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;

    const completedTasks = tasks.filter((task) => task.isOk).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  // configuration du calendrier en francais
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

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "white";
    const c = hexColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 180 ? "black" : "white";
  };

  return (
    <View style={styles.container}>
      <Calendar
        //debut de la semaine Lundi
        firstDay={1}
        // permet le swipe
        enableSwipeMonths={true}
        // permet l'affichage plusieurs point sur une journée
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
          // Style general
          backgroundColor: "#FAFAFA",
          calendarBackground: "#FFFFFF",
          textSectionTitleColor: palette[2],
          selectedDayBackgroundColor: palette[0], // Couleur pastel
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: palette[2],
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          //dotColor: palette[0],
          selectedDotColor: "#FFFFFF",
          arrowColor: palette[2],
          monthTextColor: palette[2],

          // Font personnalisées
          textDayFontFamily: "JosefinSans_400Regular",
          textMonthFontFamily: "JosefinSans_600SemiBold",
          textDayHeaderFontFamily: "JosefinSans_400Regular",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,

          //  en-tête des jours
          "stylesheet.calendar.header": {
            week: {
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: palette[0], // Fond pastel
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
                renderItem={({ item }) => {
                  // ✅ Utilise la couleur de l'activité au lieu de celle du jour
                  const activityPalette = colors[item.color] || colors.purple;
                  // Calcul du pourcentage de tâches complétées
                  const completionPercentage =
                    calculateTaskCompletionPercentage(item.tasks);
                  // Déterminer s’il s’agit d’une activité sur plusieurs jours
                  const startDate = new Date(item.dateBegin);
                  const endDate = new Date(item.dateEnd);
                  const isMultiDay =
                    startDate.toISOString().split("T")[0] !==
                    endDate.toISOString().split("T")[0];

                  // Formater les affichages
                  const formatDate = (dateStr) =>
                    new Date(dateStr).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });

                  const formatHour = (dateStr) =>
                    new Date(dateStr).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                  const subtitle = isMultiDay
                    ? `du ${formatDate(item.dateBegin)} au ${formatDate(
                        item.dateEnd,
                      )}`
                    : `de ${formatHour(item.dateBegin)} → ${formatHour(
                        item.dateEnd,
                      )}`;
                  return (
                    <KWCollapsible
                      key={item._id}
                      title={item.name}
                      subtitle={subtitle}
                      palette={activityPalette}
                      isExpanded={expandedActivityId === item._id}
                      onToggle={() => toggleActivity(item._id)}
                      rightHeader={
                        item.tasks?.length > 0 ? (
                          <View
                            style={[
                              styles.percentageContainer,
                              {
                                backgroundColor:
                                  calculateTaskCompletionPercentage(
                                    item.tasks,
                                  ) < 50
                                    ? colors.red[1]
                                    : colors.green[1],
                              },
                            ]}
                          >
                            <FontAwesome5
                              name="check-circle"
                              size={14}
                              color={colors.green[0]}
                              style={{ marginRight: 5, padding: 3 }}
                            />
                            <KWText style={styles.percentageText}>
                              {calculateTaskCompletionPercentage(item.tasks)}%
                            </KWText>
                          </View>
                        ) : null
                      }
                    >
                      <View style={styles.activityContent}>
                        {item.note && (
                          <>
                            <View style={styles.infoRow}>
                              <FontAwesome5
                                name="map-marker-alt"
                                size={14}
                                color={activityPalette[2]}
                              />
                              <KWText style={styles.infoText}>Lieu :</KWText>
                            </View>
                            <KWText style={styles.activityInfo}>
                              {item.place}
                            </KWText>
                          </>
                        )}
                        {item.members?.length > 0 && (
                          <View style={styles.infoBlock}>
                            <View style={styles.infoRow}>
                              <FontAwesome5
                                name="users"
                                size={14}
                                color={activityPalette[2]}
                              />
                              <KWText
                                style={[styles.infoText, { fontWeight: "600" }]}
                              >
                                Membres :
                              </KWText>
                            </View>
                            <View style={styles.memberList}>
                              {item.members.map((m, i) => (
                                <KWText key={i} style={styles.activityInfo}>
                                  {m.firstName}
                                </KWText>
                              ))}
                            </View>
                          </View>
                        )}
                        {item.tasks?.length > 0 && (
                          <View style={styles.checklistContainer}>
                            <View style={[styles.infoRow, { marginBottom: 5 }]}>
                              <FontAwesome5
                                name="check-square"
                                size={14}
                                color={activityPalette[2]}
                              />
                              <KWText style={styles.checklistTextHeader}>
                                Tâches :
                              </KWText>
                            </View>
                            {item.tasks.map((task) => (
                              <View key={task._id} style={styles.checklistItem}>
                                <BouncyCheckbox
                                  size={20}
                                  fillColor={colors.green[2]}
                                  unFillColor="#FFFFFF"
                                  text={task.text}
                                  textStyle={{
                                    fontFamily: "JosefinSans_400Regular",
                                  }}
                                  isChecked={task.isOk}
                                  onPress={(isChecked) => {
                                    handleTaskToggle(
                                      item._id,
                                      task._id,
                                      isChecked,
                                    );
                                  }}
                                />
                              </View>
                            ))}
                          </View>
                        )}
                        {item.note && (
                          <>
                            <View style={styles.infoRow}>
                              <FontAwesome5
                                name="sticky-note"
                                size={14}
                                color={activityPalette[2]}
                              />
                              <KWText style={styles.infoText}>Note :</KWText>
                            </View>
                            <KWText style={styles.activityInfo}>
                              {item.note}
                            </KWText>
                          </>
                        )}

                        <View style={{ alignItems: "center", marginTop: 0 }}>
                          <KWButton
                            title="Modifier"
                            icon="edit"
                            bgColor={activityPalette[1]}
                            color={getContrastColor(activityPalette[1])}
                            style={{ minWidth: 150 }}
                            onPress={() =>
                              navigation.navigate("AddScreen", {
                                activityToEdit: item,
                              })
                            }
                          />
                        </View>
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
    paddingHorizontal: 20,
  },
  noActivity: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 5,
    borderRadius: 10,
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
