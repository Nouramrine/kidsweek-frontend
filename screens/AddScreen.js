import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Switch,
  Button,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "expo-checkbox";
//import RNPickerSelect from "react-native-picker-select";
import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import KWText from "../components/KWText";

const AddScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [activityName, setActivityName] = useState("");

  // Dates
  const [dateBegin, setDateBegin] = useState(new Date());
  const [showDateBegin, setShowDateBegin] = useState(false);
  const [timeBegin, setTimeBegin] = useState(new Date());
  const [showTimeBegin, setShowTimeBegin] = useState(false);

  const [dateEnd, setDateEnd] = useState(new Date());
  const [showDateEnd, setShowDateEnd] = useState(false);
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  // Récurrence
  const [recurrence, setRecurrence] = useState({
    lun: false,
    mar: false,
    mer: false,
    jeu: false,
    ven: false,
    sam: false,
    dim: false,
  });
  const [allDays, setAllDays] = useState(false);
  const [frequency, setFrequency] = useState("1");
  const [period, setPeriod] = useState("semaine");

  // Rappel
  const [reminderNumber, setReminderNumber] = useState("10");
  const [reminderUnit, setReminderUnit] = useState("heures");

  // Enfants et parents
  const [children, setChildren] = useState([]); //{ id: 1, name: "Enfant" }
  const [parents, setParents] = useState([]); //{ id: 1, name: "Parent" }

  // Checklist
  const [checklistItems, setChecklistItems] = useState([]); //{ id: 1, text: "Bouteille d'eau", checked: false }
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Note
  const [note, setNote] = useState("");

  const onChangeDateBegin = (event, selectedDate) => {
    setShowDateBegin(false);
    if (event.type === "set" && selectedDate) {
      setDateBegin(selectedDate);
    }
  };

  const onChangeTimeBegin = (event, selectedTime) => {
    setShowTimeBegin(false);
    if (event.type === "set" && selectedTime) {
      setTimeBegin(selectedTime);
    }
  };

  const onChangeDateEnd = (event, selectedDate) => {
    setShowDateEnd(false);
    if (event.type === "set" && selectedDate) {
      setDateEnd(selectedDate);
    }
  };

  const onChangeTimeEnd = (event, selectedTime) => {
    setShowTimeEnd(false);
    if (event.type === "set" && selectedTime) {
      setTimeEnd(selectedTime);
    }
  };
  const toggleDay = (day) => {
    setRecurrence({ ...recurrence, [day]: !recurrence[day] });
  };

  const toggleAllDays = () => {
    const newValue = !allDays;
    setAllDays(newValue);
    setRecurrence({
      lun: newValue,
      mar: newValue,
      mer: newValue,
      jeu: newValue,
      ven: newValue,
      sam: newValue,
      dim: newValue,
    });
  };

  const addChild = () => {
    setChildren([
      ...children,
      { id: Date.now(), name: `Enfant ${children.length + 1}` },
    ]);
  };

  const removeChild = (id) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const addParent = () => {
    setParents([
      ...parents,
      { id: Date.now(), name: `Parent ${parents.length + 1}` },
    ]);
  };

  const removeParent = (id) => {
    setParents(parents.filter((parent) => parent.id !== id));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([
        ...checklistItems,
        { id: Date.now(), text: newChecklistItem, checked: false },
      ]);
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    // Logique de sauvegarde
    console.log("Activité sauvegardée", {
      activityName,
      dateBegin,
      timeBegin,
      dateEnd,
      timeEnd,
      recurrence,
      children,
      parents,
      checklistItems,
      note,
    });
  };
  const Dropdown = () => {
    return (
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "jour", value: "jour" },
          { label: "semaine", value: "semaine" },
          { label: "mois", value: "mois" },
          { label: "an", value: "an" },
        ]}
      />
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <KWText style={styles.headerText}>Nouvelle activité</KWText>
      </View>

      {/* Intitulé de l'activité */}
      <View style={styles.section}>
        <Text style={styles.label}>Intitulé de l'activité</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : cours de danse, entrainement de foot..."
          value={activityName}
          onChangeText={setActivityName}
        />
      </View>

      {/* Début */}
      <View style={styles.section}>
        <Text style={styles.label}>Début</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateButton, { flex: 2, marginRight: 10 }]}
            onPress={() => setShowDateBegin(true)}
          >
            <Text style={styles.dateButtonText}>
              {dateBegin.toLocaleDateString("fr-FR")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateButton, { flex: 1 }]}
            onPress={() => setShowTimeBegin(true)}
          >
            <Text style={styles.dateButtonText}>
              {timeBegin.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDateBegin && (
          <DateTimePicker
            value={dateBegin}
            mode="date"
            display="default"
            onChange={onChangeDateBegin}
          />
        )}
        {showTimeBegin && (
          <DateTimePicker
            value={timeBegin}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTimeBegin}
          />
        )}
      </View>

      {/* Fin */}
      <View style={styles.section}>
        <Text style={styles.label}>Fin</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateButton, { flex: 2, marginRight: 10 }]}
            onPress={() => setShowDateEnd(true)}
          >
            <Text style={styles.dateButtonText}>
              {dateEnd.toLocaleDateString("fr-FR")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateButton, { flex: 1 }]}
            onPress={() => setShowTimeEnd(true)}
          >
            <Text style={styles.dateButtonText}>
              {timeEnd.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDateEnd && (
          <DateTimePicker
            value={dateEnd}
            mode="date"
            display="default"
            onChange={onChangeDateEnd}
          />
        )}
        {showTimeEnd && (
          <DateTimePicker
            value={timeEnd}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTimeEnd}
          />
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Récurrence</Text>
        <Switch
          trackColor={{ false: "#ecb6aeff", true: "#9fe6e0ff" }}
          thumbColor={isEnabled ? "#80CEC7" : "#FD9989"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        {isEnabled ? (
          <View style={styles.section}>
            <Text style={styles.label}>Récurrence</Text>

            <View style={styles.daysContainer}>
              <View style={styles.daysRow}>
                {["lun", "mar", "mer", "jeu"].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      recurrence[day] && styles.dayButtonActive,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        recurrence[day] && styles.dayTextActive,
                      ]}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.daysRow}>
                {["ven", "sam", "dim"].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      recurrence[day] && styles.dayButtonActive,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        recurrence[day] && styles.dayTextActive,
                      ]}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.allDaysContainer}>
              <TouchableOpacity style={styles.checkbox} onPress={toggleAllDays}>
                {allDays && (
                  <Ionicons name="checkmark" size={16} color="#8E7EED" />
                )}
              </TouchableOpacity>
              <Text style={styles.allDaysText}>toutes les</Text>
              <KWTextInput
                style={styles.frequencyInput}
                value={frequency}
                onChangeText={setFrequency}
                keyboardType="numeric"
              />

              <Dropdown />
            </View>
          </View>
        ) : (
          ""
        )}
      </View>
    </ScrollView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
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
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
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
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "white",
  },
  dayButtonActive: {
    backgroundColor: "#8E7EED",
    borderColor: "#8E7EED",
  },
});
