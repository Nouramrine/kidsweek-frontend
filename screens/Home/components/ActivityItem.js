import React from "react";
import { View, StyleSheet } from "react-native";
import KWText from "../../../components/KWText";
import KWButton from "../../../components/KWButton";
import KWCollapsible from "../../../components/KWCollapsible";
import { FontAwesome5 } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../../../theme/colors";

const calculateTaskCompletionPercentage = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.isOk).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} à ${time}`;
};

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

const ActivityItem = ({
  activity,
  isExpanded,
  onToggle,
  onEdit,
  onTaskToggle,
}) => {
  const activityPalette = colors[activity.color] || colors.purple;

  const completion = calculateTaskCompletionPercentage(activity.tasks);

  return (
    <KWCollapsible
      title={activity.name}
      subtitle={`${formatDateTime(activity.dateBegin)} → ${formatDateTime(activity.dateEnd)}`}
      palette={activityPalette}
      isExpanded={isExpanded}
      onToggle={onToggle}
      rightHeader={
        activity.tasks?.length > 0 && (
          <View
            style={[
              styles.percent,
              {
                backgroundColor:
                  completion < 50 ? colors.red[1] : colors.green[1],
              },
            ]}
          >
            <FontAwesome5
              name="check-circle"
              size={14}
              color={colors.green[0]}
            />
            <KWText style={styles.percentText}>{completion}%</KWText>
          </View>
        )
      }
    >
      <View style={styles.content}>
        {activity.tasks?.map((task) => (
          <View key={task._id} style={styles.task}>
            <BouncyCheckbox
              size={20}
              fillColor={colors.green[2]}
              text={task.text}
              isChecked={task.isOk}
              onPress={(checked) =>
                onTaskToggle(activity._id, task._id, checked)
              }
            />
          </View>
        ))}

        <KWButton
          title="Modifier"
          icon="edit"
          bgColor={activityPalette[1]}
          color={getContrastColor(activityPalette[1])}
          style={{ alignSelf: "center", minWidth: 150 }}
          onPress={() => onEdit(activity)}
        />
      </View>
    </KWCollapsible>
  );
};

const styles = StyleSheet.create({
  content: { padding: 15, gap: 15 },
  task: {
    backgroundColor: colors.background[1],
    padding: 10,
    borderRadius: 10,
  },
  percent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    gap: 5,
  },
  percentText: {
    fontSize: 13,
    color: colors.green[0],
    fontWeight: "600",
  },
});

export default ActivityItem;
