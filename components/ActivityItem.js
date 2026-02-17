import React from "react";
import { View, StyleSheet } from "react-native";
import KWCollapsible from "../components/KWCollapsible";
import KWText from "./KWText";
import KWButton from "./KWButton";
import { FontAwesome5 } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../theme/colors";

const ActivityItem = ({
  activity,
  isExpanded,
  onToggle,
  onTaskToggle,
  onEdit,
}) => {
  const activityPalette = colors[activity.color] || colors.purple;

  // Calcul du pourcentage de tâches complétées
  const calculateTaskCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.isOk).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const completionPercentage = calculateTaskCompletionPercentage(
    activity.tasks,
  );

  // Déterminer s'il s'agit d'une activité sur plusieurs jours
  const startDate = new Date(activity.dateBegin);
  const endDate = new Date(activity.dateEnd);
  const isMultiDay =
    startDate.toISOString().split("T")[0] !==
    endDate.toISOString().split("T")[0];

  // Vérifier si l'activité est passée
  const now = new Date();
  const isPast = endDate < now;

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
    ? `du ${formatDate(activity.dateBegin)} au ${formatDate(activity.dateEnd)}`
    : `de ${formatHour(activity.dateBegin)} → ${formatHour(activity.dateEnd)}`;

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
    <KWCollapsible
      title={activity.name}
      subtitle={subtitle}
      palette={activityPalette}
      isExpanded={isExpanded}
      onToggle={onToggle}
      rightHeader={
        activity.tasks?.length > 0 ? (
          <View
            style={[
              styles.percentageContainer,
              {
                backgroundColor:
                  completionPercentage < 50 ? colors.red[1] : colors.green[1],
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
              {completionPercentage}%
            </KWText>
          </View>
        ) : null
      }
    >
      <View style={styles.activityContent}>
        {/* Lieu */}
        {activity.place && (
          <>
            <View style={styles.infoRow}>
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={activityPalette[2]}
              />
              <KWText style={styles.infoText}>Lieu :</KWText>
            </View>
            <KWText style={styles.activityInfo}>{activity.place}</KWText>
          </>
        )}

        {/* Membres */}
        {activity.members?.length > 0 && (
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <FontAwesome5 name="users" size={14} color={activityPalette[2]} />
              <KWText style={[styles.infoText, { fontWeight: "600" }]}>
                Membres :
              </KWText>
            </View>
            <View style={styles.memberList}>
              {activity.members.map((m, i) => (
                <KWText key={i} style={styles.activityInfo}>
                  {m.firstName}
                </KWText>
              ))}
            </View>
          </View>
        )}

        {/* Tâches */}
        {activity.tasks?.length > 0 && (
          <View style={styles.checklistContainer}>
            <View style={[styles.infoRow, { marginBottom: 5 }]}>
              <FontAwesome5
                name="check-square"
                size={14}
                color={activityPalette[2]}
              />
              <KWText style={styles.checklistTextHeader}>Tâches :</KWText>
            </View>
            {activity.tasks.map((task) => (
              <View key={task._id} style={styles.checklistItem}>
                <BouncyCheckbox
                  size={20}
                  fillColor={colors.green[2]}
                  unFillColor="#FFFFFF"
                  text={task.text}
                  textStyle={{
                    fontFamily: "JosefinSans_400Regular",
                    textDecorationLine: isPast ? "line-through" : "none",
                    color: isPast ? "#999" : "#000",
                  }}
                  isChecked={task.isOk}
                  disabled={isPast}
                  disableBuiltInState={isPast}
                  onPress={(isChecked) => {
                    if (!isPast) {
                      onTaskToggle(activity._id, task._id, isChecked);
                    }
                  }}
                />
              </View>
            ))}
          </View>
        )}

        {/* Note */}
        {activity.note && (
          <>
            <View style={styles.infoRow}>
              <FontAwesome5
                name="sticky-note"
                size={14}
                color={activityPalette[2]}
              />
              <KWText style={styles.infoText}>Note :</KWText>
            </View>
            <KWText style={styles.activityInfo}>{activity.note}</KWText>
          </>
        )}

        {/* Bouton Modifier - N'apparaît que si l'activité n'est pas passée */}
        {!isPast && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <KWButton
              title="Modifier"
              icon="edit"
              bgColor={activityPalette[1]}
              color={getContrastColor(activityPalette[1])}
              style={{ minWidth: 150 }}
              onPress={() => onEdit(activity)}
            />
          </View>
        )}
      </View>
    </KWCollapsible>
  );
};

const styles = StyleSheet.create({
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

export default ActivityItem;
