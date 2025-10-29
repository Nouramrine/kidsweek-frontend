import React from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { colors } from "../theme/colors";

const KWModal = ({ visible, onRequestClose, children }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onRequestClose}>
        <Pressable style={styles.modalContent}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalContent: {
    backgroundColor: colors.background?.[0] || "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default KWModal;