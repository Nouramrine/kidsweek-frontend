import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import KWText from "./KWText";

const KWDateTimePicker = ({
  label,
  date,
  time, // Optionnel maintenant
  color,
  onDateChange,
  onTimeChange, // Optionnel maintenant
  dateError,
  showTime = true, // Nouvelle prop pour contrôler l'affichage de l'heure
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Gestion du changement de date
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      onDateChange(event, selectedDate);
    }
  };

  // Gestion du changement d'heure
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      onTimeChange(event, selectedTime);
    }
  };

  return (
    <View style={styles.section}>
      <KWText type="text" style={styles.label}>
        {label}
      </KWText>
      {dateError && <KWText type="inputError">{dateError}</KWText>}
      <View style={styles.dateTimeRow}>
        {/* Sélection de la date */}
        <TouchableOpacity
          style={[
            styles.dateButton,
            showTime ? { flex: 2, marginRight: 10 } : { flex: 1 },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <KWText type="text" style={styles.dateButtonText}>
            {date.toLocaleDateString("fr-FR")}
          </KWText>
        </TouchableOpacity>

        {/* Sélection de l'heure - affichée seulement si showTime est true */}
        {showTime && time && (
          <TouchableOpacity
            style={[styles.dateButton, { flex: 1 }]}
            onPress={() => setShowTimePicker(true)}
          >
            <KWText type="text" style={styles.dateButtonText}>
              {time.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </KWText>
          </TouchableOpacity>
        )}
      </View>

      {/* Affichage du DateTimePicker pour la date */}
      {showDatePicker && (
        <DateTimePicker
          color={color}
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Affichage du DateTimePicker pour l'heure */}
      {showTime && showTimePicker && time && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#1F2937",
  },
});

export default KWDateTimePicker;
