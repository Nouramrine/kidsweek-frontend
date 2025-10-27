import React, { useState } from "react";
import { globalStyles } from "../theme/globalStyles";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "expo-checkbox";

// Composant réutilisable pour la sélection de date/heure
const DateTimeSelector = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [tempDate, setTempDate] = useState(value);

  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (event.type === "set" && selectedDate) {
        if (mode === "date") {
          setTempDate(selectedDate);
          // Après avoir sélectionné la date, afficher le sélecteur d'heure
          setTimeout(() => {
            setMode("time");
            setShow(true);
          }, 100);
        } else {
          // L'heure a été sélectionnée
          onChange(selectedDate);
        }
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempDate(selectedDate);
        onChange(selectedDate);
      }
    }
  };

  const handleCancel = () => {
    setShow(false);
    setMode("date");
  };

  return (
    <View style={styles.dateTimeSection}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => showPicker("date")}
      >
        <Text style={styles.dateButtonText}>
          📅 {value.toLocaleDateString("fr-FR")} 🕐{" "}
          {value.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const AddScreen = ({ navigation }) => {
  const [activityName, setActivityName] = useState("");
  const [dateBegin, setDateBegin] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [isChecked, setChecked] = useState(false);
  //console.log(dateBegin);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nouvelle activité</Text>
      </View>

      <View style={styles.activityContainer}>
        <View style={styles.activity}>
          <Text style={styles.label}>Intitulé de l'activité</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Ex : cours de danse, entrainement de foot..."
            value={activityName}
            onChangeText={setActivityName}
          />
        </View>

        <View style={styles.activity}>
          <DateTimeSelector
            label="Date et heure de début"
            value={dateBegin}
            onChange={setDateBegin}
          />
        </View>

        <View style={styles.activity}>
          <DateTimeSelector
            label="Date et heure de fin"
            value={dateEnd}
            onChange={setDateEnd}
          />
        </View>
        <View>
          <Text>Récurence</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#5bf596ff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        {isEnabled ? (
          <View style={styles.section}>
            <Text>Répéter le</Text>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Lun.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Mard.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Merc.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Jeud.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Vend.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Sam.</Text>
            </View>
            <View>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
              />
              <Text style={styles.paragraph}>Dim.</Text>
            </View>
            <Text>Répéter tou(te)s les </Text>
          </View>
        ) : (
          ""
        )}
      </View>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  header: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8E7EED",
  },
  activityContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  activity: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  dateTimeSection: {
    width: "100%",
  },
  dateButton: {
    backgroundColor: "#8E7EED",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",

    justifyContent: "space-between",
  },
});
