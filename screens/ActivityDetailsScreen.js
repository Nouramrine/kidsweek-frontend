import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardBody,
} from "../components/KWCard";
import KWText from "../components/KWText";
import KWButton from "../components/KWButton";
import { colors } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const ActivityDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { activity } = route.params;

  // 🔹 Fonction pour modifier : renvoi vers AddScreen avec l'activité en params
  const handleEdit = () => {
    navigation.navigate("AddScreen", { activityToEdit: activity });
  };

  // 🔹 Déterminer la couleur dominante selon le jour de l’activité
  const dayColors = {
    lundi: colors.blue,
    mardi: colors.green,
    mercredi: colors.purple,
    jeudi: colors.orange,
    vendredi: colors.pink,
    samedi: colors.yellow,
    dimanche: colors.skin,
  };
  const dayIndex = new Date(activity.dateBegin).getDay();
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
  const palette = dayColors[dayName] || colors.blue;

  // 🔹 Format date
  const formatDate = (date) =>
    new Date(date).toLocaleString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background[1] }]}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 🔸 En-tête principale avec nom et lieu */}
        <KWCard style={[styles.mainCard, { backgroundColor: palette[0] }]}>
          <KWCardHeader>
            <KWCardIcon>
              <Ionicons name="calendar-outline" size={22} color={palette[2]} />
            </KWCardIcon>
            <KWCardTitle>
              <KWText type="h1" style={{ color: palette[2] }}>
                {activity.name}
              </KWText>
            </KWCardTitle>
          </KWCardHeader>
          <KWCardBody>
            {activity.place ? (
              <KWText type="h2" style={{ color: palette[1] }}>
                📍 {activity.place}
              </KWText>
            ) : null}
          </KWCardBody>
        </KWCard>

        {/* 🔸 Détails de l’activité */}
        <KWCard
          style={[
            styles.detailCard,
            {
              backgroundColor: colors.background[0],
              borderLeftColor: palette[2],
            },
          ]}
        >
          <KWCardBody>
            <KWText type="h2" style={styles.label}>
              🕒 Début :
            </KWText>
            <KWText>{formatDate(activity.dateBegin)}</KWText>

            <KWText type="h2" style={styles.label}>
              ⏰ Fin :
            </KWText>
            <KWText>{formatDate(activity.dateEnd)}</KWText>

            {activity.note ? (
              <>
                <KWText type="h2" style={styles.label}>
                  📝 Note :
                </KWText>
                <KWText>{activity.note}</KWText>
              </>
            ) : null}

            {activity.reminder ? (
              <>
                <KWText type="h2" style={styles.label}>
                  🔔 Rappel
                </KWText>
                <KWText>
                  {activity.reminder
                    ? formatDate(activity.reminder)
                    : "Aucun rappel"}
                </KWText>
              </>
            ) : null}

            {activity.members?.length > 0 && (
              <>
                <KWText type="h2" style={styles.label}>
                  👥 Membres :
                </KWText>
                {activity.members.map((m) => (
                  <KWText key={m.email}>• {m.firstName || "Membre"}</KWText>
                ))}
              </>
            )}
          </KWCardBody>
        </KWCard>

        {/* 🔸 Bouton Modifier */}
        <View style={styles.buttonContainer}>
          <KWButton
            title="Modifier l'activité"
            icon="edit"
            bgColor={palette[1]}
            onPress={handleEdit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 15,
  },
  mainCard: {
    marginBottom: 14,
    borderRadius: 16,
  },
  detailCard: {
    borderRadius: 12,
    borderLeftWidth: 5,
    marginBottom: 18,
    paddingVertical: 6,
  },
  label: {
    marginTop: 10,
    fontWeight: "700",
    color: colors.text[0],
  },
  value: {
    marginTop: 6,
    fontSize: 15,
    color: "#222",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 6,
  },
});
