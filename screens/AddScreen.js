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
import { Picker } from "@react-native-picker/picker";
import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import KWText from "../components/KWText";
import Ionicons from "@expo/vector-icons/Ionicons";
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
const AddScreen = ({ navigation }) => {
  //display switch
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const [activityName, setActivityName] = useState("");
  const [activityPlace, setActivityPlace] = useState("");
  // Dates
  const [dateBegin, setDateBegin] = useState(new Date());
  const [showDateBegin, setShowDateBegin] = useState(false);
  const [timeBegin, setTimeBegin] = useState(new Date());
  const [showTimeBegin, setShowTimeBegin] = useState(false);
  //console.log("date", dateBegin + "time" + timeBegin);
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
  // Handlers DateTimePicker dateBegin
  const onChangeDateBegin = (event, selectedDate) => {
    setShowDateBegin(false);
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateBegin(dateOnly);
    }
  };
  // Handlers DateTimePicker timeBegin
  const onChangeTimeBegin = (event, selectedTime) => {
    setShowTimeBegin(false);
    if (event.type === "set" && selectedTime) {
      setTimeBegin(selectedTime);
    }
  };
  // Handlers DateTimePicker dateEnd
  const onChangeDateEnd = (event, selectedDate) => {
    setShowDateEnd(false);
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateEnd(dateOnly);
    }
  };
  // Handlers DateTimePicker timeEnd
  const onChangeTimeEnd = (event, selectedTime) => {
    setShowTimeEnd(false);
    if (event.type === "set" && selectedTime) {
      setTimeEnd(selectedTime);
    }
  };
  // Function to combine date and time into a single Date object
  const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };
  // Récurrence frequency
  const [frequency, setFrequency] = useState("1");

  const toggleDay = (day) => {
    setRecurrence({ ...recurrence, [day]: !recurrence[day] });
  };

  const addChild = () => {};

  const removeChild = (id) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const addParent = () => {};

  const removeParent = (id) => {
    setParents(parents.filter((parent) => parent.id !== id));
  };
  // Checklist handlers
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

  const calculateReminderDate = (
    activityDate,
    reminderNumber,
    reminderUnit
  ) => {
    const reminderDate = new Date(activityDate);
    const number = parseInt(reminderNumber);

    switch (reminderUnit) {
      case "minutes":
        reminderDate.setMinutes(reminderDate.getMinutes() - number);
        break;
      case "heures":
        reminderDate.setHours(reminderDate.getHours() - number);
        break;
      case "jours":
        reminderDate.setDate(reminderDate.getDate() - number);
        break;
      case "semaines":
        reminderDate.setDate(reminderDate.getDate() - number * 7);
        break;
      case "mois":
        reminderDate.setMonth(reminderDate.getMonth() - number);
        break;
      default:
        return activityDate;
    }

    return reminderDate;
  };

  const handleSave = () => {
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);
    const reminderDate = calculateReminderDate(
      fullDateBegin,
      reminderNumber,
      reminderUnit
    );
    if (fullDateEnd <= fullDateBegin) {
      setDateEnd(fullDateBegin);
    }
    fetch(`${BACKEND_URL}/activities/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: activityName,
        place: activityPlace,
        dateBegin: fullDateBegin,
        dateEnd: fullDateEnd,
        reminder: reminderDate,
        task: checklistItems,
        note: note,
        children: children,
        parents: parents,
        recurrence: recurrence,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Activité ajoutée avec succès", data);
          // const { firstName, lastName, email, token } = data.member;
          // dispatch(login({ firstName, lastName, email, token }));
          // setEmail("");
          // setPassword("");
        }
      })
      .catch((error) => console.log(error));

    console.log("Full Start DateTime:", fullDateBegin);
    // Logique de sauvegarde
    console.log("Activité sauvegardée", {
      activityName,
      activityPlace,
      dateBegin,

      dateEnd,
      reminderDate,
      recurrence,
      children,
      parents,
      checklistItems,
      note,
    });
  };
  const handleDelete = () => {
    // Logique de suppression
    console.log("Activité supprimée");
  };
  const [selectedReapet, setSelectedReapet] = useState();
  // Dropdown component for recurrence period
  const DropdownRecurence = () => {
    return (
      <Picker
        selectedValue={selectedReapet}
        onValueChange={(itemValue, itemIndex) => setSelectedReapet(itemValue)}
      >
        <Picker.Item label="Jour" value="jour" />
        <Picker.Item label="Semaine" value="semaine" />
        <Picker.Item label="Mois" value="mois" />
        <Picker.Item label="An" value="an" />
      </Picker>
    );
  };
  const DropdownReminder = () => {
    return (
      <Picker
        selectedValue={reminderUnit}
        onValueChange={(itemValue, itemIndex) => setReminderUnit(itemValue)}
      >
        <Picker.Item label="minutes" value="minutes" />
        <Picker.Item label="heures" value="heures" />
        <Picker.Item label="jours" value="jours" />
      </Picker>
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
      {/* Intitulé du lieu */}
      <View style={styles.section}>
        <Text style={styles.label}>Lieu de l'activité</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : stade municipal, piscine..."
          value={activityPlace}
          onChangeText={setActivityPlace}
        />
      </View>
      {/* date début */}
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

      {/* date fin */}
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
      {/* Récurrence */}
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
              <View style={styles.displayDays}>
                {["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map(
                  (day) => (
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
                  )
                )}
              </View>
            </View>

            <View style={styles.reccurence}>
              <Text style={styles.reccurence}>toutes les</Text>
              <KWTextInput
                style={styles.frequencyInput}
                value={frequency}
                onChangeText={setFrequency}
                keyboardType="numeric"
              />

              <DropdownRecurence />
            </View>
          </View>
        ) : (
          ""
        )}
      </View>
      {/* Rappel */}
      <View style={styles.section}>
        <Text style={styles.label}>Rappel</Text>
        <View style={styles.reminderContainer}>
          <KWTextInput
            style={styles.reminderInput}
            value={reminderNumber}
            onChangeText={setReminderNumber}
            keyboardType="numeric"
          />
          <DropdownReminder />
          <Text style={styles.reminderText}>avant</Text>
        </View>
      </View>
      {/* Enfant(s) */}
      <View style={styles.section}>
        <Text style={styles.label}>enfant(s)</Text>
        <View style={styles.tagsContainer}>
          {children.map((child) => (
            <View key={child.id} style={styles.tag}>
              <Text style={styles.tagText}>{child.name}</Text>
              <TouchableOpacity onPress={() => removeChild(child.id)}>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addChild}>
            <Ionicons name="add" size={20} color="#8E7EED" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Parent(s) */}
      <View style={styles.section}>
        <Text style={styles.label}>parent(s)</Text>
        <View style={styles.tagsContainer}>
          {parents.map((parent) => (
            <View key={parent.id} style={styles.tag}>
              <Text style={styles.tagText}>{parent.name}</Text>
              <TouchableOpacity onPress={() => removeParent(parent.id)}>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addParent}>
            <Ionicons name="add" size={20} color="#8E7EED" />
          </TouchableOpacity>
        </View>
        {/* cheklist */}
      </View>
      <View style={styles.section}>
        <View style={styles.checklistHeader}>
          <Text style={styles.label}>Liste des tâches</Text>
          <View style={styles.addChecklistContainer}>
            <TextInput
              style={styles.checklistInput}
              placeholder="Nouvel élément"
              value={newChecklistItem}
              onChangeText={setNewChecklistItem}
            />
            <TouchableOpacity
              style={styles.addChecklistButton}
              onPress={addChecklistItem}
            >
              <Ionicons name="add" size={24} color="#8E7EED" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checklistItemsContainer}>
          {checklistItems.map((item) => (
            <View key={item.id} style={styles.checklistItem}>
              <Text style={styles.checklistItemText}>{item.text}</Text>
              <TouchableOpacity onPress={() => removeChecklistItem(item.id)}>
                <Ionicons name="close" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      {/* Note */}
      <View style={styles.section}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Ajouter une note..."
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>
      {/* Boutons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={28} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
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
  displayDays: {
    flexDirection: "row",
    flexWrap: "wrap",

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
