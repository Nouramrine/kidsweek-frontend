import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import KWButton from "../components/KWButton";
import KWTextInput from "../components/KWTextInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import KWText from "../components/KWText";
import KWColorPicker from "../components/KWColorPicker";
import { KWCardButton } from "../components/KWCard";
import KWDateTimePicker from "../components/KWDateTimePicker";
import { colors, userColorSelection } from "../theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  createActivityAsync,
  deleteActivityAsync,
  updateActivityAsync,
} from "../reducers/activities";
import ButtonSaveUpdate from "../components/Activities/ButtonSaveUpdate";
//import { SafeAreaView } from "react-native-safe-area-context";
import KWModal from "../components/KWModal";
import KWDropdown from "../components/Activities/KWDropdown";
import MemberAdd from "../components/member/Add";

import { fetchZonesAsync } from "../reducers/zones";

import { fetchMembersAsync } from "../reducers/members";

const AddScreen = ({ navigation, route }) => {
  // retrieve params if edit mode
  const { activityToEdit } = route.params || {};
  const props = activityToEdit || {};
  // Redux
  const dispatch = useDispatch();
  // zones members activities user
  const members = useSelector((state) => state.members.value);
  const user = useSelector((state) => state.user.value);
  const activities = useSelector((state) => state.activities.value);
  const zones = useSelector((state) => state.zones.value);
  // console.log("Zones : ", zones);
  //console.log("Membres : ===> ", members);
  // console.log("Activités : ", activities);
  // console.log("reducer user", user);
  console.log("Props écran modif activité :", props);
  //console.log("reducer activities =====>", activities);
  const [error, setError] = useState(false);
  //display switch
  const [isEnabled, setIsEnabled] = useState(false);

  // Activity
  const [activityName, setActivityName] = useState("");
  const [activityPlace, setActivityPlace] = useState("");

  // Dates and times
  const [showDateBegin, setShowDateBegin] = useState(false);
  const [dateBegin, setDateBegin] = useState(new Date());
  const [showTimeBegin, setShowTimeBegin] = useState(false);
  const [timeBegin, setTimeBegin] = useState(new Date());
  //console.log("date", dateBegin + "time" + timeBegin);
  const [showDateEnd, setShowDateEnd] = useState(false);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const [timeEnd, setTimeEnd] = useState(new Date());

  // recurrence

  const [recurrence, setRecurrence] = useState({
    lun: false,
    mar: false,
    mer: false,
    jeu: false,
    ven: false,
    sam: false,
    dim: false,
  });

  const toggleDay = (day) => {
    setRecurrence({ ...recurrence, [day]: !recurrence[day] });
  };

  const [dateEndRecurrence, setDateEndRecurrence] = useState(new Date());
  const [hasManuallySetDateEnd, setHasManuallySetDateEnd] = useState(false);
  const [hasManuallySetTimeEnd, setHasManuallySetTimeEnd] = useState(false);
  // reminder
  const [reminderNumber, setReminderNumber] = useState("10");
  const [reminderUnit, setReminderUnit] = useState("minutes");

  // members
  const [addMemberToActivityModal, setAddMemberToActivityModal] =
    useState(false);
  const [addMembers, setAddMembers] = useState([]); //{ id: 1, firstName: "Enfant" }

  // Checklist
  const [checklistItems, setChecklistItems] = useState([]); //{ id: 1, text: "Bouteille d'eau", checked: false }
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Note
  const [note, setNote] = useState("");
  // couleur
  const [colorAct, setColorAct] = useState("skin");

  // create activity
  const handleSave = async () => {
    let memberIds;
    if (addMembers.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un enfant");
      return;
    }
    memberIds = addMembers.map((m, key) => m._id);
    // combine date and time
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);

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
          tasks: checklistItems,
          note: note,
          recurrence: recurrence,
          token: user.token,
          members: memberIds,
          color: colorAct,
        })
      ).unwrap(); // unwrap pour obtenir la valeur résolue ou lancer une erreur
      console.log("Activité créée avec succès:", result);

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible de créer l'activité");
      console.error("Erreur création activité:", error);
    }
  };
  // assign fields if props exist (edit mode)
  useEffect(() => {
    // verfication props non vide
    if (Object.keys(props).length !== 0) {
      //affectation de name et place
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

      if (props.tasks.length > 0) {
        setChecklistItems(props.tasks);
      }
      // Décomposition de dateEnd
      if (props.dateEnd) {
        const dateEnd = new Date(props.dateEnd);
        const dateEndOnly = new Date(dateEnd);
        dateEndOnly.setHours(0, 0, 0, 0);
        setDateEnd(dateEndOnly);
        setTimeEnd(dateEnd);
      }

      // verification des taches non vide
      if (props.tasks.length !== 0) {
        setChecklistItems(props.tasks);
      }
      // affectation de la note et de la couleur
      setNote(props.note);
      setColorAct(props.color);

      if (props.recurrence && Object.keys(props.recurrence).length !== 0) {
        setIsEnabled(true);

        // Décomposition de dateEndRecurrence
        if (props.recurrence.dateFin) {
          const dateEndRecurrence = new Date(props.recurrence.dateFin);
          // Pour la date (sans l'heure)
          const dateOnly = new Date(dateEndRecurrence);
          dateOnly.setHours(0, 0, 0, 0);
          setDateEndRecurrence(dateOnly);
        }

        if (props.recurrence.days) {
          setRecurrence({
            lun: props.recurrence.days.lun === true,
            mar: props.recurrence.days.mar === true,
            mer: props.recurrence.days.mer === true,
            jeu: props.recurrence.days.jeu === true,
            ven: props.recurrence.days.ven === true,
            sam: props.recurrence.days.sam === true,
            dim: props.recurrence.days.dim === true,
          });
        }
      }
      if (props.reminder && props.dateBegin) {
        const date1 = new Date(props.dateBegin);
        const date2 = new Date(props.reminder);
        // Calculer la différence en millisecondes
        const diffInMs = Math.abs(date1 - date2);

        // Convertir en différentes unités
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // Déterminer l'unité la plus appropriée
        let unit, value;

        if (diffInDays > 0) {
          unit = "jours";
          value = diffInDays;
        } else if (diffInHours > 0) {
          unit = "heures";
          value = diffInHours;
        } else {
          unit = "minutes";
          value = diffInMinutes;
        }

        setReminderNumber(value.toString());
        setReminderUnit(unit);
      }
      if (props.members && props.members.length > 0) {
        setAddMembers(props.members);
      }
      setChecklistItems(props.tasks);
    }
    if (props.color) {
      setColorAct(props.color);
    }
    //dispatch(fetchMembersAsync());
  }, [props._id]);

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

  // Checklist handlers
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([
        ...checklistItems,
        { _id: Date.now(), text: newChecklistItem, checked: false },
      ]);
      setNewChecklistItem("");
    }
  };

  // remove checklist item
  const removeChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item._id !== id));
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
  const validateForm = () => {
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);

    if (fullDateBegin < Date.now()) {
      Alert.alert("Erreur", "La date de début ne doit pas être passée");
      return false;
    }
    if (fullDateEnd <= fullDateBegin) {
      setError(true);
    } else {
      setError(false);
    }
    if (addMembers.length === 0) {
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

  const handleUpdate = async () => {
    console.log("🟢 handleUpdate déclenché !");
    let memberIds;
    console.log("update1");
    if (addMembers.length > 0) {
      memberIds = addMembers.map((m) => m._id);
    } else {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un enfant");
      return;
    }
    console.log("update2");
    const fullDateBegin = combineDateAndTime(dateBegin, timeBegin);
    const fullDateEnd = combineDateAndTime(dateEnd, timeEnd);

    if (!validateForm()) {
      return;
    }
    console.log("update3");
    const reminderDate = calculateReminderDate(
      fullDateBegin,
      reminderNumber,
      reminderUnit
    );

    // Préparer les données de récurrence
    let recurrenceData = null;
    let dateEndRec = null;

    if (isEnabled === true) {
      recurrenceData = {
        lun: recurrence.lun || false,
        mar: recurrence.mar || false,
        mer: recurrence.mer || false,
        jeu: recurrence.jeu || false,
        ven: recurrence.ven || false,
        sam: recurrence.sam || false,
        dim: recurrence.dim || false,
      };
      dateEndRec = dateEndRecurrence;
    }

    try {
      const result = await dispatch(
        updateActivityAsync({
          activityId: props._id,
          name: activityName,
          place: activityPlace,
          dateBegin: fullDateBegin,
          dateEnd: fullDateEnd,
          dateEndRecurrence: dateEndRec,
          reminder: reminderDate,
          tasks: checklistItems,
          note: note,
          recurrence: recurrenceData,
          token: user.token,
          members: memberIds,
          color: colorAct || "skin",
        })
      ).unwrap();

      console.log("Activité mise à jour avec succès:", result);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour l'activité"
      );
      console.error("Erreur mise à jour activité:", error);
    }
  };
  const handleAbort = () => {
    setActivityName("");
    setActivityPlace("");
    setDateBegin(new Date());
    setDateEnd(new Date());
    setNote("");

    setIsEnabled(false);
    setRecurrence(null);

    setReminderNumber(10);
    setReminderUnit("minutes");
    setChecklistItems(null);

    navigation.goBack();
  };
  const handleRemoveMember = (id) => {
    setAddMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const validateReminderNumber = (value, unit) => {
    const numValue = parseInt(value) || 0;

    const limits = {
      minutes: 60,
      heures: 24,
      jours: 365,
    };

    const maxValue = limits[unit] || 365;

    if (numValue > maxValue) {
      return maxValue.toString();
    } else if (numValue < 0) {
      return "0";
    } else {
      return value;
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
            onBlur={() => setActivityName(activityName.trim())}
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
            onBlur={() => setActivityPlace(activityPlace.trim())}
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
              appliquer une récurrence
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
              {/* Sélection des jours de récurrence */}
              <View style={{ marginTop: 10 }}>
                <KWText
                  type="text"
                  style={{ marginBottom: 8, fontWeight: "500" }}
                >
                  Sélectionnez les jours :
                </KWText>
                <View style={styles.daysContainer}>
                  {[
                    { key: "lun", label: "Lun" },
                    { key: "mar", label: "Mar" },
                    { key: "mer", label: "Mer" },
                    { key: "jeu", label: "Jeu" },
                    { key: "ven", label: "Ven" },
                    { key: "sam", label: "Sam" },
                    { key: "dim", label: "Dim" },
                  ].map((day, key) => (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayButton,
                        recurrence[day.key] && styles.dayButtonActive,
                      ]}
                      onPress={() => toggleDay(day.key)}
                    >
                      <KWText
                        type="text"
                        style={[
                          styles.dayText,
                          recurrence[day.key] && styles.dayTextActive,
                        ]}
                      >
                        {day.label}
                      </KWText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Date de fin de récurrence */}
              <View style={{ marginTop: 15 }}>
                <KWDateTimePicker
                  label="Date de fin de récurrence"
                  date={dateEndRecurrence}
                  onDateChange={onChangeDateEndRecurrence}
                  showTime={false}
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
        {/* Rappel */}
        <View style={styles.section}>
          <View style={styles.reminderContainer}>
            <KWTextInput
              label="Rappel"
              style={styles.reminderInput}
              value={reminderNumber}
              onChangeText={(value) => {
                const validatedValue = validateReminderNumber(
                  value,
                  reminderUnit
                );
                setReminderNumber(validatedValue);
              }}
              keyboardType="numeric"
            />
            <KWDropdown
              selectedValue={reminderUnit}
              onValueChange={(itemValue) => {
                const validatedValue = validateReminderNumber(
                  reminderNumber,
                  itemValue
                );
                setReminderNumber(validatedValue);
                setReminderUnit(itemValue);
              }}
            />
            <KWText type="text" style={styles.reminderText}>
              avant
            </KWText>
          </View>
        </View>
        {/* membres(s) */}
        <View style={styles.section}>
          <KWText type="text" style={[styles.label, { marginLeft: 20 }]}>
            Qui participera ?
          </KWText>

          <View>
            {addMembers.length > 0 ? (
              addMembers.map((memberselect) => (
                <View key={memberselect._id} style={styles.memberItem}>
                  <KWText type="text" style={styles.memberName}>
                    {memberselect.firstName}
                  </KWText>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMember(memberselect._id)}
                  >
                    <FontAwesome5 name="times" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
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
            onReturn={(member) => {
              if (member) {
                setAddMembers([...addMembers, member]);
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
                onBlur={() => setNewChecklistItem(newChecklistItem.trim())}
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
                <View key={item._id} style={styles.checklistItem}>
                  <KWText type="text" style={styles.checklistItemText}>
                    {item.text}
                  </KWText>
                  <TouchableOpacity
                    onPress={() => removeChecklistItem(item._id)}
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
            onBlur={() => setNote(note.trim())}
            multiline
          />
        </View>

        <View style={styles.section}>
          <KWColorPicker
            title="Choisissez une couleur pour l'activité"
            userColorSelection={userColorSelection}
            selectedColor={colorAct}
            onColorSelect={(colorAct) => setColorAct(colorAct)}
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
            handleUpdate={handleUpdate}
            props={props}
          />
        </View>
        <View style={styles.footer}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background[1],
  },
  header: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: colors.blue[0],
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
    //borderWidth: 1,
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
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayButton: {
    width: "30%",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 2,
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
  dayText: {
    fontSize: 12,
    color: "#1F2937",
  },
  dayTextActive: {
    color: "white",
    fontWeight: "bold",
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
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  memberName: {
    fontSize: 16,
    color: colors.text[0],
  },

  removeButton: {
    padding: 5,
  },

  noMembersText: {
    fontStyle: "italic",
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    height: 10,
    marginBottom: 40,
  },
});
