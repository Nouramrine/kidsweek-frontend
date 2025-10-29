import React, { useEffect, useState } from "react";
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
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import KWText from "../components/KWText";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
  KWCardBody,
} from "../components/KWCard";
import { colors } from "../theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  createActivityAsync,
  deleteActivityAsync,
} from "../reducers/activities";
import KWDropdown from "../components/Activities/KWDropdown";

const AddScreen = ({ navigation, props }) => {
  /*const props = {
    _id: "648f1f4f5f9b25630c3e4b9e",
    name: "Cours de danse",
    place: "Studio KidsWeek",
    dateBegin: "2024-06-20T10:00:00.000Z",
    dateEnd: "2024-06-20T11:00:00.000Z",
    note: "N'oublier pas la bouteille d'eau",
    recurrence: "Mar",
    reminderNumber: "15",
    reminderUnit: "minutes",
    children: [{ id: "12356", name: "Lucas" }],
    parents: [{ id: "658961", name: "Papa Outé" }],
    checklistItems: [{ id: 1, text: "Bouteille d'eau", checked: false }],
  };*/

  const membersData = [
    { id: "658961", firstName: "Papa", lastName: "Outé", isChildren: false },
    { id: "552638", firstName: "Maman", lastName: "Bobo", isChildren: false },
    { id: "552637", firstName: "Mamie", lastName: "Nova", isChildren: false },
    { id: "12356", firstName: "Lucas", lastName: "Rabine", isChildren: true },
    { id: "78569", firstName: "Anna", lastName: "Lefabète", isChildren: true },
  ];

  const zonesData = [
    { name: "Papa", color: "blue", members: ["658961", "12356"] },
    { name: "Maman", color: "red", members: ["552638", "12356", "78569"] },
    { name: "Mamie", color: "purple", members: ["12356", "78569"] },
  ];
  const dispatch = useDispatch();

  //const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);
  //console.log("reducer member", user);
  console.log("reducer activities", activities);
  const [erreur, setErreur] = useState(false);
  //display switch
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);

    if (fullDateEnd <= fullDateBegin) {
      setErreur(true);
    } else {
      setErreur(false);
      setIsEnabled(!isEnabled);
    }
  };

  // Activity
  const [activityName, setActivityName] = useState("");
  const [activityPlace, setActivityPlace] = useState("");

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
  const [checklistItems, setChecklistItems] = useState([]); //{ id: 1, text: "Bouteille d'eau", checked: false }
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Note
  const [note, setNote] = useState("");

  // Populate fields if props exist (edit mode)
  useEffect(() => {
    if (Object.keys(props).length !== 0) {
      setActivityName(props.name);
      setActivityPlace(props.place);
      setDateBegin(new Date(props.dateBegin));
      setDateEnd(new Date(props.dateEnd));
      setNote(props.note);
      if (props.recurrence) {
        setIsEnabled(true);
        setRecurrence(props.recurrence);
      }
      setReminderNumber(props.reminderNumber);
      setReminderUnit(props.reminderUnit);
      setChildren(props.children);
      setParents(props.parents);
      setChecklistItems(props.checklistItems);
    }
  }, []);
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

  //remove children
  const removeChild = (id) => {
    setChildren(children.filter((child) => child.id !== id));
  };

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
    if (!activityName.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom d'activité");
      return;
    }

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

    try {
      const result = await dispatch(
        createActivityAsync({
          name: activityName,
          place: activityPlace,
          dateBegin: fullDateBegin,
          dateEnd: fullDateEnd,
          reminder: reminderDate,
          task: checklistItems,
          note: note,
          recurrence: isEnabled ? recurrence : null,
          token: user.token,
        })
      ).unwrap(); // unwrap pour obtenir la valeur résolue ou lancer une erreur
      console.log("Activité créée avec succès:", result);

      navigation.goBack();
    } catch (error) {
      console.error("Erreur création activité:", error);
    }
  };
  const handleDelete = async () => {
    // Logique de suppression
    try {
      const result = await dispatch(
        deleteActivityAsync({
          activityId: activities.id,
          token: user.token,
        })
      ).unwrap(); // unwrap pour obtenir la valeur résolue ou lancer une erreur
      console.log("Activité supprimée avec succès:", result);

      navigation.goBack();
    } catch (error) {
      console.error("Erreur de suppression activité:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
          {dateEnd < dateBegin ? (
            <KWText type="inputError">
              La date de fin ne peut être avant la date de debut
            </KWText>
          ) : (
            ""
          )}
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
            <KWText type="inputError">
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
              <KWText
                type="text"
                style={{ marginBottom: 8, fontWeight: "500" }}
              >
                Sélectionne un jour :
              </KWText>
              <View style={styles.daysContainer}>
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        recurrence === day && styles.dayButtonActive,
                      ]}
                      onPress={() =>
                        setRecurrence(recurrence === day ? null : day)
                      }
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
                  )
                )}
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
            <KWDropdown
              selectedValue={reminderUnit}
              onValueChange={(itemValue, itemIndex) =>
                setReminderUnit(itemValue)
              }
            />
            <KWText type="text" style={styles.reminderText}>
              avant
            </KWText>
          </View>
        </View>

        {/* Enfant(s) */}
        <View style={styles.section}>
          <KWText type="text" style={styles.label}>
            Enfant(s)
          </KWText>
          <View style={styles.membersGrid}>
            {membersData
              .filter((m) => m.isChildren)
              .map((child) => {
                const isSelected = children.some((c) => c.id === child.id);
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.memberCard,
                      isSelected && styles.memberCardSelected,
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        removeChild(child.id);
                      } else {
                        setChildren([...children, child]);
                      }
                    }}
                  >
                    <KWText
                      type="text"
                      style={[
                        styles.memberName,
                        isSelected && styles.memberNameSelected,
                      ]}
                    >
                      {child.firstName}
                    </KWText>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Parent(s) */}
        <View style={styles.section}>
          <KWText type="text" style={styles.label}>
            Parent(s)
          </KWText>
          <View style={styles.membersGrid}>
            {membersData
              .filter((m) => !m.isChildren)
              .map((parent) => {
                const isSelected = parents.some((p) => p.id === parent.id);
                return (
                  <TouchableOpacity
                    key={parent.id}
                    style={[
                      styles.memberCard,
                      isSelected && styles.memberCardSelected,
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        removeParent(parent.id);
                      } else {
                        setParents([...parents, parent]);
                      }
                    }}
                  >
                    <KWText
                      type="text"
                      style={[
                        styles.memberName,
                        isSelected && styles.memberNameSelected,
                      ]}
                    >
                      {parent.firstName}
                    </KWText>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* cheklist */}

        <View style={styles.section}>
          <View style={styles.checklistHeader}>
            <View style={styles.addChecklistContainer}>
              <KWTextInput
                label="Penser à :"
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
          <KWButton title="Retour" onPress={() => navigation.goBack()} />
          {props && (
            <KWCardButton style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={28} color="#EF4444" />
            </KWCardButton>
          )}
          {dateEnd < dateBegin ? (
            <KWButton
              title="* Erreur sur le formulaire"
              type="inputError"
              style={styles.saveButtonError}
            />
          ) : (
            <KWButton title="Enregistrer" type="text" onPress={handleSave} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: "space-around",
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
  membersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  memberCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: "#fff",
  },
  memberCardSelected: {
    backgroundColor: "#8E7EED22",
    borderColor: "#8E7EED",
  },
  memberName: {
    color: "#1F2937",
    fontWeight: "500",
  },
  memberNameSelected: {
    color: "#8E7EED",
    fontWeight: "700",
  },
});
