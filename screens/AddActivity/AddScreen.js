import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import KWButton from "../../components/KWButton";
import KWTextInput from "../../components/KWTextInput";
import KWText from "../../components/KWText";
import KWColorPicker from "../../components/KWColorPicker";
import { KWCardButton } from "../../components/KWCard";
import { colors, userColorSelection } from "../../theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import ButtonSaveUpdate from "../../components/Activities/ButtonSaveUpdate";
import KWModal from "../../components/KWModal";
import MemberAdd from "../../components/member/Add";
import useActivityForm from "./hooks/useActivityForm";
import ActivityBasicInfo from "../../components/Activities/ActivityBasicInfo";
import ActivityMembers from "../../components/Activities/ActivityMembers";
import ActivityChecklist from "../../components/Activities/ActivityChecklist";

const AddScreen = ({ navigation, route }) => {
  const { state, setters, handlers, isEditMode } = useActivityForm({
    route,
    navigation,
  });

  const {
    activityName,
    activityPlace,
    dateBegin,
    timeBegin,
    dateEnd,
    timeEnd,
    reminderNumber,
    reminderUnit,
    addMembers,
    checklistItems,
    newChecklistItem,
    note,
    colorAct,
  } = state;

  const {
    setActivityName,
    setActivityPlace,
    setDateBegin,
    setTimeBegin,
    setDateEnd,
    setTimeEnd,
    setReminderNumber,
    setReminderUnit,
    setAddMembers,
    setChecklistItems,
    setNewChecklistItem,
    setNote,
    setColorAct,
  } = setters;

  const { handleSave, handleUpdate, handleDelete, resetForm } = handlers;

  // États locaux pour l'UI
  const [addMemberToActivityModal, setAddMemberToActivityModal] =
    useState(false);
  const [hasManuallySetDateEnd, setHasManuallySetDateEnd] = useState(false);
  const [hasManuallySetTimeEnd, setHasManuallySetTimeEnd] = useState(false);
  const [error, setError] = useState(false);

  // Handlers DateTimePicker
  const onChangeDateBegin = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateBegin(dateOnly);
      if (!hasManuallySetDateEnd) {
        setDateEnd(dateOnly);
      }
    }
  };

  const onChangeTimeBegin = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setTimeBegin(selectedTime);
      if (!hasManuallySetTimeEnd) {
        setTimeEnd(selectedTime);
      }
    }
  };

  const onChangeDateEnd = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      const dateOnly = new Date(selectedDate);
      dateOnly.setHours(0, 0, 0, 0);
      setDateEnd(dateOnly);
      setHasManuallySetDateEnd(true);
    }
  };

  const onChangeTimeEnd = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setTimeEnd(selectedTime);
      setHasManuallySetTimeEnd(true);
    }
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

  const removeChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item._id !== id));
  };

  const handleAbort = () => {
    resetForm();
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

  // Vérification des dates pour afficher l'erreur
  useEffect(() => {
    if (dateEnd < dateBegin) {
      setError(true);
    } else {
      setError(false);
    }
  }, [dateEnd, dateBegin]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {isEditMode ? (
            <KWText
              type="h1"
              style={{ textAlign: "left", flex: 1, padding: 0 }}
            >
              Modification de l'activité
            </KWText>
          ) : (
            <KWText type="h1" style={styles.headerText}>
              Nouvelle activité
            </KWText>
          )}
          {isEditMode && (
            <KWCardButton style={styles.deleteButton}>
              <Ionicons
                name="trash-outline"
                size={25}
                color="#EF4444"
                onPress={handleDelete}
              />
            </KWCardButton>
          )}
        </View>

        {/* Informations de base */}
        <ActivityBasicInfo
          state={{
            activityName,
            activityPlace,
            dateBegin,
            timeBegin,
            dateEnd,
            timeEnd,
            reminderNumber,
            reminderUnit,
          }}
          setters={{
            setActivityName,
            setActivityPlace,
            setDateBegin,
            setTimeBegin,
            setDateEnd,
            setTimeEnd,
            setReminderNumber,
            setReminderUnit,
          }}
          handlers={{
            onChangeDateBegin,
            onChangeTimeBegin,
            onChangeDateEnd,
            onChangeTimeEnd,
            validateReminderNumber,
          }}
          error={error}
        />

        {/* Membres */}
        <ActivityMembers
          members={addMembers}
          onRemove={handleRemoveMember}
          onOpenModal={() => setAddMemberToActivityModal(true)}
        />

        <KWModal
          visible={addMemberToActivityModal}
          onRequestClose={() => setAddMemberToActivityModal(false)}
        >
          <MemberAdd
            currentMembers={addMembers}
            onReturn={(member) => {
              if (member) {
                member = {
                  _id: member._id,
                  firstName: member.firstName,
                  color: member.color,
                };
                setAddMembers([...addMembers, member]);
              }
              setAddMemberToActivityModal(false);
            }}
          />
        </KWModal>

        {/* Checklist */}
        <ActivityChecklist
          checklistItems={checklistItems}
          newChecklistItem={newChecklistItem}
          setNewChecklistItem={setNewChecklistItem}
          onAddItem={addChecklistItem}
          onRemoveItem={removeChecklistItem}
        />

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

        {/* Couleur */}
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
          <KWButton
            icon="backward"
            bgColor={colors.red[1]}
            title="Retour"
            onPress={handleAbort}
          />

          <ButtonSaveUpdate
            dateBegin={dateBegin}
            dateEnd={dateEnd}
            handleSave={handleSave}
            handleUpdate={handleUpdate}
            props={isEditMode ? route.params.activityToEdit : {}}
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
    padding: 15,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
  },
  section: {
    marginBottom: 10,
  },
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  footer: {
    height: 10,
  },
});
