import React from "react";
import { View, StyleSheet } from "react-native";
import {
  KWCard,
  KWCardHeader,
  KWCardTitle,
  KWCardBody,
  KWCardIcon,
} from "../../../components/KWCard";
import KWText from "../../../components/KWText";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import ActivityItem from "./ActivityItem";

const dayColors = {
  lundi: colors.blue,
  mardi: colors.green,
  mercredi: colors.purple,
  jeudi: colors.orange,
  vendredi: colors.pink,
  samedi: colors.yellow,
  dimanche: colors.skin,
};

const PlanningCard = ({
  selectedChild,
  groupedActivities,
  sortedDays,
  expandedActivityId,
  onToggleActivity,
  onTaskToggle,
}) => {
  return (
    <KWCard style={style.card}>
      <KWCardHeader>
        <KWCardIcon>
          <Ionicons
            name="calendar-outline"
            size={30}
            color={colors.purple[2]}
          />
        </KWCardIcon>
        <KWCardTitle>
          <KWText type="h2" style={{ color: colors.purple[2] }}>
            {selectedChild
              ? `Planning de ${selectedChild.firstName}`
              : "Mon planning"}
          </KWText>
        </KWCardTitle>
      </KWCardHeader>

      <KWCardBody>
        {sortedDays.length === 0 ? (
          <KWText style={{ textAlign: "center" }}>
            Aucune activité prévue.
          </KWText>
        ) : (
          sortedDays.map((day) => {
            const dayName = day.split(" ")[0].toLowerCase();
            const palette = dayColors[dayName] || colors.blue;

            const activitiesOfDay = groupedActivities?.[day] || [];

            return (
              <View key={day} style={{ marginBottom: 5 }}>
                <KWText
                  type="h3"
                  style={{
                    fontWeight: "bold",
                    marginBottom: 8,
                    color: palette[2],
                    paddingHorizontal: 15,
                  }}
                >
                  {day}
                </KWText>

                {activitiesOfDay.map((activity) => (
                  <ActivityItem
                    key={activity._id}
                    activity={activity}
                    isExpanded={expandedActivityId === activity._id}
                    onToggle={() => onToggleActivity(activity._id)}
                    onTaskToggle={onTaskToggle}
                  />
                ))}
              </View>
            );
          })
        )}
      </KWCardBody>
    </KWCard>
  );
};

const style = StyleSheet.create({
  card: { backgroundColor: colors.background[0], marginBottom: 15 },
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

export default PlanningCard;
