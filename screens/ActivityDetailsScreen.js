import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ActivityDetailsScreen = ({ route, navigation }) => {
  const { activity } = route.params;

  // fonction pour modifier: renvoi vers AddScreen avec l'activité en params

  const handleEdit = () => {
    navigation.navigate("AddScreen", { activityToEdit: activity });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{activity.name}</Text>

      <Text style={styles.label}>Lieu:</Text>
      <Text style={styles.value}>{activity.place || ""}</Text>

      <Text style={styles.label}>Début:</Text>
      <Text style={styles.value}>
        {new Date(activity.dateBegin).toLocaleString()}
      </Text>

      <Text style={styles.label}>Fin:</Text>
      <Text style={styles.value}>
        {new Date(activity.dateEnd).toLocaleString()}
      </Text>

      <Text style={styles.label}>Note:</Text>
      <Text style={styles.value}>{activity.note || ""}</Text>

      <Text style={styles.label}>Rappel:</Text>
      <Text style={styles.value}>
        {activity.reminder ? new Date(activity.reminder).toLocaleString() : ""}
      </Text>

      <Text style={styles.label}>Member:</Text>
      {activity.members.map((m) => (
        <Text key={m.email} style={styles.value}>
          {m.firstName || "Membre"}
        </Text>
      ))}

      {/* Bouton pour modifier l'activité */}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Modifier l'activité</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ActivityDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  value: { fontSize: 16, marginTop: 4 },
  editButton: {
    marginTop: 24,
    backgroundColor: "#A78BFA",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
