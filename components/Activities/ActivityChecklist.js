import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import KWTextInput from "../KWTextInput";
import KWText from "../KWText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../theme/colors";

const ActivityChecklist = ({
  checklistItems,
  newChecklistItem,
  setNewChecklistItem,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.addChecklistContainer}>
        <KWTextInput
          minWidth={250}
          label="Penser à :"
          style={styles.checklistInput}
          placeholder="Nouvel élément"
          value={newChecklistItem}
          onChangeText={setNewChecklistItem}
          onBlur={() => setNewChecklistItem(newChecklistItem.trim())}
        />
        <TouchableOpacity style={styles.addChecklistButton} onPress={onAddItem}>
          <Ionicons
            name="add-circle-outline"
            size={40}
            color={colors.blue[1]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.checklistItemsContainer}>
        {checklistItems && checklistItems.length > 0
          ? checklistItems.map((item) => (
              <View key={item._id} style={styles.checklistItem}>
                <KWText type="text" style={styles.checklistItemText}>
                  {item.text}
                </KWText>
                <TouchableOpacity onPress={() => onRemoveItem(item._id)}>
                  <Ionicons name="close" size={25} color="#fc0000ff" />
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>
    </View>
  );
};

export default ActivityChecklist;

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  addChecklistContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checklistInput: {
    flex: 1,
  },
  addChecklistButton: {
    marginLeft: 10,
  },
  checklistItemsContainer: {
    marginTop: 10,
  },
  checklistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#a6c9f1ff",
    backgroundColor: "white",
  },
  checklistItemText: {
    flex: 1,
  },
});
