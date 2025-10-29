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
import { useSelector } from "react-redux";
import { colors } from "../theme/colors";
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
const AddScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.value);
  const [erreur, setErreur] = useState(false);
  //display switch
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    if (dateEnd <= dateBegin) {
      setErreur(true);
    } else {
      setIsEnabled(!isEnabled);
    }
  };

  // Activity
  const [activityName, setActivityName] = useState("cinéma");
  const [activityPlace, setActivityPlace] = useState("Pathé la garde");

  // Dates and times
  const [dateBegin, setDateBegin] = useState(new Date());
  const [showDateBegin, setShowDateBegin] = useState(false);
  const [timeBegin, setTimeBegin] = useState(new Date());
  const [showTimeBegin, setShowTimeBegin] = useState(false);
  //console.log("date", dateBegin + "time" + timeBegin);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showDateEnd, setShowDateEnd] = useState(false);
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [showTimeEnd, setShowTimeEnd] = useState(false);

  // recurrence
  const [recurrence, setRecurrence] = useState(null);

  // reminder
  const [reminderNumber, setReminderNumber] = useState("10");
  const [reminderUnit, setReminderUnit] = useState("Minutes");

  // Children and Parents
  const [children, setChildren] = useState([]); //{ id: 1, name: "Enfant" }
  const [parents, setParents] = useState([]); //{ id: 1, name: "Parent" }

  // Checklist
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "veste chaude", checked: false },
    { id: 2, text: "carte de réduction", checked: false },
  ]); //{ id: 1, text: "Bouteille d'eau", checked: false }
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Note
  const [note, setNote] = useState("amusez vous bien !");

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

  // ad children
  const addChild = () => {};

  //remove children
  const removeChild = (id) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  // add parents
  const addParent = () => {};

  //remove parents
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

  // remove checklist item
  const removeChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  // Calculate reminder date
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

  // create activity
  const handleSave = async () => {
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

    dispatch(
      createActivityAsync({
        name: activityName,
        place: activityPlace,
        dateBegin: fullDateBegin,
        dateEnd: fullDateEnd,
        reminder: reminderDate,
        task: checklistItems,
        note: note,
        recurrence: recurrence,
        token: user.token,
      })
    );
    //   const response = await fetch(`${BACKEND_URL}/activities/`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: user.token,
    //     },
    //     body: JSON.stringify({
    //       name: activityName,
    //       place: activityPlace,
    //       dateBegin: fullDateBegin,
    //       dateEnd: fullDateEnd,
    //       reminder: reminderDate,
    //       task: checklistItems,
    //       note: note,
    //       /*children: children,
    //       parents: parents,*/
    //       recurrence: recurrence,
    //     }),
    //   });
    //   const data = await response.json();

    //   if (data.result) {
    //     console.log("Activité ajoutée avec succès", data);
    //     // Redirection ou reset du formulaire
    //     navigation.goBack();
    //   } else {
    //     console.error("Erreur lors de l'ajout:", data.error);
    //     // Afficher un message d'erreur à l'utilisateur
    //   }
    // } catch (error) {
    //   console.error("Erreur de connexion:", error);
    //   // Afficher un message d'erreur à l'utilisateur
    // }
  };
  const handleDelete = () => {
    // Logique de suppression
    console.log("Activité supprimée");
  };

  // Dropdown component for reminder unit
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
        <KWText type="h1" style={styles.headerText}>
          Nouvelle activité
        </KWText>
      </View>

      {/* Intitulé de l'activité */}
      <View style={styles.section}>
        <KWTextInput
          type="text"
          label="Intitulé de l'activité"
          style={styles.input}
          placeholder="Ex : cours de danse, entrainement de foot..."
          value={activityName}
          onChangeText={setActivityName}
        />
      </View>

      {/* Intitulé du lieu */}
      <View style={styles.section}>
        <KWTextInput
          type="text"
          label="Lieu de l'activité"
          style={styles.input}
          placeholder="Ex : stade municipal, piscine..."
          value={activityPlace}
          onChangeText={setActivityPlace}
        />
      </View>

      {/* date début */}
      <View style={styles.section}>
        <KWText type="text" style={styles.label}>
          Début
        </KWText>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateButton, { flex: 2, marginRight: 10 }]}
            onPress={() => setShowDateBegin(true)}
          >
            <KWText type="text" style={styles.dateButtonText}>
              {dateBegin.toLocaleDateString("fr-FR")}
            </KWText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateButton, { flex: 1 }]}
            onPress={() => setShowTimeBegin(true)}
          >
            <KWText type="text" style={styles.dateButtonText}>
              {timeBegin.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </KWText>
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
        <KWText type="text" style={styles.label}>
          Fin
        </KWText>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={[styles.dateButton, { flex: 2, marginRight: 10 }]}
            onPress={() => setShowDateEnd(true)}
          >
            <KWText type="text" style={styles.dateButtonText}>
              {dateEnd.toLocaleDateString("fr-FR")}
            </KWText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateButton, { flex: 1 }]}
            onPress={() => setShowTimeEnd(true)}
          >
            <KWText type="text" style={styles.dateButtonText}>
              {timeEnd.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </KWText>
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
        <KWText type="text" style={styles.label}>
          Récurrence
        </KWText>
        {erreur && (
          <KWText type="text" style={{ color: "red", marginBottom: 5 }}>
            La date de fin doit être supérieure à la date de début pour
            appliquer une recurrence
          </KWText>
        )}
        <Switch
          trackColor={{ false: "#ecb6aeff", true: "#9fe6e0ff" }}
          thumbColor={isEnabled ? "#80CEC7" : "#FD9989"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />

        {isEnabled && (
          <View style={{ marginTop: 10 }}>
            <KWText type="text" style={{ marginBottom: 8, fontWeight: "500" }}>
              Sélectionne un jour :
            </KWText>
            <View style={styles.daysContainer}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    recurrence === day && styles.dayButtonActive,
                  ]}
                  onPress={() => setRecurrence(recurrence === day ? null : day)}
                >
                  <KWText
                    type="text"
                    style={[
                      styles.dayText,
                      recurrence === day && styles.dayTextActive,
                    ]}
                  >
                    {day}
                  </KWText>
                </TouchableOpacity>
              ))}
            </View>

            {recurrence && (
              <KWText type="text" style={styles.selectedDayText}>
                Répéter chaque :{" "}
                <KWText type="text" style={{ fontWeight: "bold" }}>
                  {recurrence}
                </KWText>
              </KWText>
            )}
          </View>
        )}
      </View>

      {/* Rappel */}
      <View style={styles.section}>
        <View style={styles.reminderContainer}>
          <KWTextInput
            label="Rappel"
            style={styles.reminderInput}
            value={reminderNumber}
            onChangeText={setReminderNumber}
            keyboardType="numeric"
          />
          <DropdownReminder />
          <KWText type="text" style={styles.reminderText}>
            avant
          </KWText>
        </View>
      </View>

      {/* Enfant(s) */}
      <View style={styles.section}>
        <KWText type="text" style={styles.label}>
          enfant(s)
        </KWText>
        <View style={styles.tagsContainer}>
          {children.map((child) => (
            <View key={child.id} style={styles.tag}>
              <KWText type="text" style={styles.tagText}>
                {child.name}
              </KWText>
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
        <KWText type="text" style={styles.label}>
          parent(s)
        </KWText>
        <View style={styles.tagsContainer}>
          {parents.map((parent) => (
            <View key={parent.id} style={styles.tag}>
              <KWText type="text" style={styles.tagText}>
                {parent.name}
              </KWText>
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
          <View style={styles.addChecklistContainer}>
            <KWTextInput
              label="Liste des tâches"
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
              <KWText type="text" style={styles.checklistItemText}>
                {item.text}
              </KWText>
              <TouchableOpacity onPress={() => removeChecklistItem(item.id)}>
                <Ionicons name="close" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Note */}
      <View style={styles.section}>
        <KWTextInput
          label="Note"
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
          <KWText type="text" style={styles.cancelButtonText}>
            Retour
          </KWText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={28} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <KWText type="text" style={styles.saveButtonText}>
            Enregistrer
          </KWText>
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#8E7EED",
    borderRadius: 8,
  },
});
