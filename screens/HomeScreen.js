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

const HomeScreen = () => {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.value);
  const user = useSelector((state) => state.user.value);

  const [selectedChild, setSelectedChild] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon planning</Text>

      {/* --- Sélection des enfants (mock pour l’instant) --- */}
      <View style={styles.childSelector}>
        {["Enfant 1", "Enfant 2"].map((child) => (
          <TouchableOpacity
            key={child}
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
        {Object.entries(groupedActivities).map(([day, acts]) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {acts.map((a) => (
              <View key={a._id} style={styles.activityCard}>
                <Text style={styles.activityTitle}>{a.name}</Text>
                <Text style={styles.activityTime}>
                  {a.start} → {a.end}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
});
