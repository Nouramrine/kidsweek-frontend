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
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import KWText from "../components/KWText";
import {
  KWCard,
  KWCardHeader,
  KWCardIcon,
  KWCardTitle,
  KWCardButton,
  KWCardBody,
} from "../components/KWCard";
import KWDateTimePicker from "../components/KWDateTimePicker";
import { colors } from "../theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  createActivityAsync,
  deleteActivityAsync,
} from "../reducers/activities";
import KWDropdown from "../components/Activities/KWDropdown";
import ButtonSaveUpdate from "../components/Activities/ButtonSaveUpdate";
import { SafeAreaView } from "react-native-safe-area-context";
import KWModal from "../components/KWModal";
import MemberAdd from "../components/member/Add";
import zones from "../reducers/zones";
import members from "../reducers/members";
import {
  fetchZonesAsync,
  deleteZoneAsync,
  removeMemberFromZoneAsync,
  addMemberToZoneAsync,
} from "../reducers/zones";

import { fetchMembersAsync, deleteMemberAsync } from "../reducers/members";

const AddScreen = ({ navigation, route }) => {
  const { activityToEdit } = route.params || {};
  const props = activityToEdit || {};

  const dispatch = useDispatch();
  const zones = useSelector((state) => state.zones.value);
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);
  //members.push(user);
  console.log("Zones : ", zones);
  console.log("Membres : ", members);

  console.log("reducer user", user);

  //console.log("reducer activities =====>", activities);
  const [error, setError] = useState(false);
  //display switch
  const [isEnabled, setIsEnabled] = useState(false);

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
  const [dateEndRecurrence, setDateEndRecurrence] = useState(new Date());
  const [timeEndRecurrence, setTimeEndRecurrence] = useState(new Date());
  const [showDateEndRecurrence, setShowDateEndRecurrence] = useState(false);
  const [hasManuallySetDateEnd, setHasManuallySetDateEnd] = useState(false);
  const [hasManuallySetTimeEnd, setHasManuallySetTimeEnd] = useState(false);
  // reminder
  const [reminderNumber, setReminderNumber] = useState("10");
  const [reminderUnit, setReminderUnit] = useState("Minutes");

  // members
  const [addMemberToActivityModal, setAddMemberToActivityModal] =
    useState(false);
  const [addMembers, setMembers] = useState([]); //{ id: 1, name: "Enfant" }

  // Checklist
  const [checklistItems, setChecklistItems] = useState([]); //{ id: 1, text: "Bouteille d'eau", checked: false }
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Note
  const [note, setNote] = useState("");

  // assign fields if props exist (edit mode)
  useEffect(() => {
    if (Object.keys(props).length !== 0) {
      setActivityName(props.name);
      setActivityPlace(props.place);
      // Décomposition de dateBegin
      if (props.dateBegin) {
        const dateBegin = new Date(props.dateBegin);
        // Pour la date (sans l'heure)
        const dateOnly = new Date(dateBegin);
        dateOnly.setHours(0, 0, 0, 0);
        setDateBegin(dateOnly);
        // Pour l'heure
        setTimeBegin(dateBegin);
      }

      // Décomposition de dateEnd
      if (props.dateEnd) {
        const dateEnd = new Date(props.dateEnd);
        const dateEndOnly = new Date(dateEnd);
        dateEndOnly.setHours(0, 0, 0, 0);
        setDateEnd(dateEndOnly);
        setTimeEnd(dateEnd);
      }
      setNote(props.note);

      if (Object.keys(props.recurrence).length !== 0) {
        setIsEnabled(true);
        // Décomposition de dateEndRecurrence
        const dateEndRecurrence = new Date(props.recurrence.dateFin);
        // Pour la date (sans l'heure)
        const dateOnly = new Date(dateEndRecurrence);
        dateOnly.setHours(0, 0, 0, 0);
        setDateEndRecurrence(dateOnly);
        // Pour l'heure
        setTimeEndRecurrence(props.recurrence.dateFin);
        setRecurrence(props.recurrence.day);
      }
      setReminderNumber(props.reminderNumber);
      setReminderUnit(props.reminderUnit);
      if (props.members && props.members.length > 0) {
        //console.log("props members:", props.members);
        // setChildren(children);
        //setParents(parents);
      }
      setChecklistItems(props.checklistItems);
    } else {
      dispatch(fetchZonesAsync());
      dispatch(fetchMembersAsync());
    }
  }, []);
  // Handlers DateTimePicker dateBegin
  const onChangeDateBegin = (event, selectedDate) => {
    setShowDateBegin(false);
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateBegin(dateOnly);
      if (!hasManuallySetDateEnd) {
        setDateEnd(dateOnly);
      }
    }
  };

  // Handlers DateTimePicker timeBegin
  const onChangeTimeBegin = (event, selectedTime) => {
    setShowTimeBegin(false);
    if (event.type === "set" && selectedTime) {
      setTimeBegin(selectedTime);
      if (!hasManuallySetTimeEnd) {
        setTimeEnd(selectedTime);
      }
    }
  };

  // Handlers DateTimePicker dateEnd
  const onChangeDateEnd = (event, selectedDate) => {
    setShowDateEnd(false);
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateEnd(dateOnly);
      setHasManuallySetDateEnd(true);
    }
  };

  const onChangeDateEndRecurrence = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateEndRecurrence(dateOnly);
    }
  };
  // Handlers DateTimePicker timeEnd
  const onChangeTimeEnd = (event, selectedTime) => {
    setShowTimeEnd(false);
    if (event.type === "set" && selectedTime) {
      setTimeEnd(selectedTime);
      setHasManuallySetTimeEnd(true);
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
  // toggle switch display recurrence
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };
  // Form validation
  const validateForm = (fullDateEnd, fullDateBegin) => {
    if (fullDateBegin < Date.now()) {
      Alert.alert("Erreur", "La date de début ne doit pas être passée");
      return false;
    }
    if (fullDateEnd <= fullDateBegin) {
      setError(true);
    } else {
      setError(false);
    }
    if (children.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un enfant");
      return false;
    }
    if (!activityName.trim()) {
      Alert.alert("Erreur", "Le nom est obligatoire");
      return false;
    }
    if (activityName.length < 3) {
      Alert.alert("Erreur", "Le nom doit faire au moins 3 caractères");
      return false;
    }

    return true;
  };
  // create activity
  const handleSave = async () => {
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);
    const members = [...children, ...parents];
    if (isEnabled !== true) {
      setRecurrence(null);
      setDateEndRecurrence(null);
    }
    if (!validateForm()) {
      return; // Arrête si la validation échoue
    }

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
          dateEndRecurrence: dateEndRecurrence,
          reminder: reminderDate,
          task: checklistItems,
          note: note,
          recurrence: isEnabled ? recurrence : null,
          token: user.token,
          members: members,
        })
      ).unwrap(); // unwrap pour obtenir la valeur résolue ou lancer une erreur
      console.log("Activité créée avec succès:", result);

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer l'activité");
      console.error("Erreur création activité:", error);
    }
  };
  const handleDelete = async () => {
    // Logique de suppression
    try {
      const result = await dispatch(
        deleteActivityAsync({
          activityId: props._id,
          token: user.token,
        })
      ).unwrap(); // unwrap pour obtenir la valeur résolue ou lancer une erreur
      console.log("Activité supprimée avec succès:", result);

      navigation.navigate("calendrier");
    } catch (error) {
      console.error("Erreur de suppression activité:", error);
    }
  };
  const handleUpdateUpdate = () => {};
  const handleAbort = () => {
    setActivityName("");
    setActivityPlace("");
    setDateBegin(new Date());
    setDateEnd(new Date());
    setNote("");

    setIsEnabled(false);
    setRecurrence(null);

    setReminderNumber(10);
    setReminderUnit("Minutes");
    setChildren(null);
    setParents(null);
    setChecklistItems(null);

    navigation.goBack();
  };
  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m._id !== id));
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
          <KWDateTimePicker
            label="Début"
            date={dateBegin}
            time={timeBegin}
            onDateChange={onChangeDateBegin}
            onTimeChange={onChangeTimeBegin}
            dateError={
              dateEnd < dateBegin
                ? "La date de fin ne peut être avant la date de début"
                : ""
            }
          />

          {/* date fin */}

          <KWDateTimePicker
            label="Fin"
            date={dateEnd}
            time={timeEnd}
            onDateChange={onChangeDateEnd}
            onTimeChange={onChangeTimeEnd}
            dateError={
              dateEnd < dateBegin
                ? "La date de fin ne peut être avant la date de début"
                : ""
            }
          />
        </View>

        {/* Récurrence */}
        <View style={styles.section}>
          <KWText type="text" style={styles.label}>
            Récurrence
          </KWText>
          {error && (
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
            <View>
              {/* Sélection du jour de récurrence */}
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

              {/* Date de fin de récurrence */}
              <View style={{ marginTop: 15 }}>
                <KWDateTimePicker
                  label="La récurrence se termine le :"
                  date={dateEndRecurrence}
                  time={timeEndRecurrence}
                  onDateChange={onChangeDateEndRecurrence}
                  dateError={
                    dateEndRecurrence < dateBegin
                      ? "La date de fin ne peut être avant la date de début"
                      : ""
                  }
                />
              </View>
            </View>
          )}
        </View>

        {/* membres(s) */}
        <View style={styles.section}>
          <KWText type="text" style={[styles.label, { marginLeft: 20 }]}>
            Qui praticipera ?
          </KWText>
          <View>
            {addMembers.length > 0 ? (
              <View>
                {addMembers.map((memberselect) => (
                  <View key={memberselect._id}>
                    <Text type="text">{memberselect.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(memberselect._id)}
                    >
                      <FontAwesome5 name="times" size={14} color="#030303ff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <KWText type="text" style={styles.noMembersText}>
                Aucun membre sélectionné
              </KWText>
            )}
          </View>
          <KWButton
            icon="plus"
            title="Ajouter un membre"
            bgColor={colors.background[1]}
            color={colors.text[0]}
            onPress={() => {
              setAddMemberToActivityModal(true);
            }}
          />
        </View>
        <KWModal
          visible={addMemberToActivityModal}
          onRequestClose={() => setAddMemberToActivityModal(false)}
        >
          <MemberAdd
            currentMembers={addMembers}
            onReturn={(memberId) => {
              if (memberId) {
                // Recherche du membre sélectionné dans la liste globale
                const selectedMember = members.find((m) => m._id === memberId);
                if (selectedMember) {
                  setMembers((prev) => [...prev, selectedMember]);
                }
              }
              setAddMemberToActivityModal(false);
            }}
          />
        </KWModal>

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
            {checklistItems &&
              checklistItems.length > 0 &&
              checklistItems.map((item) => (
                <View key={item.id} style={styles.checklistItem}>
                  <KWText type="text" style={styles.checklistItemText}>
                    {item.text}
                  </KWText>
                  <TouchableOpacity
                    onPress={() => removeChecklistItem(item.id)}
                  >
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
          <KWButton title="Retour" onPress={handleAbort} />
          {props && Object.keys(props).length !== 0 && (
            <KWCardButton style={styles.deleteButton}>
              <Ionicons
                name="trash-outline"
                size={28}
                color="#EF4444"
                onPress={handleDelete}
              />
            </KWCardButton>
          )}
          <ButtonSaveUpdate
            dateBegin={dateBegin}
            dateEnd={dateEnd}
            handleSave={handleSave}
            handleUpdate={handleUpdateUpdate}
            props={props}
          />
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
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: colors.background[1],
  },
  headerText: {
    fontSize: 24,
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
