import { View, StyleSheet } from "react-native";
import KWTextInput from "../KWTextInput";
import KWDateTimePicker from "../KWDateTimePicker";
import KWDropdown from "./KWDropdown";
import KWText from "../KWText";
import { colors } from "../../theme/colors";

export default function ActivityBasicInfo({ state, setters, handlers, error }) {
  const {
    activityName,
    activityPlace,
    dateBegin,
    timeBegin,
    dateEnd,
    timeEnd,
    reminderNumber,
    reminderUnit,
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
  } = setters;

  const {
    onChangeDateBegin,
    onChangeTimeBegin,
    onChangeDateEnd,
    onChangeTimeEnd,
    validateReminderNumber,
  } = handlers;

  return (
    <>
      {/* Intitulé */}
      <View style={styles.section}>
        <KWTextInput
          label="Intitulé de l'activité"
          placeholder="Ex: cours de danse..."
          value={activityName}
          onChangeText={setActivityName}
          onBlur={() => setActivityName(activityName.trim())}
        />
      </View>

      {/* Lieu */}
      <View style={styles.section}>
        <KWTextInput
          label="Lieu"
          placeholder="Ex: stade municipal..."
          value={activityPlace}
          onChangeText={setActivityPlace}
          onBlur={() => setActivityPlace(activityPlace.trim())}
        />
      </View>

      {/* Date */}
      <View style={styles.section}>
        <KWDateTimePicker
          label="Début"
          date={dateBegin}
          time={timeBegin}
          onDateChange={onChangeDateBegin}
          onTimeChange={onChangeTimeBegin}
          dateError={
            error ? "La date de fin ne peut être avant la date de début" : ""
          }
        />

        <KWDateTimePicker
          label="Fin"
          date={dateEnd}
          time={timeEnd}
          onDateChange={onChangeDateEnd}
          onTimeChange={onChangeTimeEnd}
          dateError={
            error ? "La date de fin ne peut être avant la date de début" : ""
          }
        />
      </View>

      {/* Rappel */}
      <View style={styles.section}>
        <View style={styles.reminderContainer}>
          <KWTextInput
            label="Rappel"
            style={styles.reminderInput}
            value={reminderNumber}
            keyboardType="numeric"
            onChangeText={(value) =>
              setReminderNumber(validateReminderNumber(value, reminderUnit))
            }
          />
          <View style={styles.dropdown}>
            <KWDropdown
              selectedValue={reminderUnit}
              onValueChange={(value) => {
                setReminderNumber(
                  validateReminderNumber(reminderNumber, value),
                );
                setReminderUnit(value);
              }}
            />
          </View>
          <KWText style={styles.reminderText}>avant</KWText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reminderInput: {
    flex: 1,
  },
  dropdown: {
    flex: 1.5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    backgroundColor: "white",
    overflow: "hidden",
  },
  reminderText: {
    marginLeft: 5,
  },
});
